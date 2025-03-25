from fastapi import APIRouter

from .health import router as health_router
from .demo import router as demo_router
from .openai import router as openai_router

router = APIRouter(prefix="/v1")
router.include_router(health_router)
router.include_router(demo_router)
router.include_router(openai_router)
