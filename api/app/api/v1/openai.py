import asyncio
import json
import pprint
from typing import Optional
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from langchain.prompts.prompt import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import AIMessage, ToolMessage, AIMessageChunk

from app.core.db.database import SessionDep
from app.core.openai.agents.linkedin_lookup_agent import lookup
from app.core.openai.azure import llm
from app.crud.crud_thread import delete_thread_by_id, get_thread_by_id, get_threads
from app.models.chat import ChatRequest, ChatResponse
from app.utils.random import generate_thread_id


router = APIRouter(tags=["openai"], prefix="/openai")


@router.get("/demo")
async def demo():
    return llm.invoke("hello")


@router.post("/summary")
async def summary_information(data: str):
    summary_template = """
        given the information {information} about a person I want you to create:
        1. A short summary
        2. two interesting facts about them
    """

    summary_prompt_template = PromptTemplate(
        input_variables=["information"], template=summary_template
    )

    chain = summary_prompt_template | llm | StrOutputParser()

    return chain.invoke(input={"information": data})


@router.post("/search")
async def search_linkedin_profile(data: str):
    return lookup(data)


@router.post("/chat")
async def chatbot(request: Request, body: ChatRequest) -> ChatResponse:
    thread_id = body.thread_id

    if body.action == "start":
        thread_id = generate_thread_id()

    config = {"configurable": {"thread_id": thread_id}}
    response = await request.app.state.chatbot_graph.ainvoke(
        {"messages": body.messages}, config=config
    )

    answer_message = response["messages"][-1]

    return ChatResponse(
        id=answer_message.id,
        thread_id=thread_id,
        content=answer_message.content,
        type=answer_message.type,
    )


@router.get("/chat/history")
async def get_chat_history(
    request: Request, thread_id: Optional[str] = None
) -> list[ChatResponse]:
    if thread_id is None or thread_id == "":
        return []

    config = {"configurable": {"thread_id": thread_id}}
    checkpoints = await request.app.state.chatbot_checkpointer.aget(config=config)

    response = []

    if checkpoints is None:
        return response

    for message in checkpoints["channel_values"]["messages"][-10:]:
        if message.type == "ai" or message.type == "":
            if message.response_metadata["finish_reason"] == "tool_calls":
                for call in message.tool_calls:
                    response.append(
                        ChatResponse(
                            id=message.id,
                            thread_id=thread_id,
                            content=f"Data not found. Search data using Tavily: Query => {call['args']['query']}",
                            type="tool",
                        )
                    )
            else:
                response.append(
                    ChatResponse(
                        id=message.id,
                        thread_id=thread_id,
                        content=message.content,
                        type=message.type,
                    )
                )

        if message.type == "human":
            response.append(
                ChatResponse(
                    id=message.id,
                    thread_id=thread_id,
                    content=message.content,
                    type=message.type,
                )
            )

        if message.type == "tool":
            response.append(
                ChatResponse(
                    id=message.id,
                    thread_id=thread_id,
                    content="Searching...",
                    type="tool",
                )
            )

    return response


def streaming_messages(graph, content, thread_id):
    config = {"configurable": {"thread_id": thread_id}}

    for event in graph.stream(
        input={"messages": content},
        config=config,
        stream_mode="updates",
    ):
        for value in event.values():
            last_message = value["messages"][-1]

            if isinstance(last_message, ToolMessage):
                yield '{{"id":"{id}","content":"{content}","type":"{type}","thread_id":"{thread_id}"}}'.format(
                    id=last_message.id,
                    content="Searching...",
                    type="tool",
                    thread_id=thread_id,
                )

            if isinstance(last_message, AIMessage):
                response_metadata = last_message.response_metadata
                id = last_message.id

                if response_metadata["finish_reason"] == "tool_calls":
                    for call in last_message.tool_calls:
                        yield '{{"id":"{id}","content":"{content}","type":"{type}","thread_id":"{thread_id}"}}'.format(
                            id=id,
                            content=f"Data not found. Search data using Tavily: Query => {call['args']['query']}",
                            type="tool",
                            thread_id=thread_id,
                        )

                if response_metadata["finish_reason"] == "stop":
                    yield r'{{"id":"{id}","content":"{content}","type":"{type}","thread_id":"{thread_id}"}}'.format(
                        id=id,
                        content=last_message.content.replace("\n", "\\n"),
                        type="ai",
                        thread_id=thread_id,
                    )


@router.post("/chat/stream")
async def chat_stream(request: Request, session: SessionDep, body: ChatRequest):
    thread_id = body.thread_id

    if body.action == "start":
        thread_id = generate_thread_id(first_message=body.messages[0], session=session)

    return StreamingResponse(
        streaming_messages(
            graph=request.app.state.chatbot_graph,
            content=body.messages,
            thread_id=thread_id,
        )
    )


@router.get("/thread")
async def get_thread_list(session: SessionDep):
    return get_threads(session=session)


@router.get("/thread/{thread_id}")
async def get_thread(thread_id: str, session: SessionDep):
    return get_thread_by_id(session=session, thread_id=thread_id)


@router.delete("/thread/{thread_id}")
async def delete_thread(thread_id: str, session: SessionDep):
    return delete_thread_by_id(session=session, thread_id=thread_id)


async def streaming_tokens(graph, content, thread_id):
    config = {"configurable": {"thread_id": thread_id}}

    async for message, metadata in graph.astream(
        input={"messages": content},
        config=config,
        stream_mode="messages",
    ):
        pprint.pprint(message)
        await asyncio.sleep(0.01)

        if isinstance(message, AIMessageChunk):
            pprint.pprint(message.id)

            if len(message.tool_call_chunks) > 0:
                for call in message.tool_call_chunks:
                    if isinstance(call["args"], str):
                        yield '{{"id":"{id}","content":{content},"type":"{type}","thread_id":"{thread_id}"}}'.format(
                            id=message.id,
                            content=json.dumps(call["args"]),
                            type="tool",
                            thread_id=thread_id,
                        )
                continue

            if (
                message.response_metadata is not None
                and "finish_reason" in message.response_metadata
                and message.response_metadata["finish_reason"] == "tool_calls"
            ):
                yield '{{"id":"{id}","content":"{content}","type":"{type}","thread_id":"{thread_id}"}}'.format(
                    id=message.id + "-tool",
                    content="Searching...",
                    type="tool",
                    thread_id=thread_id,
                )
                continue

            yield '{{"id":"{id}","content":{content},"type":"{type}","thread_id":"{thread_id}"}}'.format(
                id=message.id,
                content=json.dumps(message.content),
                type="ai",
                thread_id=thread_id,
            )


@router.post("/chat/stream/token")
async def chat_stream_token(request: Request, session: SessionDep, body: ChatRequest):
    thread_id = body.thread_id

    if body.action == "start":
        thread_id = generate_thread_id(first_message=body.messages[0], session=session)

    return StreamingResponse(
        streaming_tokens(
            graph=request.app.state.chatbot_graph,
            content=body.messages,
            thread_id=thread_id,
        ),
        media_type="application/json",
    )
