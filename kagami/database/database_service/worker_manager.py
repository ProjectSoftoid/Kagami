from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.worker import Worker, WorkerRegStatus


class WorkerService:
    _session: AsyncSession

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    def add_workerinfo(self, address: str, reg_status: WorkerRegStatus):

        new_worker = Worker(worker_addr=address, worker_reg_status=reg_status)
        self._session.add_all(new_worker)
        self._session.commit()

    def delete_workerinfo(self, address: str):
        origin_worker = self._session.execute(
            select(Worker).where(Worker.worker_addr == address)
        )
        self._session.delete(origin_worker)
        self._session.commit()

    def update_workerinfo(self, address: str, reg_status: WorkerRegStatus):

        origin_worker = self._session.execute(
            select(Worker).where(Worker.worker_addr == address)
        )
        origin_worker.worker_reg_status = reg_status

        self._session.commit()
