from pydantic_settings import BaseSettings


class ProviderConfig(BaseSettings):
    name: str
    work_dir: str
    upstream_url: str
    provider_method: str
    retry: bool

    # for rsync provider
    rsync_options: list[str]


class WorkerConfig(BaseSettings):
    grpc_host: str = "0.0.0.0"
    grpc_port: int = 21000
    supervisor_host: str = "127.0.0.1"
    supervisor_port: int = 21001

    log_file: str = "/var/log/kagami_worker.log"
    log_level: str = "INFO"
    parallel_limit: int = 10

    providers: list[ProviderConfig] | None = None

    class Config:
        env_prefix = "KAGAMI_"
