from datetime import datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from .base import BaseModel


class Announce(BaseModel):
    __tablename__ = "announcement"

    id: Mapped[str] = mapped_column(primary_key=True, autoincrement=True)
    content: Mapped[str] = mapped_column(String(256))
    title: Mapped[str] = mapped_column(String(64))
    date: Mapped[str] = mapped_column(DateTime, default=datetime.now())
