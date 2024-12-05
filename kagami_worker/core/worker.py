import logging

import grpc

from ...grpc.supervisor import supervisor_pb2, supervisor_pb2_grpc
from ...grpc.worker import worker_pb2, worker_pb2_grpc

# from ..config import WorkerConfig
from ..core.provider import BaseProvider

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
    gRPC function
    sync_from_upstream()
    Sync repo from upstream. Implemented for remote call.
    """

    async def sync_from_upstream(self, request, context):
        source_name = request.name
        logger.info(f"Syncing request from supervisor: {source_name}")

        # search provider for {source_name}
        provider = self.get_provider(source_name)
        return_code = 1
        msg = ""
        if provider:
            return_code = await provider.sync_from_upstream()
            if return_code == 0:
                msg = "Success"
        else:
            logger.error(f"No provider found for {source_name}")
            msg = "Failed"

        return worker_pb2.SyncResponse(status=return_code, message=msg)

    """
    gRPC function
    accept_register()
    Callback function for register request was accepted by supervisor.
    """

    async def register_accepted(self, request, context):
        accepted = request.accepted
        if accepted:
            self.registered = True
            message = "Worker Registered"
        return worker_pb2.RegisterAck(message=message)

    """
    gRPC function
    health_check()
    For supervisor to check worker health by exchanging address.
    """

    async def health_check(self, request, context):
        try:
            assert request.supervisor_addr == self.supervisor_addr
            return worker_pb2.HealthCheckResponse(worker_addr=self.worker_addr)
        except AssertionError as ae:
            logger.error(
                f"Supervisor Address not match: {request.supervisor_addr}, {ae}"
            )

    """
    worker remote function
    report_in()
    Send register request to supervisor (first connect).
    """

    async def report_in(self):
        await self._register_report_in()

    async def _register_report_in(self):
        if not self.registered:
            # create channel
            # TODO secure channel
            async with grpc.aio.insecure_channel(self.supervisor_addr) as channel:
                stub = supervisor_pb2_grpc.SupervisorStub(channel=channel)
                # TODO send provider infos
                # provider_names = list(self.providers.keys())
                request = supervisor_pb2.WorkerReportInRequest(
                    worker_addr=self.worker_addr, worker_status=self.get_worker_status()
                )

                try:
                    # send report_in request with gRPC
                    response = stub.worker_report_in(request)
                    logger.info(f"Worker: {self.worker_addr} sent report in")
                    logger.debug(f"Response: {response}")
                except grpc.RpcError as e:
                    logger.exception(
                        f"Failed to send report in worker: {self.worker_addr}, {e}"
                    )

    """
    worker remote function
    update_provider_status()
    Update provider status to supervisor, using gRPC call.
    Call this when provider status has changed.
    """

    async def update_provider_status(self, name: str):
        logger.info(f"Update provider status for {name}")
        provider = self.get_provider(name)
        assert provider is not None
        # TODO secure channel
        async with grpc.aio.insecure_channel(self.supervisor_addr) as channel:
            stub = supervisor_pb2_grpc.SupervisorStub(channel=channel)
            request = supervisor_pb2.UpdateProviderRequest(
                provider_replica_id=provider.replica_id,
                provider_status=provider.provider_status,
            )
            try:
                # send update_provider_status request with gRPC
                response = stub.update_provider_status(request)
                logger.info(f"Provider: {provider.name} sent update status")
                logger.debug(f"Response: {response}")
            except grpc.RpcError as e:
                logger.exception(
                    f"Failed to send update for provider: {provider.name}: {e}"
                )

    """
    utils
    get_provider()
    Return a provider according to the name
    """

    def get_provider(self, name: str) -> BaseProvider | None:
        return self.providers.get(name)

    """
    utils
    _parse_address()
    Return full address
    """

    @staticmethod
    def _parse_address(host: str, port: int):
        return f"{host}:{port}"
