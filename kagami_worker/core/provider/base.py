from abc import ABC, abstractmethod
from enum import Enum


class ProviderStatus(Enum):
    INIT = "init"
    SYNCING = "syncing"
    SUCCESS = "success"
    FAILED = "failed"


class BaseProvider(ABC):
    name: str
    replica_id: int
    work_dir: str
    upstream_url: str
    provider_method: str
    retry: bool

    provider_cmdline: str | None
    provider_status: ProviderStatus

    def __init__(
        self,
        name: str,
        work_dir: str,
        upstream_url: str,
        provider_method: str,
        retry: bool,
    ):
        self.name = name
        self.work_dir = work_dir
        self.upstream_url = upstream_url
        self.provider_method = provider_method
        self.retry = retry

        self.provider_status = ProviderStatus.INIT

    @abstractmethod
    async def sync_from_upstream(self):
        raise NotImplementedError("sync_from_upstream Not implemented")
