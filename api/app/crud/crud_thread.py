from sqlmodel import Session, select

from app.models.thread import Thread


def create_thread(*, session: Session, thread_create: Thread) -> Thread:
    session.add(thread_create)
    session.commit()
    session.refresh(thread_create)
    return thread_create


def get_threads(*, session: Session) -> list[Thread]:
    statement = select(Thread).order_by(Thread.id)
    founded_threads = session.exec(statement).all()
    return founded_threads


def get_thread_by_id(*, session: Session, thread_id: str) -> Thread:
    if isinstance(thread_id, str) and len(thread_id) != 36:
        return None

    statement = select(Thread).where(Thread.id == thread_id)
    founded_thread = session.exec(statement).first()
    return founded_thread


def delete_thread_by_id(*, session: Session, thread_id: str) -> Thread:
    if isinstance(thread_id, str) and len(thread_id) != 36:
        return None

    statement = select(Thread).where(Thread.id == thread_id)
    founded_thread = session.exec(statement).first()
    session.delete(founded_thread)
    session.commit()
    return founded_thread
