

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl, field_validator
from typing import Literal

from kagami.routes.deps import SupervisorDeps

resource_router = APIRouter(prefix="/admin/resource")

class ResourceConfig(BaseModel):
    name: str
    upstream_url: HttpUrl
    provider_method: Literal["rsync", "git"]
    retry: bool = True
    
    @field_validator('name')
    def name_isvalid(self, v):
        if not v.isalnum():
            raise ValueError('name must be alphanumeric')
        return v.lower()
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "ubuntu",
                "upstream_url": "https://mirrors.ubuntu.com/",
                "provider_method": "rsync",
                "retry": True
            }
        }

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

@resource_router.post("/create")
async def create_resource(config: ResourceConfig, supervisor: SupervisorDeps):
    """Create new resource"""
    try:
        # Pydantic自动验证输入数据
        resource = await supervisor.create_resource(
            name=config.name,
            upstream_url=config.upstream_url,
            provider_method=config.provider_method,
            retry=config.retry
        )
        return {
            "message": "Resource created successfully",
            "resource": {
                "name": resource.name,
                "status": resource.status.value
            }
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@resource_router.put("/{resource_name}/config")
async def update_resource_config(
    resource_name: str, 
    config: ResourceConfig, 
    supervisor: SupervisorDeps
):
    """Update resource configuration"""
    resource = supervisor.resources.get(resource_name)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    try:
        # Pydantic自动验证更新的配置
        await supervisor.update_resource_config(resource_name, config.dict())
        return {"message": "Resource configuration updated"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))