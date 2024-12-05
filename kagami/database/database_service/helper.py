import logging

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.types import TEXT

from ..models.helper import Helper

logger = logging.getLogger(__name__)


class AnnounceService:
    _session: AsyncSession

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def _get(self, name: str):
        return await self._session.get(Helper, name)

    async def add_helper(self, content: str, name: str):
        new_helper = Helper(content=content, name=name)
        self._session.add_all(new_helper)
        await self._session.commit()

    async def delete_helper(self, name: str):
        origin_helper = await self._get(name)
        if not origin_helper:
            logger.error(f"Delete helper: {name} is not found")
        self._session.delete(origin_helper)
        await self._session.commit()

    async def update_helper(
        self,
        name: str,
        new_content: TEXT | None = None,
    ):
        origin_helper = await self._get(name)
        if not origin_helper:
            logger.error(f"Update helper: {name} is not found")
        if new_content:
            origin_helper.content = new_content
        await self._session.commit()
