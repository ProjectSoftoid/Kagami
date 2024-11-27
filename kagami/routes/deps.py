from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..core import Supervisor
from ..database.engine import DatabaseEngine
from ..server import supervisor

SupervisorDeps = Annotated[Supervisor, Depends(lambda: supervisor)]


@asynccontextmanager
async def some_async_generator():
    session: AsyncSession
    session = DatabaseEngine.session_factory
    try:
        yield session
    finally:
        await session.close()


SessionDeps = Annotated[AsyncSession, Depends(some_async_generator)]
