"""Client and server classes corresponding to protobuf-defined services."""
import grpc
import warnings
from google.protobuf import empty_pb2 as google_dot_protobuf_dot_empty__pb2
from . import supervisor_pb2 as supervisor__pb2
GRPC_GENERATED_VERSION = '1.67.1'
GRPC_VERSION = grpc.__version__
_version_not_supported = False
try:
    from grpc._utilities import first_version_is_lower
    _version_not_supported = first_version_is_lower(GRPC_VERSION, GRPC_GENERATED_VERSION)
except ImportError:
    _version_not_supported = True
if _version_not_supported:
    raise RuntimeError(f'The grpc package installed is at version {GRPC_VERSION},' + f' but the generated code in supervisor_pb2_grpc.py depends on' + f' grpcio>={GRPC_GENERATED_VERSION}.' + f' Please upgrade your grpc module to grpcio>={GRPC_GENERATED_VERSION}' + f' or downgrade your generated code using grpcio-tools<={GRPC_VERSION}.')

class SupervisorStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.worker_report_in = channel.unary_unary('/kagami_supervisor.Supervisor/worker_report_in', request_serializer=supervisor__pb2.WorkerReportInRequest.SerializeToString, response_deserializer=google_dot_protobuf_dot_empty__pb2.Empty.FromString, _registered_method=True)
        self.update_provider_status = channel.unary_unary('/kagami_supervisor.Supervisor/update_provider_status', request_serializer=supervisor__pb2.UpdateProviderRequest.SerializeToString, response_deserializer=google_dot_protobuf_dot_empty__pb2.Empty.FromString, _registered_method=True)

class SupervisorServicer(object):
    """Missing associated documentation comment in .proto file."""

    def worker_report_in(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def update_provider_status(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

def add_SupervisorServicer_to_server(servicer, server):
    rpc_method_handlers = {'worker_report_in': grpc.unary_unary_rpc_method_handler(servicer.worker_report_in, request_deserializer=supervisor__pb2.WorkerReportInRequest.FromString, response_serializer=google_dot_protobuf_dot_empty__pb2.Empty.SerializeToString), 'update_provider_status': grpc.unary_unary_rpc_method_handler(servicer.update_provider_status, request_deserializer=supervisor__pb2.UpdateProviderRequest.FromString, response_serializer=google_dot_protobuf_dot_empty__pb2.Empty.SerializeToString)}
    generic_handler = grpc.method_handlers_generic_handler('kagami_supervisor.Supervisor', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))
    server.add_registered_method_handlers('kagami_supervisor.Supervisor', rpc_method_handlers)

class Supervisor(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def worker_report_in(request, target, options=(), channel_credentials=None, call_credentials=None, insecure=False, compression=None, wait_for_ready=None, timeout=None, metadata=None):
        return grpc.experimental.unary_unary(request, target, '/kagami_supervisor.Supervisor/worker_report_in', supervisor__pb2.WorkerReportInRequest.SerializeToString, google_dot_protobuf_dot_empty__pb2.Empty.FromString, options, channel_credentials, insecure, call_credentials, compression, wait_for_ready, timeout, metadata, _registered_method=True)

    @staticmethod
    def update_provider_status(request, target, options=(), channel_credentials=None, call_credentials=None, insecure=False, compression=None, wait_for_ready=None, timeout=None, metadata=None):
        return grpc.experimental.unary_unary(request, target, '/kagami_supervisor.Supervisor/update_provider_status', supervisor__pb2.UpdateProviderRequest.SerializeToString, google_dot_protobuf_dot_empty__pb2.Empty.FromString, options, channel_credentials, insecure, call_credentials, compression, wait_for_ready, timeout, metadata, _registered_method=True)