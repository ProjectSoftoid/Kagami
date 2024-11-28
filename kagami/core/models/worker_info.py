import logging
from enum import Enum

from .provider_info import ProviderInfo

logger = logging.getLogger(__name__)


class WorkerStatus(Enum):
    ONLINE = "online"
    OFFLINE = "offline"
    MAINTENANCE = "maintenance"
    ERROR = "error"


class WorkerVerifyStatus(Enum):
    VERIFIED = "Verified"
    UNVERIFIED = "Unverified"


class WorkerInfo:
    """
    WorkerInfo
    Contains infomations of workers required by supervisor

    Note:
    Provider name is unique for a single worker, but it is not unique for all workers.
    That means there could have replica for providers on different workers.

    replica_id is unique for all workers.

    worker_addr is the primary key for identification a worker.
    """

    worker_addr: str
    worker_status: WorkerStatus
    verify_status: WorkerVerifyStatus
    providers: dict[str, ProviderInfo]  # name -> ProviderInfo

    def __init__(self, worker_addr: str):
        self.worker_addr = worker_addr
        self.worker_status = WorkerStatus.ONLINE
        self.verify_status = WorkerVerifyStatus.UNVERIFIED
        self.providers = {}

    def get_provider_by_name(self, name: str) -> ProviderInfo | None:
        provider = self.providers.get(name)
        if not provider:
            logger.warning(f"No provider found: {name}")
        return provider

    def get_provider_by_replica_id(self, replica_id: int) -> ProviderInfo | None:
        provider = None
        for provider in self.providers.values():
            if provider.replica_id == replica_id:
                logger.debug(f"Found provider: {replica_id}:{provider.name}")
                break
        if not provider:
            logger.warning(f"No provider found for replica_id: {replica_id}")
        return provider
