from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


@lru_cache
def get_configs():
    return SupervisorConfig()

class SupervisorConfig(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="kagami_supervisor_",
        env_file=(Path("kagami", "config.env")),
        env_ignore_empty=True,
        extra="ignore",
    )

    http_host: str = "0.0.0.0"
    http_port: int = 21000
    grpc_host: str = "0.0.0.0"
    grpc_port: int = 22000

    log_file: str = "/var/log/kagami.log"
    log_level: str = "INFO"
    database_url: str = "change_me"
