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
    providers: dict[str, ProviderInfo]  # worker_addr -> ProviderInfo
