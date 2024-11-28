from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import grpc

from ...database.database_service.worker_manager import WorkerService
from ...routes.deps import SupervisorDeps
from ...grpc.worker_pb2 import AddResourceRequest, ProviderInfo
from kagami.grpc.worker_pb2_grpc import WorkerStub



worker_router = APIRouter(prefix="/admin/worker")

@worker_router.get("/list")
async def list_workers(supervisor: SupervisorDeps):
    """List worker with address and status (Verified/Unverified)"""
    workers = supervisor.registered_workers
    return [
        {
            "addr": addr,
            "status": worker.verify_status.value
        }
        for addr, worker in workers.items()
    ]

@worker_router.get("/{worker_addr}/detail")
async def get_worker_detail(worker_addr: str, supervisor: SupervisorDeps):
    """get worker detail"""
    worker = supervisor.registered_workers.get(worker_addr)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    return {
        "addr": worker_addr,
        "status": worker.worker_status.value,
        "providers": [
            {
                "name": p.name,
                "status": p.provider_status.value,
                "upstream_url": p.upstream_url
            }
            for p in worker.providers.values()
        ]
    }

@worker_router.post("/{worker_addr}/register")
async def register_worker(worker_addr: str, supervisor: SupervisorDeps):
    """register worker"""
    await supervisor.register_worker(worker_addr)
    return {"message": "Worker registered successfully"}

@worker_router.get("/{worker_address}/resource")
async def get_worker_resource(worker_address: str, supervisor: SupervisorDeps):
    """list all resource on a worker"""
    worker = supervisor.registered_workers.get(worker_address)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    return [
        {
            "name": provider.name,
            "replica_id": provider.replica_id,
            "upstream_url": provider.upstream_url,
            "provider_method": provider.provider_method,
            "status": provider.provider_status.value
        }
        for provider in worker.providers.values()
    ]

class ResourceConfig(BaseModel):
    name: str
    upstream_url: str
    provider_method: str
    retry: bool = False

@worker_router.post("/{worker_address}/add_resource")
async def add_resource(
    worker_address: str, 
    resource_config: ResourceConfig, 
    supervisor: SupervisorDeps
):
    """Add resource to this worker"""
    worker = supervisor.registered_workers.get(worker_address)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    try:
        # 创建安全通道
        async with supervisor._create_channel(worker_address) as channel:
            stub = WorkerStub(channel)
            
            # 发送添加资源请求
            request = AddResourceRequest(
                name=resource_config.name,
                upstream_url=resource_config.upstream_url,
                provider_method=resource_config.provider_method,
                retry=resource_config.retry
            )
            response = await stub.add_resource(request)
            
            if response.success:
                # 更新supervisor中的worker信息
                new_provider = ProviderInfo(
                    name=resource_config.name,
                    replica_id=response.replica_id,
                    upstream_url=resource_config.upstream_url,
                    provider_method=resource_config.provider_method
                )
                worker.providers[resource_config.name] = new_provider
                
                return {"message": "Resource added successfully", "replica_id": response.replica_id}
            else:
                raise HTTPException(status_code=400, detail=response.error_message)
    
    except grpc.RpcError as e:
        raise HTTPException(status_code=500, detail=f"Failed to add resource: {str(e)}")

@worker_router.post("/accept")
async def accept_worker(supervisor: SupervisorDeps):
    """Accept report-in worker waiting in queue"""
    try:
        # 获取未注册的worker列表
        if not supervisor.unregistered_worker:
            raise HTTPException(
                status_code=404, 
                detail="No worker waiting in queue"
            )
            
        # 获取第一个等待的worker地址
        worker_addr = supervisor.unregistered_worker[0]
        
        # 注册worker
        await supervisor.register_worker(worker_addr)
        
        return {
            "message": f"Worker {worker_addr} accepted successfully"
        }
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=500,
            detail=f"Failed to accept worker: {str(e)}"
        )

@worker_router.post("/delete")
async def delete_worker(supervisor: SupervisorDeps, worker_addr: str):
    """Unregister a worker already accepted by supervisor"""
    try:
        # 检查worker是否存在且已注册
        if worker_addr not in supervisor.registered_workers:
            raise HTTPException(
                status_code=404,
                detail="Worker not found or not registered"
            )
            
        # 从supervisor中删除worker
        worker_info = supervisor.registered_workers.pop(worker_addr)
        
        # 更新数据库
        async with supervisor.db_engine.session_factory() as session:
            worker_service = WorkerService(session)
            await worker_service.delete_workerinfo(address=worker_addr)
            
        logger.info(f"Worker {worker_addr} unregistered successfully")
        
        return {
            "message": f"Worker {worker_addr} unregistered successfully"
        }
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=500,
            detail=f"Failed to unregister worker: {str(e)}"
        )
