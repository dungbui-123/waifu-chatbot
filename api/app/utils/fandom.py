import re
import uuid
from bs4 import BeautifulSoup
import requests

from app.core.openai.agents.fandom_lookup_agent import (
    generate_prompt_from_character_info,
)
from app.models.character import Character
from app.utils.string import generate_slug


def extract_character_info(name: str, fandom_url: str) -> Character:
    page = requests.get(fandom_url)

    soup = BeautifulSoup(page.content, "html.parser")

    character_image_url = soup.select("div.mw-content-ltr figure a")[0]["href"]

    character_infos = soup.select("div.mw-content-ltr p")

    result = []

    for info in character_infos:
        # print(info)
        cleaned_text = (
            re.sub(r"\[\d+\]", "", info.get_text()).replace("\n", " ").strip()
        )
        result.append(cleaned_text)

    return Character(
        id=str(uuid.uuid4()),
        name=name,
        slug=generate_slug(name),
        image_url=character_image_url,
        fandom_url=fandom_url,
        information=result,
        system_prompt=generate_prompt_from_character_info(result),
    )
