"""Client and server classes corresponding to protobuf-defined services."""
import grpc
import warnings
from . import worker_pb2 as worker__pb2
GRPC_GENERATED_VERSION = '1.67.1'
GRPC_VERSION = grpc.__version__
_version_not_supported = False
try:
    from grpc._utilities import first_version_is_lower
    _version_not_supported = first_version_is_lower(GRPC_VERSION, GRPC_GENERATED_VERSION)
except ImportError:
    _version_not_supported = True
if _version_not_supported:
    raise RuntimeError(f'The grpc package installed is at version {GRPC_VERSION},' + f' but the generated code in worker_pb2_grpc.py depends on' + f' grpcio>={GRPC_GENERATED_VERSION}.' + f' Please upgrade your grpc module to grpcio>={GRPC_GENERATED_VERSION}' + f' or downgrade your generated code using grpcio-tools<={GRPC_VERSION}.')

class WorkerStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.sync_from_upstream = channel.unary_unary('/kagami_worker.Worker/sync_from_upstream', request_serializer=worker__pb2.SyncRequest.SerializeToString, response_deserializer=worker__pb2.SyncResponse.FromString, _registered_method=True)
        self.register_accepted = channel.unary_unary('/kagami_worker.Worker/register_accepted', request_serializer=worker__pb2.RegisterResponse.SerializeToString, response_deserializer=worker__pb2.RegisterAck.FromString, _registered_method=True)
        self.health_check = channel.unary_unary('/kagami_worker.Worker/health_check', request_serializer=worker__pb2.HealthCheckRequest.SerializeToString, response_deserializer=worker__pb2.HealthCheckResponse.FromString, _registered_method=True)
        self.get_providers = channel.unary_unary('/kagami_worker.Worker/get_providers', request_serializer=worker__pb2.GetProviderRequest.SerializeToString, response_deserializer=worker__pb2.GetProviderResponse.FromString, _registered_method=True)

class WorkerServicer(object):
    """Missing associated documentation comment in .proto file."""

    def sync_from_upstream(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def register_accepted(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def health_check(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def get_providers(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

def add_WorkerServicer_to_server(servicer, server):
    rpc_method_handlers = {'sync_from_upstream': grpc.unary_unary_rpc_method_handler(servicer.sync_from_upstream, request_deserializer=worker__pb2.SyncRequest.FromString, response_serializer=worker__pb2.SyncResponse.SerializeToString), 'register_accepted': grpc.unary_unary_rpc_method_handler(servicer.register_accepted, request_deserializer=worker__pb2.RegisterResponse.FromString, response_serializer=worker__pb2.RegisterAck.SerializeToString), 'health_check': grpc.unary_unary_rpc_method_handler(servicer.health_check, request_deserializer=worker__pb2.HealthCheckRequest.FromString, response_serializer=worker__pb2.HealthCheckResponse.SerializeToString), 'get_providers': grpc.unary_unary_rpc_method_handler(servicer.get_providers, request_deserializer=worker__pb2.GetProviderRequest.FromString, response_serializer=worker__pb2.GetProviderResponse.SerializeToString)}
    generic_handler = grpc.method_handlers_generic_handler('kagami_worker.Worker', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))
    server.add_registered_method_handlers('kagami_worker.Worker', rpc_method_handlers)

class Worker(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def sync_from_upstream(request, target, options=(), channel_credentials=None, call_credentials=None, insecure=False, compression=None, wait_for_ready=None, timeout=None, metadata=None):
        return grpc.experimental.unary_unary(request, target, '/kagami_worker.Worker/sync_from_upstream', worker__pb2.SyncRequest.SerializeToString, worker__pb2.SyncResponse.FromString, options, channel_credentials, insecure, call_credentials, compression, wait_for_ready, timeout, metadata, _registered_method=True)

    @staticmethod
    def register_accepted(request, target, options=(), channel_credentials=None, call_credentials=None, insecure=False, compression=None, wait_for_ready=None, timeout=None, metadata=None):
        return grpc.experimental.unary_unary(request, target, '/kagami_worker.Worker/register_accepted', worker__pb2.RegisterResponse.SerializeToString, worker__pb2.RegisterAck.FromString, options, channel_credentials, insecure, call_credentials, compression, wait_for_ready, timeout, metadata, _registered_method=True)

    @staticmethod
    def health_check(request, target, options=(), channel_credentials=None, call_credentials=None, insecure=False, compression=None, wait_for_ready=None, timeout=None, metadata=None):
        return grpc.experimental.unary_unary(request, target, '/kagami_worker.Worker/health_check', worker__pb2.HealthCheckRequest.SerializeToString, worker__pb2.HealthCheckResponse.FromString, options, channel_credentials, insecure, call_credentials, compression, wait_for_ready, timeout, metadata, _registered_method=True)

    @staticmethod
    def get_providers(request, target, options=(), channel_credentials=None, call_credentials=None, insecure=False, compression=None, wait_for_ready=None, timeout=None, metadata=None):
        return grpc.experimental.unary_unary(request, target, '/kagami_worker.Worker/get_providers', worker__pb2.GetProviderRequest.SerializeToString, worker__pb2.GetProviderResponse.FromString, options, channel_credentials, insecure, call_credentials, compression, wait_for_ready, timeout, metadata, _registered_method=True)
