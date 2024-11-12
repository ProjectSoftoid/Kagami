from pydantic_settings import BaseSettings


class SupervisorConfig(BaseSettings):
    grpc_host: str = "0.0.0.0"
    grpc_port: int = 21001

    log_file: str = "/var/log/kagami_worker.log"
    log_level: str = "INFO"

    class Config:
        env_prefix = "KAGAMI_SUPERVISOR_"
