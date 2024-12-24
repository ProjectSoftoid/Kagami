from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..config import ConfigManager, SupervisorConfig
from ..core import Supervisor
from ..database.session import get_session
from ..server import supervisor

SupervisorDeps = Annotated[Supervisor, Depends(lambda: supervisor)]

SessionDeps = Annotated[AsyncSession, Depends(get_session)]

ConfigDeps = Annotated[SupervisorConfig, Depends(ConfigManager.get_configs)]
