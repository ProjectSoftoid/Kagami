from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from ..config import SupervisorConfig


class DatabaseEngine:
    _engine: AsyncEngine

    @classmethod
    def init(cls):
        cls._engine = create_async_engine(SupervisorConfig.database_url, echo=True)

    @classmethod
    def session_factory(cls) -> AsyncSession:
        session = sessionmaker(cls._engine)
        return session
