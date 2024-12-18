"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import runtime_version as _runtime_version
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
_runtime_version.ValidateProtobufRuntimeVersion(_runtime_version.Domain.PUBLIC, 5, 27, 2, '', 'worker.proto')
_sym_db = _symbol_database.Default()
DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x0cworker.proto\x12\rkagami_worker"0\n\x12GetProviderRequest\x12\x11\n\x04name\x18\x01 \x01(\tH\x00\x88\x01\x01B\x07\n\x05_name"t\n\x0cProviderInfo\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x12\n\nreplica_id\x18\x02 \x01(\x03\x12\x13\n\x0bupstreamurl\x18\x03 \x01(\t\x12-\n\x06status\x18\x04 \x01(\x0e2\x1d.kagami_worker.ProviderStatus"E\n\x13GetProviderResponse\x12.\n\tproviders\x18\x01 \x03(\x0b2\x1b.kagami_worker.ProviderInfo")\n\x0bSyncRequest\x12\x11\n\x04name\x18\x01 \x01(\tH\x00\x88\x01\x01B\x07\n\x05_name"/\n\x0cSyncResponse\x12\x0e\n\x06status\x18\x01 \x01(\x05\x12\x0f\n\x07message\x18\x02 \x01(\t"$\n\x10RegisterResponse\x12\x10\n\x08accepted\x18\x01 \x01(\x08"\x1e\n\x0bRegisterAck\x12\x0f\n\x07message\x18\x01 \x01(\t"-\n\x12HealthCheckRequest\x12\x17\n\x0fsupervisor_addr\x18\x01 \x01(\t"*\n\x13HealthCheckResponse\x12\x13\n\x0bworker_addr\x18\x01 \x01(\t*@\n\x0eProviderStatus\x12\x08\n\x04INIT\x10\x00\x12\x0b\n\x07SYNCING\x10\x01\x12\x0b\n\x07SUCCESS\x10\x02\x12\n\n\x06FAILED\x10\x032\xd8\x02\n\x06Worker\x12M\n\x12sync_from_upstream\x12\x1a.kagami_worker.SyncRequest\x1a\x1b.kagami_worker.SyncResponse\x12P\n\x11register_accepted\x12\x1f.kagami_worker.RegisterResponse\x1a\x1a.kagami_worker.RegisterAck\x12U\n\x0chealth_check\x12!.kagami_worker.HealthCheckRequest\x1a".kagami_worker.HealthCheckResponse\x12V\n\rget_providers\x12!.kagami_worker.GetProviderRequest\x1a".kagami_worker.GetProviderResponseb\x06proto3')
_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'worker_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
    DESCRIPTOR._loaded_options = None
    _globals['_PROVIDERSTATUS']._serialized_start = 523
    _globals['_PROVIDERSTATUS']._serialized_end = 587
    _globals['_GETPROVIDERREQUEST']._serialized_start = 31
    _globals['_GETPROVIDERREQUEST']._serialized_end = 79
    _globals['_PROVIDERINFO']._serialized_start = 81
    _globals['_PROVIDERINFO']._serialized_end = 197
    _globals['_GETPROVIDERRESPONSE']._serialized_start = 199
    _globals['_GETPROVIDERRESPONSE']._serialized_end = 268
    _globals['_SYNCREQUEST']._serialized_start = 270
    _globals['_SYNCREQUEST']._serialized_end = 311
    _globals['_SYNCRESPONSE']._serialized_start = 313
    _globals['_SYNCRESPONSE']._serialized_end = 360
    _globals['_REGISTERRESPONSE']._serialized_start = 362
    _globals['_REGISTERRESPONSE']._serialized_end = 398
    _globals['_REGISTERACK']._serialized_start = 400
    _globals['_REGISTERACK']._serialized_end = 430
    _globals['_HEALTHCHECKREQUEST']._serialized_start = 432
    _globals['_HEALTHCHECKREQUEST']._serialized_end = 477
    _globals['_HEALTHCHECKRESPONSE']._serialized_start = 479
    _globals['_HEALTHCHECKRESPONSE']._serialized_end = 521
    _globals['_WORKER']._serialized_start = 590
    _globals['_WORKER']._serialized_end = 934
