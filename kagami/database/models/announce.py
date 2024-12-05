from datetime import datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import TEXT

from .base import BaseModel


class Announce(BaseModel):
    __tablename__ = "announcement"

    id: Mapped[str] = mapped_column(primary_key=True, autoincrement=True)
    content: Mapped[str] = mapped_column(TEXT)
    title: Mapped[str] = mapped_column(String(64))
    date: Mapped[str] = mapped_column(DateTime, default=datetime.now())
