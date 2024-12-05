from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import TEXT

from .base import BaseModel


class Helper(BaseModel):
    __tablename__ = "helper"

    name: Mapped[str] = mapped_column(primary_key=True)
    content: Mapped[str] = mapped_column(TEXT)
