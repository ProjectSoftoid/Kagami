import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

import grpc

from ..grpc.supervisor import supervisor_pb2_grpc
from .config import SupervisorConfig
from .core import Supervisor
from .routes import resource_router

config = SupervisorConfig()
logging.basicConfig(filename=config.log_file, level=config.log_level)
logger = logging.getLogger(__name__)

kagami_server = FastAPI()
supervisor = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global supervisor
    supervisor = Supervisor  # TODO load the supervisor

    logger.info("Reading config from config.env")
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
    await grpc_server.stop()


kagami_server.router.lifespan = lifespan
kagami_server.include_router(resource_router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app=kagami_server, host=config.supervisor_host, port=config.supervisor_port
    )
