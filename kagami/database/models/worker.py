from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from .base import BaseModel


class Worker(BaseModel):
    __tablename__ = "worker_info"

    worker_addr: Mapped[str] = mapped_column(String(64), primary_key=True)
