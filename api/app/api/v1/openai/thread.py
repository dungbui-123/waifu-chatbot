from fastapi import APIRouter

from app.core.db.database import SessionDep
from app.crud.crud_thread import delete_thread_by_id, get_thread_by_id, get_threads


router = APIRouter(tags=["openai-thread"], prefix="/thread")


@router.get("/")
async def get_thread_list(session: SessionDep):
    return get_threads(session=session)


@router.get("/{thread_id}")
async def get_thread(thread_id: str, session: SessionDep):
    return get_thread_by_id(session=session, thread_id=thread_id)


@router.delete("/{thread_id}")
async def delete_thread(thread_id: str, session: SessionDep):
    return delete_thread_by_id(session=session, thread_id=thread_id)
