from typing import Annotated
from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from typing_extensions import TypedDict
from app.core.db.database import POSTGRES_URI, init_db
from psycopg_pool import AsyncConnectionPool


from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages

from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from langgraph.prebuilt import ToolNode, tools_condition

from ..azure import llm
from ..tools.search import search_user_question_tool


class State(TypedDict):
    messages: Annotated[list, add_messages]


llm_with_tools = llm.bind_tools([search_user_question_tool])


def chatbot(state: State):
    return {"messages": [llm_with_tools.invoke(state["messages"])]}


# init postgres saver
memory_connection_kwargs = {
    "autocommit": True,
    "prepare_threshold": 0,
}

graph_builder = StateGraph(state_schema=State)

graph_builder.set_entry_point("chatbot")
graph_builder.add_node("chatbot", chatbot)

graph_builder.add_node("tools", ToolNode(tools=[search_user_question_tool]))
graph_builder.add_conditional_edges("chatbot", tools_condition)
graph_builder.add_edge("tools", "chatbot")


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()

    async with AsyncConnectionPool(
        conninfo=POSTGRES_URI, max_size=20, kwargs=memory_connection_kwargs
    ) as pool:
        checkpointer = AsyncPostgresSaver(pool)
        await checkpointer.setup()

        app.state.chatbot_checkpointer = checkpointer
        graph = graph_builder.compile(checkpointer=checkpointer)

        app.state.chatbot_graph = graph

        yield
