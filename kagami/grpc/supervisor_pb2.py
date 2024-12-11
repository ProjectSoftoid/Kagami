"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import runtime_version as _runtime_version
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
_runtime_version.ValidateProtobufRuntimeVersion(_runtime_version.Domain.PUBLIC, 5, 27, 2, '', 'supervisor.proto')
_sym_db = _symbol_database.Default()
DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x10supervisor.proto\x12\x11kagami_supervisor"1\n\x16WorkerReportInResponse\x12\x17\n\x0fsupervisor_addr\x18\x01 \x01(\t"3\n\x1cUpdateProviderStatusResponse\x12\x13\n\x0bprovider_id\x18\x01 \x01(\x05",\n\x15WorkerReportInRequest\x12\x13\n\x0bworker_addr\x18\x01 \x01(\t"$\n\x10RegisterResponse\x12\x10\n\x08accepted\x18\x01 \x01(\x08"b\n\x15UpdateProviderRequest\x12\x13\n\x0bworker_addr\x18\x01 \x01(\t\x12\x1b\n\x13provider_replica_id\x18\x02 \x01(\x05\x12\x17\n\x0fprovider_status\x18\x03 \x01(\x052\xe9\x01\n\nSupervisor\x12f\n\x10worker_report_in\x12(.kagami_supervisor.WorkerReportInRequest\x1a(.kagami_supervisor.WorkerReportInRequest\x12s\n\x16update_provider_status\x12(.kagami_supervisor.UpdateProviderRequest\x1a/.kagami_supervisor.UpdateProviderStatusResponseb\x06proto3')
_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'supervisor_pb2', _globals)
if not _descriptor._USE_C_DESCRIPTORS:
    DESCRIPTOR._loaded_options = None
    _globals['_WORKERREPORTINRESPONSE']._serialized_start = 39
    _globals['_WORKERREPORTINRESPONSE']._serialized_end = 88
    _globals['_UPDATEPROVIDERSTATUSRESPONSE']._serialized_start = 90
    _globals['_UPDATEPROVIDERSTATUSRESPONSE']._serialized_end = 141
    _globals['_WORKERREPORTINREQUEST']._serialized_start = 143
    _globals['_WORKERREPORTINREQUEST']._serialized_end = 187
    _globals['_REGISTERRESPONSE']._serialized_start = 189
    _globals['_REGISTERRESPONSE']._serialized_end = 225
    _globals['_UPDATEPROVIDERREQUEST']._serialized_start = 227
    _globals['_UPDATEPROVIDERREQUEST']._serialized_end = 325
    _globals['_SUPERVISOR']._serialized_start = 328
    _globals['_SUPERVISOR']._serialized_end = 561
