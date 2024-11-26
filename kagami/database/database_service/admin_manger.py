import bcrypt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.admin import Admin, AdminPermissions


class AdminService:
    _session: AsyncSession

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    def add_admin(self, name: str, raw_password: str, permissions: AdminPermissions):
        bytes = raw_password.encode("utf-8")
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(bytes, salt)

        new_admin = Admin(
            name=name,
            hashed_pasword=hashed_password,
            admin_permission=permissions,
        )
        self._session.add_all(new_admin)
        self._session.commit()

    def delete_admin(self, id: int):
        origin_account = self._session.execute(select(Admin).where(Admin.id == id))
        self._session.delete(origin_account)
        self._session.commit()

    def update_admin(self, id: int, name: str, raw_password: str):
        bytes = raw_password.encode("utf-8")
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(bytes, salt)

        origin_account = self._session.execute(select(Admin).where(Admin.id == id))

        origin_account.name = name
        origin_account.hashed_pasword = hashed_password
        self._session.commit()
