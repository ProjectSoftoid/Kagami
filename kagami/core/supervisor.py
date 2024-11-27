import logging

import grpc

from ...grpc.supervisor import supervisor_pb2_grpc
from ...grpc.worker import worker_pb2, worker_pb2_grpc
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
        resource_info_list: list[ResourceInfo | None],
    ):
        super().__init__()
        self.supervisor_addr = self._parse_address(supervisor_host, supervisor_port)
        # build worker_info
        raw_worker_info = {}
        for worker_info in worker_info_list:
            if worker_info is not None:
                raw_worker_info[worker_info.worker_addr] = worker_info
        self.registered_workers = raw_worker_info

        # build resource_info
        raw_resource_info = {}
        for resource_info in resource_info_list:
            if resource_info is not None:
                raw_resource_info[resource_info.name] = resource_info

        self.unregistered_worker = []

    # TODO load config from database and configuration file
    # @classmethod
    # def load(self) -> "Supervisor":
    #     return Supervisor()

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
        else:
            logger.error(f"Provider not found for: {worker_addr}:{provider_replica_id}")

    """
    supervisor function
    register_worker()
    Accept worker report in.
    """

    async def register_worker(self, worker_addr: str):
        """Register worker with secure channel support"""
        if worker_addr in self.registered_workers:
            logger.warning(f"Worker already registered: {worker_addr}")
            return
            
        # 创建安全通道的credentials
        if self.config.tls_cert_path and self.config.tls_key_path:
            creds = grpc.ssl_channel_credentials(
                root_certificates=open(self.config.tls_ca_cert_path, 'rb').read() if self.config.tls_ca_cert_path else None,
                private_key=open(self.config.tls_key_path, 'rb').read(),
                certificate_chain=open(self.config.tls_cert_path, 'rb').read()
            )
            channel = grpc.aio.secure_channel(worker_addr, creds)
        else:
            channel = grpc.aio.insecure_channel(worker_addr)
            
        async with channel:
            stub = worker_pb2_grpc.WorkerStub(channel)
            try:
                # 发送注册确认
                request = worker_pb2.RegisterResponse(accepted=True)
                response = await stub.register_accepted(request)
                
                # 创建WorkerInfo实例
                worker_info = WorkerInfo(worker_addr)
                
                # 获取worker的provider信息
                provider_response = await stub.get_providers(worker_pb2.Empty())
                for provider in provider_response.providers:
                    provider_info = ProviderInfo(
                        name=provider.name,
                        replica_id=provider.replica_id,
                        upstream_url=provider.upstream_url,
                        provider_method=provider.provider_method
                    )
                    worker_info.providers[provider.name] = provider_info
                
                # 注册worker
                self.registered_workers[worker_addr] = worker_info
                logger.info(f"Worker registered successfully: {worker_addr}")
                
                # 更新数据库
                async with self.db_engine.session_factory() as session:
                    worker_service = WorkerService(session)
                    await worker_service.add_workerinfo(
                        address=worker_addr,
                        reg_status=WorkerRegStatus.REGISTERED
                    )
                
            except grpc.RpcError as e:
                logger.error(f"Failed to register worker {worker_addr}: {e}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to register worker: {str(e)}"
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
                response = stub.health_check(request)
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
                    f"{request.worker_addr}, {ae}"
                )

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

    @staticmethod
    def _parse_address(host: str, port: int):
        return f"{host}:{port}"
