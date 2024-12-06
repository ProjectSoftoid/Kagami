from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..database.database_service import HelperService
from .deps import SessionDeps

helper_router: APIRouter = APIRouter(prefix="helper")


class HelperResponse(BaseModel):
    name: str
    content: str
    last_update: str  # Datetime


@helper_router.get("{resource_name}", response_model=HelperResponse)
async def get_helpers(resource_name: str, db_session: SessionDeps):
    helper_service = HelperService(session=db_session)
    helper = await helper_service._get(name=resource_name)
    if helper:
        return {
            "name": helper.name,
            "content": helper.content,
            "last_update": helper.last_update,
        }
    else:
        raise HTTPException(status_code=404, detail="No helper found in database")
