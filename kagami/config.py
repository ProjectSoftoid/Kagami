from pydantic_settings import BaseSettings


class SupervisorConfig(BaseSettings):
    grpc_host: str = "0.0.0.0"
    grpc_port: int = 21001

    tls_cert_path: str | None = None
    tls_key_path: str | None = None
    tls_ca_cert_path: str | None = None

    log_file: str = "/var/log/kagami_worker.log"
    log_level: str = "INFO"
    database_url: str = "change_me"

    class Config:
        env_prefix = "KAGAMI_SUPERVISOR_"
        env_file = "config.env"
