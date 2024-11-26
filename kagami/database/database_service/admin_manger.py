from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ....kagami.extensions.security_ext import Encrypt
from ..models.admin import Admin, AdminPermissions


class AdminService:
    _session: AsyncSession

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    def add_admin(self, name: str, raw_password: str, permissions: AdminPermissions):
        new_admin = Admin(
            name=name,
            hashed_pasword=Encrypt.salt_hashed_password(raw_password),
            admin_permission=permissions,
        )
        self._session.add_all(new_admin)
        self._session.commit()

    def delete_admin(self, id: int):
        origin_account = self._session.execute(select(Admin).where(Admin.id == id))
        self._session.delete(origin_account)
        self._session.commit()

    def update_admin(self, id: int, name: str, raw_password: str):

        origin_account = self._session.execute(select(Admin).where(Admin.id == id))

        origin_account.name = name
        origin_account.hashed_pasword = Encrypt.salt_hashed_password(raw_password)
        self._session.commit()
