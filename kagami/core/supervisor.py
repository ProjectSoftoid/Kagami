import logging
import grpc

from .models import WorkerInfo

from ...grpc.worker import worker_pb2_grpc, worker_pb2
from ...grpc.supervisor import supervisor_pb2_grpc


logger = logging.getLogger(__name__)


class Supervisor(supervisor_pb2_grpc.SupervisorServicer):
    supervisor_addr: str
    worker_info: WorkerInfo | None

    unregistered_worker: list[str]  # list[worker_addr]

    def __init__(
        self, supervisor_host: str, supervisor_port: int, worker_info: WorkerInfo | None
    ):
        super().__init__()
        self.supervisor_addr = self._parse_address(supervisor_host, supervisor_port)
        self.worker_info = worker_info
        self.unregistered_worker = []

    # TODO load config from database and configuration file
    # @classmethod
    # def load(self) -> "Supervisor":
    #     return Supervisor()

    """
    gRPC function
    worker_report_in()
    Recive worker report in request and add it into queue.
    """

    async def worker_report_in(self, request, context):
        worker_addr = request.worker_addr
        # worker_status = request.worker_status
        logger.info(f"Recive worker report in: {worker_addr}")
        self.unregistered_worker.append(worker_addr)

    """
    worker function
    register_worker()
    Accept worker report in.
    """

    async def regiser_worker(self, worker_addr: str):
        if worker_addr in self.unregistered_worker:
            logger.info(f"Accepted worker: {worker_addr}")
            async with grpc.aio.insecure_channel(worker_addr) as channel:
                stub = worker_pb2_grpc.WorkerStub(channel=channel)
                # TODO secure channel
                request = worker_pb2.RegisterResponse(accepted=True)
                try:
                    # send register_accepted to worker with gRPC
                    response = stub.register_accepted(request)
                    logger.info(f"Accepted register from worker: {worker_addr}")
                    logger.debug(f"Response: {response}")
                except grpc.RpcError as e:
                    logger.exception(
                        f"Failed to send register_accepted to worker: {worker_addr}, {e}"
                    )

    @staticmethod
    def _parse_address(host: str, port: int):
        return f"{host}:{port}"
