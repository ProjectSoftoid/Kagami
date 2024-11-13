from enum import Enum

"""
ProviderStatus Enum
Copy from kagami_worker/core/provider/base.py
"""


class ProviderStatus(Enum):
    INIT = "init"
    SYNCING = "syncing"
    SUCCESS = "success"
    FAILED = "failed"


class ProviderInfo:
    name: str
    replica_id: int
    upstream_url: str
    provider_method: str

    provider_status: ProviderStatus
