from typing import Annotated
from fastapi import Depends
from sqlmodel import SQLModel, Session, create_engine
from app.core.config import settings


POSTGRES_URI = f"postgresql://{settings.DB_USERNAME}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}?sslmode=disable"

engine = create_engine(POSTGRES_URI)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]


def init_db() -> None:
    SQLModel.metadata.create_all(engine)
