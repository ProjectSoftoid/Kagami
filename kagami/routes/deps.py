from typing import Annotated

from fastapi import Depends

from ..core import Supervisor
from ..server import supervisor

SupervisorDeps = Annotated[Supervisor, Depends(lambda: supervisor)]
