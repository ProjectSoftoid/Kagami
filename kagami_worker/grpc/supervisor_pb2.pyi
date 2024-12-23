from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional
DESCRIPTOR: _descriptor.FileDescriptor

class WorkerReportInResponse(_message.Message):
    __slots__ = ('supervisor_addr',)
    SUPERVISOR_ADDR_FIELD_NUMBER: _ClassVar[int]
    supervisor_addr: str

    def __init__(self, supervisor_addr: _Optional[str]=...) -> None:
        ...

class UpdateProviderStatusResponse(_message.Message):
    __slots__ = ('provider_id',)
    PROVIDER_ID_FIELD_NUMBER: _ClassVar[int]
    provider_id: int

    def __init__(self, provider_id: _Optional[int]=...) -> None:
        ...

class WorkerReportInRequest(_message.Message):
    __slots__ = ('worker_addr',)
    WORKER_ADDR_FIELD_NUMBER: _ClassVar[int]
    worker_addr: str

    def __init__(self, worker_addr: _Optional[str]=...) -> None:
        ...

class RegisterResponse(_message.Message):
    __slots__ = ('accepted',)
    ACCEPTED_FIELD_NUMBER: _ClassVar[int]
    accepted: bool

    def __init__(self, accepted: bool=...) -> None:
        ...

class UpdateProviderRequest(_message.Message):
    __slots__ = ('worker_addr', 'provider_replica_id', 'provider_status')
    WORKER_ADDR_FIELD_NUMBER: _ClassVar[int]
    PROVIDER_REPLICA_ID_FIELD_NUMBER: _ClassVar[int]
    PROVIDER_STATUS_FIELD_NUMBER: _ClassVar[int]
    worker_addr: str
    provider_replica_id: int
    provider_status: int

    def __init__(self, worker_addr: _Optional[str]=..., provider_replica_id: _Optional[int]=..., provider_status: _Optional[int]=...) -> None:
        ...
