from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from kagami.routes.deps import SupervisorDeps

resource_router = APIRouter(prefix="/admin/resource")



@resource_router.get("/list")
async def list_resources(supervisor: SupervisorDeps):
    """get all resources"""
    resources = await supervisor.list_resource()
    return [
        {
            "name": name,
            "status": resource.status.value,
            "providers_count": len(resource.providers)
        }
        for name, resource in resources.items()
    ]

@resource_router.get("/{resource_name}/detail")
async def get_resource_detail(resource_name: str, supervisor: SupervisorDeps):
    """get resource detail"""
    resource = supervisor.resources.get(resource_name)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    return {
        "name": resource_name,
        "status": resource.status.value,
        "providers": [
            {
                "id": p.replica_id,
                "worker": p.worker_addr,
                "status": p.provider_status.value
            }
            for p in resource.providers
        ]
    }

@resource_router.post("/{resource_name}/sync")
async def sync_resource(resource_name: str, supervisor: SupervisorDeps):
    """Sync resource"""
    resource = supervisor.resources.get(resource_name)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    

    return {"message": "Sync started"}

@resource_router.post("/{worker_addr}/add_resource")
async def add_resource(
    worker_addr: str,
    config: ResourceConfig,
    supervisor: SupervisorDeps
):
    """Add resource to worker"""
    worker = supervisor.registered_workers.get(worker_addr)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
        
    try:
        async with supervisor._create_channel(worker_addr) as channel:
            stub = worker_pb2_grpc.WorkerStub(channel)
            
            request = worker_pb2.AddResourceRequest(
                name=config.name,
                upstream_url=config.upstream_url,
                provider_method=config.provider_method,
                retry=config.retry
            )
            
            response = await stub.add_resource(request)
            if response.success:
                return {
                    "message": "Resource added successfully",
                    "replica_id": response.replica_id
                }
            else:
                raise HTTPException(
                    status_code=400,
                    detail=response.error_message
                )
                
    except grpc.RpcError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to add resource: {str(e)}"
        )


general_router = APIRouter()

class Announcement(BaseModel):
    content: str
    timestamp: str

@general_router.get("/announcement", response_model=Announcement)
async def get_announcement(supervisor: SupervisorDeps):
    """Get Announcement from supervisor"""
    try:
        announcement = await supervisor.get_announcement()
        if announcement:
            return Announcement(
                content=announcement.content,
                timestamp=announcement.timestamp.isoformat()
            )
        else:
            return Announcement(content="No announcement at this time.", timestamp="")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch announcement: {str(e)}")

helper_router = APIRouter(prefix="/helper")

@helper_router.get("/{resource_name}")
async def get_helper(resource_name: str, supervisor: SupervisorDeps):
    """Get helper information for a specific resource"""
    try:
        resource = supervisor.resources.get(resource_name)
        if not resource:
            raise HTTPException(
                status_code=404, 
                detail=f"Resource {resource_name} not found"
            )
            
        # 获取资源的helper信息
        helper_info = await supervisor.get_resource_helper(resource_name)
        if not helper_info:
            return {
                "message": f"No helper information available for resource {resource_name}"
            }
            
        return helper_info
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get helper info: {str(e)}"
        )

@general_router.get("/resource_info")
async def get_resource_info(supervisor: SupervisorDeps):
    """Fetch Resource from supervisor"""
    try:
        resources = await supervisor.list_resource()
        return [
            {
                "name": name,
                "status": resource.status.value,
                "providers": [
                    {
                        "id": provider.replica_id,
                        "worker": provider.worker_addr,
                        "status": provider.provider_status.value,
                        "method": provider.provider_method
                    }
                    for provider in resource.providers
                ]
            }
            for name, resource in resources.items()
        ]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch resource info: {str(e)}"
        )

@general_router.get("/resource_detail/{resource_name}")
async def get_resource_detail(resource_name: str, supervisor: SupervisorDeps):
    """Show resource detail"""
    resource = supervisor.resources.get(resource_name)
    if not resource:
        raise HTTPException(
            status_code=404, 
            detail=f"Resource {resource_name} not found"
        )
    
    return {
        "name": resource_name,
        "status": resource.status.value,
        "providers": [
            {
                "id": provider.replica_id,
                "worker": provider.worker_addr,
                "status": provider.provider_status.value,
                "method": provider.provider_method
            }
            for provider in resource.providers
        ],
        "worker_names": [
            provider.worker_addr
            for provider in resource.providers
        ]
    }