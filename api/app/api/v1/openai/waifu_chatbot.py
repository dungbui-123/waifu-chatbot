import re
import uuid
from app.models.character import CharacterResponse
from fastapi import APIRouter, Request
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from bs4 import BeautifulSoup
import requests

from app.core.db.database import SessionDep
from app.core.openai.agents.fandom_lookup_agent import (
    fandom_lookup,
    generate_prompt_from_character_info,
)
from app.core.openai.azure import llm
from app.crud.crud_character import (
    create_character,
    get_character_by_fandom_url,
    get_character_by_slug,
)
from app.models.chat import ChatRequest, ChatResponse
from app.utils.fandom import extract_character_info


router = APIRouter(tags=["openai-character-chatbot"], prefix="/character-chatbot")


@router.post("/demo")
async def demo(request: Request, character_name: str, message: str):
    # fandom_url = "https://onepiece.fandom.com/wiki/Nami"

    fandom_url = fandom_lookup(character_name)

    print(fandom_url)

    page = requests.get(fandom_url)

    soup = BeautifulSoup(page.content, "html.parser")

    # character_image_url = soup.select("div.mw-content-ltr figure a")[0]["href"]

    character_infos = soup.select("div.mw-content-ltr p")

    result = []

    for info in character_infos:
        # print(info)
        cleaned_text = (
            re.sub(r"\[\d+\]", "", info.get_text()).replace("\n", " ").strip()
        )
        result.append(cleaned_text)

    # return generate_prompt_from_character_info(result)

    prompt_template = ChatPromptTemplate(
        [
            ("system", "{system_prompt}"),
            ("user", "{message}"),
        ]
    )

    chain = prompt_template | llm | StrOutputParser()

    return chain.invoke(
        input={
            "system_prompt": generate_prompt_from_character_info(result),
            "message": message,
        }
    )


@router.get("/lookup")
async def character_lookup(
    session: SessionDep, character_name: str
) -> CharacterResponse:
    fandom_url = await fandom_lookup(character_name)

    # check if character exists in database
    character = get_character_by_fandom_url(session=session, fandom_url=fandom_url)
    if character:
        return character

    found_character = extract_character_info(fandom_url)

    # save character to database
    character = create_character(session=session, character_create=found_character)

    return character


@router.get("/{character_slug}/start")
async def start_chat_thread(
    request: Request, session: SessionDep, character_slug: str
) -> ChatResponse:
    thread_id = str(uuid.uuid4())

    character = get_character_by_slug(session=session, character_slug=character_slug)

    if not character:
        return {"error": "Character not found"}

    response = await request.app.state.chatbot_graph.ainvoke(
        input={
            "messages": [
                {"type": "system", "content": character.system_prompt},
                {"type": "user", "content": "Hello"},
            ]
        },
        config={"configurable": {"thread_id": thread_id}},
    )

    answer_message = response["messages"][-1]

    return ChatResponse(
        id=answer_message.id,
        thread_id=thread_id,
        content=answer_message.content,
        type=answer_message.type,
    )


@router.post("/{character_slug}/chat")
async def chat_with_character(request: Request, body: ChatRequest) -> ChatResponse:
    thread_id = body.thread_id

    response = await request.app.state.chatbot_graph.ainvoke(
        {"messages": body.messages}, config={"configurable": {"thread_id": thread_id}}
    )

    answer_message = response["messages"][-1]

    return ChatResponse(
        id=answer_message.id,
        thread_id=thread_id,
        content=answer_message.content,
        type=answer_message.type,
    )


@router.get("/{character_slug}")
async def get_character_info(
    session: SessionDep, character_slug: str
) -> CharacterResponse:
    character = get_character_by_slug(session=session, character_slug=character_slug)

    if not character:
        return {"error": "Character not found"}

    return character
