from enum import Enum

from .provider_info import ProviderInfo
from .worker_info import WorkerInfo


class ResourceStatus(Enum):
    """
    ResourceStatus Enum
    READY: all the providers sync successfully.
    SYNCING: one or more providers are syncing.
    FAILED: one or more providers are failed, but at least one provider is READY.
    That means this resource is usable but have some error(s).
    ERROR: All providers for this resouce are failed.
    That means this resource is not usable.
    """

    READY = "ready"
    SYNCING = "syncing"
    FAILED = "failed"
    ERROR = "error"


class ResourceInfo:
    name: str
    status: ResourceStatus
    workers: dict[str, WorkerInfo]  # worker_addr -> WorkerInfo
    providers: dict[str, ProviderInfo]  # resource_name -> ProviderInfo

    def __init__(
        self,
        name: str,
        status: ResourceStatus,
        worker_info_list: list[WorkerInfo],
        provider_info_list: list[ProviderInfo],
    ):
        self.name = name
        self.status = status
        self.update_workers(worker_info_list)
        self.update_providers(provider_info_list)

    def update_workers(self, worker_info_list: list[WorkerInfo]):
        for worker_info in worker_info_list:
            self.workers[worker_info.worker_addr] = worker_info

    def update_providers(self, provider_info_list: list[ProviderInfo]):
        for provider_info in provider_info_list:
            self.providers[provider_info.name] = provider_info
