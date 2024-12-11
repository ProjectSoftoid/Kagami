import asyncio
import logging

import grpc

from .config import ConfigManager
from .core.worker import Worker
from .grpc import worker_pb2_grpc

logger = logging.getLogger(__name__)

async def start_worker():
    config = ConfigManager.get_configs()
    worker = Worker(
        worker_host=config.grpc_host,
        worker_port=config.grpc_port,
        supervisor_host=config.supervisor_host,
        supervisor_port=config.supervisor_port,
        providers=[] # TODO load from file
    )

    logger.info(f"gRPC worker host: {config.grpc_host}")
    logger.info(f"gRPC worker port: {config.grpc_port}")

    grpc_server = grpc.aio.server()
    worker_pb2_grpc.add_WorkerServicer_to_server(worker, grpc_server)
    grpc_server.add_insecure_port(worker.worker_addr)
    await grpc_server.start()

    loop = asyncio.get_event_loop()
    loop.create_task(worker.report_in())

    await grpc_server.wait_for_termination()
