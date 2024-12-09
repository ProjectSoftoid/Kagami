import logging

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.announce import Announce

logger = logging.getLogger(__name__)


class AnnounceService:
    _session: AsyncSession

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def _get(self, announce_id: int):
        return await self._session.get(Announce, announce_id)

    async def add_announce(self, content: str, title: str):
        new_announce = Announce(content=content, title=title)
        self._session.add_all(new_announce)
        await self._session.commit()

    async def delete_announce(self, announce_id: int):
        origin_announce = await self._get(announce_id)
        if not origin_announce:
            logger.error(f"Delete announce: {announce_id} is not found")
        self._session.delete(origin_announce)
        await self._session.commit()

    async def update_announce(
        self,
        announce_id: int,
        new_content: str | None = None,
        new_title: str | None = None,
    ):
        origin_announce = await self._get(announce_id)
        if not origin_announce:
            logger.error(f"Update announce: {announce_id} is not found")
        if new_content:
            origin_announce.content = new_content
        if new_title:
            origin_announce.title = new_title
        await self._session.commit()

    async def list_announce(self, page: int, page_size: int) -> list[Announce]:
        # NOTE: page starts from 1
        offset = (page - 1) * page_size
        result = await self._session.execute(
            select(Announce).limit(page_size).offset(offset=offset)
        )
        return result.scalars().all()
