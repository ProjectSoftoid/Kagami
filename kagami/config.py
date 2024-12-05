import logging
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)

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

class ConfigManager:
    overrides: dict
    prebuild_config: SupervisorConfig

    @classmethod
    def init(cls, overrides: dict):
        cls.prebuild_config = SupervisorConfig(**overrides)

    @classmethod
    def get_configs(cls) -> SupervisorConfig:
        if cls.prebuild_config:
            return cls.prebuild_config
        else:
            logger.error("Run ConfigManager without init")
            cls.prebuild_config = SupervisorConfig()
            return cls.prebuild_config
