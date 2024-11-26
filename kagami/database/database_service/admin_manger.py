import bcrypt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.admin import Admin, AdminPermissions


class admin_service:
    _session: AsyncSession

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    def add_admin(self, name: str, raw_password: str, permissions: AdminPermissions):
        bytes = raw_password.encode("utf-8")
        salt = bcrypt.gensalt()
        in_hash_password = bcrypt.hashpw(bytes, salt)

        input = Admin(
            name=name,
            hashed_pasword=in_hash_password,
            admin_permission=permissions,
        )
        self._session.add_all(input)
        self._session.commit()

    def delete_admin(self, id: int):
        origin_account = self._session.execute(select(Admin).where(Admin.id == id))
        self._session.delete(origin_account)
        self._session.commit()

    def change_admin(
        self,
        id: int,
        name: str,
        raw_password: str,
        permissions: AdminPermissions,
    ):
        bytes = raw_password.encode("utf-8")
        salt = bcrypt.gensalt()
        in_hash_password = bcrypt.hashpw(bytes, salt)

        origin_account = self._session.execute(select(Admin).where(Admin.id == id))

        origin_account.name = name
        origin_account.hashed_pasword = in_hash_password
        origin_account.admin_permisssion = permissions

        self._session.commit()
