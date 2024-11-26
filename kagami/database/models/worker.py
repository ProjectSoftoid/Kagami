import enum

from sqlalchemy import Enum, String
from sqlalchemy.orm import Mapped, mapped_column

from .base import BaseModel


class WorkerRegStatus(enum.Enum):
    UNREGISTERED = "unregistered"
    REGISTERED = "registered"


class Worker(BaseModel):
    __tablename__ = "worker_info"

    worker_addr: Mapped[str] = mapped_column(String(64), primary_key=True)
    worker_reg_status: Mapped[WorkerRegStatus] = mapped_column(
        Enum(WorkerRegStatus), comment="record whether a worker is registered"
    )
