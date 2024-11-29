from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from sqlalchemy.ext.asyncio import AsyncSession

from .engine import DatabaseEngine


@asynccontextmanager
async def session_generator() -> AsyncGenerator[AsyncSession]:
    session: AsyncSession = DatabaseEngine.session_factory()
    try:
        yield session
    finally:
        await session.close()