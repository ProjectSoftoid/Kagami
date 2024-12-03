from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union
DESCRIPTOR: _descriptor.FileDescriptor

class ProviderStatus(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    INIT: _ClassVar[ProviderStatus]
    SYNCING: _ClassVar[ProviderStatus]
    SUCCESS: _ClassVar[ProviderStatus]
    FAILED: _ClassVar[ProviderStatus]
INIT: ProviderStatus
SYNCING: ProviderStatus
SUCCESS: ProviderStatus
FAILED: ProviderStatus

class GetProviderRequest(_message.Message):
    __slots__ = ('name',)
    NAME_FIELD_NUMBER: _ClassVar[int]
    name: str

    def __init__(self, name: _Optional[str]=...) -> None:
        ...

class GetProviderResponse(_message.Message):
    __slots__ = ('name', 'replica_id', 'upstreamurl', 'status')
    NAME_FIELD_NUMBER: _ClassVar[int]
    REPLICA_ID_FIELD_NUMBER: _ClassVar[int]
    UPSTREAMURL_FIELD_NUMBER: _ClassVar[int]
    STATUS_FIELD_NUMBER: _ClassVar[int]
    name: str
    replica_id: int
    upstreamurl: str
    status: ProviderStatus

    def __init__(self, name: _Optional[str]=..., replica_id: _Optional[int]=..., upstreamurl: _Optional[str]=..., status: _Optional[_Union[ProviderStatus, str]]=...) -> None:
        ...

class SyncRequest(_message.Message):
    __slots__ = ('name',)
    NAME_FIELD_NUMBER: _ClassVar[int]
    name: str

    def __init__(self, name: _Optional[str]=...) -> None:
        ...

class SyncResponse(_message.Message):
    __slots__ = ('status', 'message')
    STATUS_FIELD_NUMBER: _ClassVar[int]
    MESSAGE_FIELD_NUMBER: _ClassVar[int]
    status: int
    message: str

    def __init__(self, status: _Optional[int]=..., message: _Optional[str]=...) -> None:
        ...

class RegisterResponse(_message.Message):
    __slots__ = ('accepted',)
    ACCEPTED_FIELD_NUMBER: _ClassVar[int]
    accepted: bool

    def __init__(self, accepted: bool=...) -> None:
        ...

class RegisterAck(_message.Message):
    __slots__ = ('message',)
    MESSAGE_FIELD_NUMBER: _ClassVar[int]
    message: str

    def __init__(self, message: _Optional[str]=...) -> None:
        ...

class HealthCheckRequest(_message.Message):
    __slots__ = ('supervisor_addr',)
    SUPERVISOR_ADDR_FIELD_NUMBER: _ClassVar[int]
    supervisor_addr: str

    def __init__(self, supervisor_addr: _Optional[str]=...) -> None:
        ...

class HealthCheckResponse(_message.Message):
    __slots__ = ('worker_addr',)
    WORKER_ADDR_FIELD_NUMBER: _ClassVar[int]
    worker_addr: str

    def __init__(self, worker_addr: _Optional[str]=...) -> None:
        ...
