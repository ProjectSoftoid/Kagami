from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ...deps import SupervisorDeps

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ...deps import SupervisorDeps

resource_router = APIRouter(prefix="/admin/resource")

class ResourceConfig(BaseModel):
    name: str
    upstream_url: str
    provider_method: str
    retry: bool = True

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
    
    # TODO: 实现资源同步逻辑
    return {"message": "Sync started"}