from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from ..config import ConfigManager
from .models.base import BaseModel


class DatabaseEngine:
    _engine: AsyncEngine

    @classmethod
    def init(cls):
        config = ConfigManager.get_configs()
        cls._engine = create_async_engine(
            config.database_url, expire_on_commit=False
        )

    @classmethod
    def session_factory(cls) -> AsyncSession:
        session = sessionmaker(cls._engine)
        return session

    @classmethod
    async def check_and_create_database(cls):
        async with cls._engine.begin() as conn:
            await conn.run_sync(BaseModel.metadata.create_all)
