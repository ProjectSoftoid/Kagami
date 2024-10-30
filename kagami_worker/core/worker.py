import grpc
import logging

# from ..config import WorkerConfig
from ..core.provider import BaseProvider
from ...grpc.worker import worker_pb2_grpc
from ...grpc.supervisor import supervisor_pb2_grpc, supervisor_pb2

logger = logging.getLogger(__name__)


class Worker(worker_pb2_grpc.WorkerServicer):
    worker_addr: str
    supervisor_addr: str
    registered: bool

    providers: dict[str, BaseProvider]  # name -> Provider

    def __init__(
        self,
        worker_host: str,
        worker_port: int,
        supervisor_host: str,
        supervisor_port: int,
        providers: list[BaseProvider],
    ):
        super().__init__()
        self.worker_addr = self._parse_address(worker_host, worker_port)
        self.supervisor_addr = self._parse_address(supervisor_host, supervisor_port)
        assert self.worker_addr and self.supervisor_addr

        self.providers = {}
        for provider in providers:
            self.providers[provider.name] = provider

    """
    gRPC functions:
    sync_from_upstream

    """

    async def sync_from_upstream(self, request, context):
        source_name = request.name
        logger.info(f"Syncing request from supervisor: {source_name}")

        provider = self.get_provider(source_name)
        return_code = 0
        if provider:
            return_code = await provider.sync_from_upstream()
        else:
            logger.error(f"No provider found for {source_name}")

        return return_code

    """
    worker functions:
    report_in

    """

    async def _register_report_in(self):
        if not self.registered:
            async with grpc.aio.insecure_channel(self.supervisor_addr) as channel:
                stub = supervisor_pb2_grpc.SupervisorStub(channel=channel)
                # provider_names = list(self.providers.keys())
                request = supervisor_pb2.WorkerReportInRequest(
                    worker_addr=self.worker_addr, worker_status=self.get_worker_status()
                )

                try:
                    response = stub.worker_report_in(request)
                    logger.info(f"Worker: {self.worker_addr} sent report in")
                    logger.debug(f"Response: {response}")
                except grpc.RpcError as e:
                    logger.exception(
                        f"Failed to send report in worker: {self.worker_addr}, {e}"
                    )

    def get_worker_status(self):
        return 1  # will be implemented

    def get_provider(self, name: str) -> BaseProvider | None:
        return self.providers.get(name)

    @staticmethod
    def _parse_address(host: str, port: int):
        return f"{host}:{port}"
