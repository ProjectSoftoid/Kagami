import logging
import asyncio

import grpc

from ...grpc.supervisor import supervisor_pb2_grpc
from ...grpc.worker import worker_pb2, worker_pb2_grpc
from .models import ResourceInfo, WorkerInfo
from .models.provider_info import ProviderStatus
from .models.resource_info import ResourceStatus
from .models.worker_info import WorkerVerifyStatus

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

    @classmethod
    async def load(self) -> "Supervisor":
        """Load supervisor configuration from database and config file"""
        # 从配置文件加载基本配置
        config = load_config()
        
        # 从数据库加载worker和resource信息
        async with get_db_session() as session:
            worker_service = WorkerService(session)
            resource_service = ResourceService(session)
            
            workers = await worker_service.get_all_workers()
            resources = await resource_service.get_all_resources()
            
        return self(
            supervisor_host=config.supervisor_host,
            supervisor_port=config.supervisor_port,
            worker_info_list=workers,
            resource_info_list=resources
        )

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
        """Register worker with verification status"""
        if worker_addr in self.registered_workers:
            logger.warning(f"Worker already registered: {worker_addr}")
            return
            
        # 创建安全通道
        async with self._create_channel(worker_addr) as channel:
            stub = worker_pb2_grpc.WorkerStub(channel)
            try:
                # 发送注册确认
                request = worker_pb2.RegisterResponse(accepted=True)
                response = await stub.register_accepted(request)
                
                # 创建WorkerInfo实例
                worker_info = WorkerInfo(worker_addr)
                
                # 获取worker的provider信息并验证
                provider_response = await stub.get_providers(worker_pb2.Empty())
                if self._verify_worker_providers(provider_response.providers):
                    worker_info.verify_status = WorkerVerifyStatus.VERIFIED
                
                # 保存provider信息
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
                        reg_status=WorkerRegStatus.REGISTERED,
                        verify_status=worker_info.verify_status
                    )
                
            except grpc.RpcError as e:
                logger.error(f"Failed to register worker {worker_addr}: {e}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to register worker: {str(e)}"
                )
                
    def _verify_worker_providers(self, providers: list) -> bool:
        """验证worker的providers是否符合要求"""
        # 实现具体的验证逻辑
        # 例如：检查必需的provider是否存在，配置是否正确等
        return True  # 临时返回True，需要根据实际需求实现验证逻辑

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

    async def get_announcement(self):
        # 这里应该实现从数据库或缓存中获取最新公告的逻辑
        # 临时返回一个示例公告
        return Announcement(
            content="Welcome to Kagami!",
            timestamp=datetime.now()
        )

    async def sync_resource(self, resource_name: str):
        """Sync resource across all providers"""
        resource = self.resources.get(resource_name)
        if not resource:
            raise ValueError(f"Resource {resource_name} not found")
        
        sync_tasks = []
        for provider in resource.providers:
            task = self._sync_provider(provider)
            sync_tasks.append(task)
        
        # 并行执行所有同步任务
        results = await asyncio.gather(*sync_tasks, return_exceptions=True)
        
        # 处理同步结果
        success_count = sum(1 for r in results if not isinstance(r, Exception))
        return {
            "total_providers": len(resource.providers),
            "sync_success": success_count
        }

    async def _sync_provider(self, provider):
        """Sync single provider"""
        try:
            async with self._create_channel(provider.worker_addr) as channel:
                stub = worker_pb2_grpc.WorkerStub(channel)
                request = worker_pb2.SyncRequest(
                    replica_id=provider.replica_id
                )
                await stub.sync(request)
                return True
        except Exception as e:
            logger.error(f"Failed to sync provider {provider.replica_id}: {e}")
            raise

    async def _create_channel(self, addr: str) -> grpc.aio.Channel:
        """Create a secure gRPC channel"""
        # 加载证书和密钥
        with open('path/to/server.crt', 'rb') as f:
            server_cert = f.read()
        with open('path/to/server.key', 'rb') as f:
            server_key = f.read()
        
        # 创建凭证
        credentials = grpc.ssl_channel_credentials(
            root_certificates=server_cert,
            private_key=server_key,
            certificate_chain=server_cert
        )
        
        # 返回安全通道
        return grpc.aio.secure_channel(addr, credentials)
