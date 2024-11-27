from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..core import Supervisor
from ..database.engine import DatabaseEngine
from ..server import supervisor

SupervisorDeps = Annotated[Supervisor, Depends(lambda: supervisor)]


@asynccontextmanager
async def session_generator() -> AsyncGenerator[AsyncSession]:
    session: AsyncSession = DatabaseEngine.session_factory()
    try:
        yield session
    finally:
        await session.close()


SessionDeps = Annotated[AsyncSession, Depends(session_generator())]
