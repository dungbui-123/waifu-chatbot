from pydantic import BaseModel


class ChatRequest(BaseModel):
    messages: list[str]
    thread_id: str
    action: str


class ChatResponse(BaseModel):
    id: str
    content: str
    thread_id: str
    type: str
