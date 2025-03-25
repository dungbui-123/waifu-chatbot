import uuid
from sqlmodel import Field, SQLModel


class Character(SQLModel, table=True):
    __tablename__ = "characters"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True, max_length=100, unique=True)
    slug: str = Field(index=True, max_length=100, unique=True)
    image_url: str = Field(max_length=255)
    fandom_url: str = Field(max_length=255)
    information: str  # JSON string format
    system_prompt: str  # system prompt for chatbot
