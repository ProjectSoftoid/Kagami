import asyncio

import pytest

import grpc

from ...grpc import worker_pb2_grpc
from .mock_worker import MockWorker


@pytest.fixture(scope="module")
def grpc_server():
    server = grpc.aio.server()
    worker_pb2_grpc.add_WorkerServicer_to_server(MockWorker(), server)
    server.add_insecure_port("[::]:21000")
    loop = asyncio.get_event_loop()
    loop.run_until_complete(server.start())
    yield server
    loop.run_until_complete(server.stop(0))


@pytest.fixture(scope="module")
def grpc_channel():
    async def _grpc_channel():
        async with grpc.aio.insecure_channel("localhost:50051") as channel:
            yield channel

    return _grpc_channel
