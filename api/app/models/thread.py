import uuid
from sqlmodel import Field, SQLModel


class Thread(SQLModel, table=True):
    __tablename__ = "threads"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(index=True, max_length=100)
    user_id: int
