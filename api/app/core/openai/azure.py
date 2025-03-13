from langchain_openai import AzureChatOpenAI

from ..config import settings

API_KEY = settings.AZURE_OPENAI_API_KEY
API_VERSION = settings.AZURE_OPENAI_API_VERSION
AZURE_ENDPOINT = settings.AZURE_OPENAI_ENDPOINT


llm = AzureChatOpenAI(
    api_key=API_KEY,
    api_version=API_VERSION,
    azure_endpoint=AZURE_ENDPOINT,
    streaming=True,
)
