from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from ..config import ConfigManager


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
