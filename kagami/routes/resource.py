from fastapi import APIRouter

from .deps import SupervisorDeps

resource_router: APIRouter = APIRouter(prefix="/resource")


@resource_router.get("/list_resource")
async def list_resource(supervisor: SupervisorDeps):
    resources = await supervisor.list_resource()
    return [
        {"name": name, "status": resource.status.value}
        for name, resource in resources.items()
    ]
