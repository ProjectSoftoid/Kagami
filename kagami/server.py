from contextlib import asynccontextmanager

from fastapi import FastAPI

import grpc

from ..grpc.supervisor import supervisor_pb2_grpc
from .core import Supervisor
from .routes import resource_router

kagami_server = FastAPI()
supervisor = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global supervisor
    supervisor = await Supervisor.load()

    # start gRPC server
    grpc_server = grpc.aio.server()
    supervisor_pb2_grpc.add_SupervisorServicer_to_server(supervisor, grpc_server)
    grpc_server.add_insecure_port(supervisor.supervisor_addr)  # TODO secure channel
    await grpc_server.start()

    yield
    await grpc_server.stop()


kagami_server.router.lifespan = lifespan
kagami_server.include_router(resource_router)

kagami_server.include_router(resource_router)
kagami_server.include_router(worker_router)
kagami_server.include_router(admin_resource_router)
