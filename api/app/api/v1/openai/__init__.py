from fastapi import APIRouter

from .chatbot import router as chatbot_router
from .thread import router as thread_router
from .waifu_chatbot import router as waifu_chatbot_router

router = APIRouter(prefix="/openai")
router.include_router(chatbot_router)
router.include_router(thread_router)
router.include_router(waifu_chatbot_router)
