from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.openai.graphs.chatbot import lifespan

from .api import router

app = FastAPI(lifespan=lifespan)

app.include_router(router)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
