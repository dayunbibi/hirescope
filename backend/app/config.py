from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_ignore_empty=True, extra="ignore")

    database_url: str = "sqlite:///./hirescope.db"

    # Comma-separated list of frontend origins allowed to call the API
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
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


settings = Settings()
