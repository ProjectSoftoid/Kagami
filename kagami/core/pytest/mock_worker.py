from ...grpc import worker_pb2, worker_pb2_grpc


class MockWorker(worker_pb2_grpc.WorkerServicer):
    async def sync_from_upstream(self, request, context):
        return worker_pb2.SyncResponse(status=0, message="Mock sync success")

    async def register_accepted(self, request, context):
        return worker_pb2.RegisterAck(message="Mock register accepted")

    async def health_check(self, request, context):
        return worker_pb2.HealthCheckResponse(worker_addr="mock_worker_addr")

    async def get_providers(self, request, context):
        mock_provider_info = worker_pb2.ProviderInfo(
            name="mock_provider",
            replica_id=123,
            upstreamurl="rsync://mock_upstream_url",
            status=worker_pb2.ProviderStatus.SUCCESS,
        )
        return worker_pb2.GetProviderResponse(providers=[mock_provider_info])
