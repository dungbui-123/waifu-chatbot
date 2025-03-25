from sqlmodel import Session, select

from app.models.character import Character


def create_character(*, session: Session, character_create: Character) -> Character:
    session.add(character_create)
    session.commit()
    session.refresh(character_create)
    return character_create


def get_character_by_name(*, session: Session, character_name: str) -> Character:
    statement = select(Character).where(Character.name == character_name)
    founded_character = session.exec(statement).first()
    return founded_character


def get_character_by_slug(*, session: Session, character_slug: str) -> Character:
    statement = select(Character).where(Character.slug == character_slug)
    founded_character = session.exec(statement).first()
    return founded_character


def get_characters(*, session: Session) -> list[Character]:
    statement = select(Character).order_by(Character.id)
    founded_characters = session.exec(statement).all()
    return founded_characters
