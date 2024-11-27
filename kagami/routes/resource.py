from fastapi import APIRouter, HTTPException


from .deps import SupervisorDeps

resource_router: APIRouter = APIRouter(prefix="/resource")

@resource_router.get("/list")
async def list_resource(supervisor: SupervisorDeps):
    """get resource list"""
    resources = await supervisor.list_resource()
    return [
        {"name": name, "status": resource.status.value}
        for name, resource in resources.items()
    ]

@resource_router.get("/{resource_name}/status")
async def get_resource_status(resource_name: str, supervisor: SupervisorDeps):
    """get resource status"""
    status = await supervisor.get_resource_status(resource_name)
    if not status:
        raise HTTPException(status_code=404, detail="Resource not found")
    return {"status": status.value}

@resource_router.get("/{resource_name}/providers")
async def get_resource_providers(resource_name: str, supervisor: SupervisorDeps):
    """get resource providers"""
    resource = supervisor.resources.get(resource_name)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    return [
        {
            "id": p.replica_id,
            "worker": p.worker_addr,
            "status": p.provider_status.value,
            "method": p.provider_method
        }
        for p in resource.providers
    ]

