import logging

# from sqlalchemy import select
import grpc

from ..grpc import supervisor_pb2, supervisor_pb2_grpc, worker_pb2, worker_pb2_grpc

# from ..config import SupervisorConfig
# from ..database.database_service import WorkerService
# from ..database.models.worker import Worker
# from ..database.session import session_generator
from .models import ResourceInfo, WorkerInfo
from .models.provider_info import ProviderStatus
from .models.resource_info import ResourceStatus

logger = logging.getLogger(__name__)


class Supervisor(supervisor_pb2_grpc.SupervisorServicer):
    supervisor_addr: str

    resources: dict[str, ResourceInfo]  # resource_name -> ResourceInfo

    registered_workers: dict[str, WorkerInfo]  # worker_addr -> WorkerInfo
    unregistered_worker: list[str]  # list[worker_addr]

    def __init__(
        self,
        supervisor_host: str,
        supervisor_port: int,
        worker_info_list: list[WorkerInfo | None],
    ):
        super().__init__()
        self.supervisor_addr = self._parse_address(supervisor_host, supervisor_port)
        # build worker_info
        raw_worker_info = {}
        for worker_info in worker_info_list:
            if worker_info is not None:
                raw_worker_info[worker_info.worker_addr] = worker_info
        self.registered_workers = raw_worker_info

        self.unregistered_worker = []

    # @classmethod
    # async def load(cls, config: SupervisorConfig) -> "Supervisor":
    #     # reserve for load from config
    #     # Load the worker from database (if not init)
    #     worker_service = WorkerService(session=session_generator())
    #     workers = await worker_service._session.execute(
    #         select(Worker)
    #     )  # TODO alternative database service
    #     for worker in workers:
    #        # TODO query from worker
    #     return Supervisor(
    #         supervisor_host=config.supervisor_host,
    #         supervisor_port=config.supervisor_port,
    #         worker_info_list = []
    #     )

    """
    gRPC function
    worker_report_in()
    Recive worker report in request and add it into queue.
    """

    async def worker_report_in(self, request, context):
        worker_addr = request.worker_addr
        # worker_status = request.worker_status
        logger.info(f"Recive worker report in: {worker_addr}")
        self.unregistered_worker.append(worker_addr)
        return supervisor_pb2.WorkerReportInResponse(
            supervisor_addr=self.supervisor_addr
        )

    """
    gRPC function
    update_provider_status()
    Update provider's status after provider status had changed.
    """

    async def update_provider_status(self, request, context):
        worker_addr = request.worker_addr
        provider_replica_id = request.provider_replica_id
        provider_status = request.provider_status
        worker = self.registered_workers.get(worker_addr)
        provider = worker.get_provider_by_replica_id(provider_replica_id)
        if provider is not None:
            provider.provider_status = ProviderStatus(provider_status)
            self.rebuild_resource_info(provider.name)
        else:
            logger.error(f"Provider not found for: {worker_addr}:{provider_replica_id}")

        return supervisor_pb2.UpdateProviderStatusResponse(
            provider_id=provider_replica_id
        )

    """
    supervisor function
    get_unregistered_worker()
    Get workers reported in and waiting in queue.
    """

    async def get_unregistered_worker(self) -> list[str]:
        return self.unregistered_worker

    """
    supervisor function
    get_resource_status()
    Get status of a resource.
    """

    async def get_resource_status(self, name: str) -> ResourceStatus | None:
        resource = self.resources.get(name)
        resource_status = None
        if resource is not None:
            resource_status = resource.status
        else:
            logger.error(f"Could not get resource status of: {name}")
        return resource_status

    """
    supervisor function
    list_resource()
    List all the resource record in supervisor
    """

    async def list_resource(self) -> dict[str, ResourceInfo]:
        return self.resources

    """
    supervisor function
    get_resource_info()
    Get a resource info
    """

    async def get_resource_info(self, resource_name: str) -> ResourceInfo | None:
        resource = self.resources.get(resource_name)
        if not resource:
            logger.error(f"Resouce not found: {resource_name}")
        return resource

    """
    supervisor remote function
    check_worker_health()
    Check worker's connectivity by exchanging supervisor_addr and worker_addr
    """

    async def check_worker_health(self, worker_addr: str):
        logger.debug(f"Check worker health: {worker_addr}")
        async with grpc.aio.insecure_channel(worker_addr) as channel:
            stub = worker_pb2_grpc.WorkerStub(channel=channel)
            # TODO secure channel
            request = worker_pb2.HealthCheckRequest(
                supervisor_addr=self.supervisor_addr
            )
            try:
                # send register_accepted to worker with gRPC
                response = await stub.health_check(request)
                # check worker_addr in response
                assert worker_addr == response.worker_addr
                logger.debug(f"Health check successfully: {worker_addr}")
            except grpc.RpcError as e:
                logger.exception(
                    f"Failed to check health of worker: {worker_addr}, {e}"
                )
            except AssertionError as ae:
                logger.exception(
                    f"Worker Address not the same: {worker_addr}:"
                    f"{response.worker_addr}, {ae}"
                )

    """
    supervisor remote function
    register_worker()
    Accept worker report in.
    """

    async def regiser_worker(self, worker_addr: str):
        if worker_addr in self.unregistered_worker:
            logger.info(f"Accepted worker: {worker_addr}")
            async with grpc.aio.insecure_channel(worker_addr) as channel:
                stub = worker_pb2_grpc.WorkerStub(channel=channel)
                # TODO secure channel
                request = worker_pb2.RegisterResponse(accepted=True)
                try:
                    # send register_accepted to worker with gRPC
                    response = await stub.register_accepted(request)
                    self.unregistered_worker.pop()
                    logger.info(f"Accepted register from worker: {worker_addr}")
                    logger.debug(f"Response: {response}")
                except grpc.RpcError as e:
                    logger.exception(
                        f"Failed to send register_accepted to worker: {worker_addr},{e}"
                    )

    """
    supervisor function
    rebuild_resource_info()
    rebuild resource info from infomation provided by worker.
    maintain the resource_info since it does not store in database and worker.
    call update if resources or providers have changes.
    """

    async def rebuild_resource_info(self, resource_name: str) -> None:
        raw_worker_info_list = []
        raw_provider_info_list = []
        provide_info_count = 0
        failed_providers_count = 0
        syncing_provider_count = 0
        raw_status = ResourceStatus.READY

        resource_info = self.resources.get(resource_name)

        for worker_info in self.registered_workers.values():
            provide_info = worker_info.providers.get(resource_name)
            if not provide_info:
                continue
            raw_worker_info_list.append(worker_info)
            raw_provider_info_list.append(provide_info)
            # check resource status
            provide_info_count += 1
            syncing_provider_count += (
                1 if provide_info.provider_status == ProviderStatus.SYNCING else 0
            )
            failed_providers_count += (
                1 if provide_info.provider_status == ProviderStatus.FAILED else 0
            )
        # check resource status
        # if all the providers of a resource are failed, status -> ERROR
        if failed_providers_count > 0:
            raw_status = (
                ResourceStatus.ERROR
                if failed_providers_count == provide_info_count
                else ResourceStatus.FAILED
            )
        elif syncing_provider_count > 0:
            raw_status = ResourceStatus.SYNCING

        if resource_info:
            resource_info.status = raw_status
            resource_info.update_workers(raw_worker_info_list)
            resource_info.update_providers(raw_provider_info_list)
        else:
            raw_resource_info = ResourceInfo(
                name=resource_name,
                status=raw_status,
                worker_info_list=raw_worker_info_list,
                provider_info_list=raw_provider_info_list,
                has_helper=True,  # TODO Helper
            )
            self.resources[resource_name] = raw_resource_info

    """
    supervisor function
    TODO update_resource_info()
    rebuild cost is high.
    """

    @staticmethod
    def _parse_address(host: str, port: int):
        return f"{host}:{port}"
