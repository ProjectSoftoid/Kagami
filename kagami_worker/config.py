import logging
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)


class WorkerConfig(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="kagami_worker_",
        env_file=(Path("kagami_worker", "config.env")),
        env_ignore_empty=True,
        extra="ignore",
    )

    grpc_host: str = "0.0.0.0"
    grpc_port: int = 23000

    supervisor_host: str = "127.0.0.1"
    supervisor_port: int = 22000

    log_file: str = "/var/log/kagami_worker.log"
    log_level: str = "INFO"
    parallel_limit: int = 10

    config_folder: str = "kagami_worker/worker_config/"


class ConfigManager:
    overrides: dict
    prebuild_config: WorkerConfig

    @classmethod
    def init(cls, overrides: dict):
        cls.prebuild_config = WorkerConfig(**overrides)

    @classmethod
    def get_configs(cls) -> WorkerConfig:
        if cls.prebuild_config:
            return cls.prebuild_config
        else:
            logger.error("Run ConfigManager without init")
            cls.prebuild_config = WorkerConfig()
            return cls.prebuild_config
