import os

from pydantic_settings import BaseSettings
from starlette.config import Config

current_file_dir = os.path.dirname(os.path.realpath(__file__))
env_path = os.path.join(current_file_dir, "..", "..", ".env")
config = Config(env_path)


class AzureOpenAiSettings(BaseSettings):
    AZURE_OPENAI_API_KEY: str = config(
        "AZURE_OPENAI_API_KEY", default="azure-open-ai-api-key"
    )
    AZURE_OPENAI_API_VERSION: str = config(
        "AZURE_OPENAI_API_VERSION", default="api-version"
    )
    AZURE_OPENAI_ENDPOINT: str = config(
        "AZURE_OPENAI_ENDPOINT", default="http://openapi/endpoint.example"
    )


class TavilySettings(BaseSettings):
    TAVILY_API_KEY: str = config("TAVILY_API_KEY", default="api-key")


class DatabaseSettings(BaseSettings):
    DB_HOST: str = config("DB_HOST", default="localhost")
    DB_PORT: str = config("DB_PORT", default="5432")
    DB_USERNAME: str = config("DB_USERNAME", default="postgres")
    DB_PASSWORD: str = config("DB_PASSWORD", default="postgres")
    DB_NAME: str = config("DB_NAME", default="chatbot")


class Settings(AzureOpenAiSettings, TavilySettings, DatabaseSettings):
    pass


settings = Settings()
