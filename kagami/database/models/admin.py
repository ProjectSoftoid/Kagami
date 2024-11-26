import enum

from sqlalchemy import Enum, String
from sqlalchemy.orm import Mapped, mapped_column

from ...extensions.security_ext import Encrypt
from .base import BaseModel


# reserve for permission management
class AdminPermissions(enum.Enum):
    ALL = "all"


class Admin(BaseModel):
    __tablename__ = "admin"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(64))
    hashed_password: Mapped[str] = mapped_column(String(255))
    admin_permission: Mapped[AdminPermissions] = mapped_column(
        Enum(AdminPermissions), comment="record admin permissions"
    )

    def check_password(self, raw_password: str) -> bool:
        return Encrypt.check_hashed_password(self.hashed_password, raw_password)
