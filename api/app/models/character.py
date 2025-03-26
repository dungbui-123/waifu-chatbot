import uuid
from sqlmodel import Field, SQLModel
from pydantic import BaseModel


class Character(SQLModel, table=True):
    __tablename__ = "characters"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True, max_length=100, unique=True)
    slug: str = Field(index=True, max_length=100, unique=True)
    image_url: str = Field(max_length=255)
    fandom_name: str = Field(index=True, max_length=100)
    fandom_url: str = Field(max_length=255, unique=True)
    fandom_image_url: str = Field(max_length=255)
    fandom_background_image_url: str = Field(max_length=255)
    information: str  # JSON string format
    system_prompt: str  # system prompt for chatbot


class CharacterResponse(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    image_url: str
    fandom_name: str
    fandom_url: str
    fandom_image_url: str
    fandom_background_image_url: str
