import bcrypt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ...admin.admin import Admin, AdminPermissions


class SessionManager:
    _session: AsyncSession

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    def add_admin(
        self, in_name: str, input_password: str, in_permissions: AdminPermissions
    ):
        bytes = input_password.encode("utf-8")
        salt = bcrypt.gensalt()
        in_hash_password = bcrypt.hashpw(bytes, salt)

        input = Admin(
            name=in_name,
            hashed_pasword=in_hash_password,
            admin_permission=in_permissions,
        )
        self._session.add_all(input)
        self._session.commit()

    def delete_admin(self, id: int):
        aim_account = self._session.execute(select(Admin).where(Admin.id == id))
        self._session.delete(aim_account)
        self._session.commit()

    def change_admin(
        self,
        id: int,
        in_name: str,
        input_password: str,
        in_permissions: AdminPermissions,
    ):
        bytes = input_password.encode("utf-8")
        salt = bcrypt.gensalt()
        in_hash_password = bcrypt.hashpw(bytes, salt)

        aim_account = self._session.execute(select(Admin).where(Admin.id == id))

        aim_account.name = in_name
        aim_account.hashed_pasword = in_hash_password
        aim_account.admin_permisssion = in_permissions

        self._session.commit()
