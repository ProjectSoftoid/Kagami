from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..core import Supervisor
from ..database.session import session_generator
from ..server import supervisor

SupervisorDeps = Annotated[Supervisor, Depends(lambda: supervisor)]

SessionDeps = Annotated[AsyncSession, Depends(session_generator())]
