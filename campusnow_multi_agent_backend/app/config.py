from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    openai_api_key: str
    openai_model: str = "openai/gpt-4o-mini"

    supabase_url: str
    supabase_service_role_key: str

    frontend_origin: str = "http://localhost:5173"
    min_verification_confidence: int = 70
    checkin_ttl_minutes: int = 120
    max_agent_iter: int = 4

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()
