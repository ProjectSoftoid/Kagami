import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

import grpc

from .config import ConfigManager
from .core import Supervisor
from .database.engine import DatabaseEngine
from .grpc import supervisor_pb2_grpc

config = ConfigManager.get_configs()
logger = logging.getLogger("uvicorn.error")
supervisor = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    DatabaseEngine.init()
    DatabaseEngine.check_and_create_database()
    global supervisor
    supervisor = await Supervisor.load()

    logger.info(f"HTTP Host: {config.http_host}")
    logger.info(f"HTTP Port: {config.http_port}")
    logger.info(f"gRPC Host: {config.grpc_host}")
    logger.info(f"gRPC Port: {config.grpc_port}")
    logger.info(f"Log File: {config.log_file}")
    logger.info(f"Log Level: {config.log_level}")

    # start gRPC server
    grpc_server = grpc.aio.server()
    supervisor_pb2_grpc.add_SupervisorServicer_to_server(supervisor, grpc_server)
    grpc_server.add_insecure_port(supervisor.supervisor_addr)  # TODO secure channel
    await grpc_server.start()

    yield
    await grpc_server.stop(0)


kagami_server = FastAPI(lifespan=lifespan)

from .routes import helper_router, resource_router, root_router  # noqa: E402

# Include Router Area
kagami_server.include_router(helper_router)
kagami_server.include_router(resource_router)
kagami_server.include_router(root_router)
