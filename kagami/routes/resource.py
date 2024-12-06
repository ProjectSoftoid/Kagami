from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..core.models.provider_info import ProviderInfoOut
from ..core.models.resource_info import ResourceStatus
from .deps import SupervisorDeps

resource_router: APIRouter = APIRouter(prefix="/resource")


class GetResourceResponse(BaseModel):
    name: str
    status: ResourceStatus
    helper: bool


class GetResourceDetailResponse(BaseModel):
    name: str
    providers: list[ProviderInfoOut]


@resource_router.get("/info", response_model=list[GetResourceResponse])
async def get_resource(supervisor: SupervisorDeps):
    resources = await supervisor.list_resource()
    return [
        {"name": name, "status": resource.status.value, "helper": resource.has_helper}
        for name, resource in resources.items()
    ]


@resource_router.get("{resource_name}", response_model=GetResourceDetailResponse)
async def get_resource_detail(resource_name: str, supervisor: SupervisorDeps):
    resource = await supervisor.get_resource_info(resource_name)
    if resource:
        return {
            "name": resource_name,
            "providers": [
                {
                    "replica_id": provider.replica_id,
                    "upstream_url": provider.upstream_url,
                    "provider_method": provider.provider_method,
                    "status": provider.provider_status,
                }
                for provider in resource.providers.values()
            ],
        }
    else:
        raise HTTPException(
            status_code=404, detail=f"Resource not found: {resource_name}"
        )
