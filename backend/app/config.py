from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent  # points to backend/

class Settings(BaseSettings):
    MONGODB_URL: str
    DATABASE_NAME: str
    JWT_SECRET: str
    GEMINI_API_KEY: str

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",  # absolute path to .env
        env_file_encoding="utf-8"
    )

settings = Settings()
