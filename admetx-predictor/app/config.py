from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    predictor_kind: str = "rdkit_hybrid"  # "random" | "rdkit_hybrid"
    predictor_port: int = 8030

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
