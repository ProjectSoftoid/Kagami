import logging

from sqlalchemy.ext.asyncio import AsyncSession

from ...extensions.security_ext import Encrypt
from ..models.admin import Admin, AdminPermissions

logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)


class AdminService:
    _session: AsyncSession

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def _get(self, admin_id: int):
        return await self._session.get(Admin, admin_id)

    async def add_admin(
        self, name: str, raw_password: str, permissions: AdminPermissions
    ):
        new_admin = Admin(
            name=name,
            hashed_pasword=Encrypt.hash_password(raw_password),
            admin_permission=permissions,
        )
        self._session.add_all(new_admin)
        await self._session.commit()

    async def delete_admin(self, admin_id: int):
        origin_account = await self._get(admin_id)
        if not origin_account:
            logger.error("delete_admin: id(", admin_id, ") is not found")
        self._session.delete(origin_account)
        self._session.commit()

    async def update_admin(
        self,
        admin_id: int,
        new_name: str | None = None,
        raw_new_password: str | None = None,
    ):
        origin_account = await self._get(admin_id)
        if not origin_account:
            logger.error("update_admin: id(", admin_id, ") is not found")
        if new_name:
            origin_account.name = new_name
        if raw_new_password:
            origin_account.hashed_password = Encrypt.hash_password(
                raw_password=raw_new_password
            )
        await self._session.commit()
