from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_ignore_empty=True, extra="ignore")

    database_url: str = "sqlite:///./hirescope.db"

    # Deployed frontend URL (e.g. https://hirescope.vercel.app)
    frontend_url: str = ""

    # Comma-separated list of extra frontend origins allowed to call the API
    allowed_origins: str = "http://localhost:3000"

    @field_validator("database_url")
    @classmethod
    def normalize_postgres_scheme(cls, value: str) -> str:
        # Railway and Heroku issue "postgres://" URLs, which SQLAlchemy 2 rejects
        if value.startswith("postgres://"):
            return "postgresql://" + value.removeprefix("postgres://")
        return value

    @property
    def allowed_origin_list(self) -> list[str]:
        origins = [self.frontend_url, *self.allowed_origins.split(",")]
        # Browsers send the origin without a trailing slash, so "https://x.app/" would never match
        cleaned = [origin.strip().rstrip("/") for origin in origins if origin.strip()]
        return list(dict.fromkeys(cleaned))


settings = Settings()
