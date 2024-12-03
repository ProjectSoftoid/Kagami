from google.protobuf import empty_pb2 as _empty_pb2
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional
DESCRIPTOR: _descriptor.FileDescriptor

class WorkerReportInRequest(_message.Message):
    __slots__ = ('worker_addr', 'worker_status')
    WORKER_ADDR_FIELD_NUMBER: _ClassVar[int]
    WORKER_STATUS_FIELD_NUMBER: _ClassVar[int]
    worker_addr: str
    worker_status: int

    def __init__(self, worker_addr: _Optional[str]=..., worker_status: _Optional[int]=...) -> None:
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
