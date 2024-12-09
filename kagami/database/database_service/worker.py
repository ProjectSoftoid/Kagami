import logging

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.worker import Worker, WorkerRegStatus

logger = logging.getLogger(__name__)


class WorkerService:
    _session: AsyncSession

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def _get(self, worker_addr):
        return await self._session.get(Worker, worker_addr)

    async def add_workerinfo(
        self,
        worker_addr: str,
        reg_status: WorkerRegStatus = WorkerRegStatus.UNREGISTERED,
    ):
        new_worker = Worker(worker_addr=worker_addr, worker_reg_status=reg_status)
        self._session.add_all(new_worker)
        await self._session.commit()

    async def delete_workerinfo(self, worker_addr: str):
        origin_worker = await self._get(worker_addr=worker_addr)
        if not origin_worker:
            logger.error(f"Delete worker_info: {worker_addr} not found")
        self._session.delete(origin_worker)
        await self._session.commit()

    async def update_workerinfo(
        self, worker_addr: str | None, reg_status: WorkerRegStatus | None
    ):
        origin_worker = await self._get(worker_addr=worker_addr)
        if not origin_worker:
            logger.error(f"Update worker_info: {worker_addr} not found")
        if worker_addr:
            origin_worker.worker_addr = worker_addr
        if reg_status:
            origin_worker.worker_reg_status = reg_status
        await self._session.commit()

    async def list_all_worker(self) -> list[Worker]:
        return await self._session.execute(select(Worker))
