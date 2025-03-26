import pprint
import re
from urllib.parse import urlparse
import uuid
from bs4 import BeautifulSoup
import requests

from app.core.openai.agents.fandom_lookup_agent import (
    generate_prompt_from_character_info,
)
from app.models.character import Character
from app.utils.string import generate_slug


def extract_fandom_name(fandom_url: str) -> str:
    parsed_url = urlparse(fandom_url)
    path_parts = parsed_url.path.split("/")
    fandom_name = (
        path_parts[1] if len(path_parts) > 2 else parsed_url.netloc.split(".")[0]
    )
    return fandom_name


def extract_character_info(fandom_url: str) -> Character:
    page = requests.get(fandom_url)

    soup = BeautifulSoup(page.content, "html.parser")

    character_name = soup.select("span.mw-page-title-main")[0].get_text()

    character_image_url = soup.find("meta", property="og:image")["content"]

    fandom_image_url = soup.find(
        "img", attrs={"data-test": "fandom-community-header-community-logo"}
    )["src"]

    fandom_name = extract_fandom_name(character_image_url)

    fandom_background_image_url = ""
    header_bg_div = soup.select("div.fandom-community-header__background")[0]["style"]
    if header_bg_div:
        fandom_background_image_url = f"https://static.wikia.nocookie.net/{fandom_name}/images/b/b5/Site-background-light/revision/latest"

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
        name=character_name,
        slug=generate_slug(character_name),
        image_url=character_image_url,
        fandom_name=fandom_name,
        fandom_url=fandom_url,
        fandom_image_url=fandom_image_url,
        fandom_background_image_url=fandom_background_image_url,
        information=result,
        system_prompt=generate_prompt_from_character_info(result),
    )
