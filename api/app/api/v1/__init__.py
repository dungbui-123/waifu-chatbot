from fastapi import APIRouter

from .health import router as health_router
from .openai import router as openapi_router

router = APIRouter(prefix="/v1")
router.include_router(health_router)
router.include_router(openapi_router)
