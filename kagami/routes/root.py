from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..database.database_service import AnnounceService
from .deps import SessionDeps

root_router: APIRouter = APIRouter()


class AnnounceData(BaseModel):
    title: str
    content: str
    date: str  # Datetime


class AnnounceResponse(BaseModel):
    id: int
    data: list[AnnounceData]


@root_router.get("annoucement", response_model=list[AnnounceResponse])
async def get_announcement(db_session: SessionDeps):
    announce_service = AnnounceService(session=db_session)
    announcements = await announce_service.list_announce()
    if announcements:
        return [
            {
                "id": announcement.id,
                "data": {
                    "title": announcement.title,
                    "content": announcement.content,
                    "date": announcement.date,
                },
            }
            for announcement in announcements
        ]
    else:
        raise HTTPException(status_code=404, detail="No announcement found")
