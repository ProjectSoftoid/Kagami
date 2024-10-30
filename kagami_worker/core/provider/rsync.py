import shlex
import asyncio
import logging

from .base import BaseProvider

logger = logging.getLogger(__name__)


class RsyncProvider(BaseProvider):
    """
    RsyncProvider
    replica_id: unique id for a replica provider, get it from supervisor
    rsync_options: rsync options
    """

    replica_id: int
    rsync_options: list[str]

    def __init__(
        self,
        name: str,
        work_dir: str,
        upstream_url: str,
        provider_method: str,
        retry: bool,
        rsync_options: list[str],
    ):
        super().__init__(name, work_dir, upstream_url, provider_method, retry)
        self.provider_cmdline = None
        self.rsync_options = rsync_options
        self.provider_cmdline = self._build_commandline()

    @classmethod
    def from_config(cls, provider_config) -> "RsyncProvider":
        return cls(
            name=provider_config.name,
            work_dir=provider_config.work_dir,
            upstream_url=provider_config.upstream_url,
            provider_method=provider_config.provider_method,
            retry=provider_config.retry,
            rsync_options=provider_config.rsync_options,
        )

    def _build_commandline(self):
        cmd = ["rsync"]
        cmd.extend(self.rsync_options)
        cmd.extend(self.upstream_url)
        cmd.extend(self.work_dir)

        return " ".join(shlex.quote(arg) for arg in cmd)

    async def sync_from_upstream(self):
        if not self.provider_cmdline:
            self.provider_cmdline = self._build_commandline()
        assert self.provider_cmdline

        try:
            process = await asyncio.create_subprocess_shell(
                self.provider_cmdline,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            stdout, stderr = await process.communicate()

            if process.returncode == 0:
                logger.info(f"Sync succeeded:\n {stdout}")
            else:
                logger.info(f"Sync failed with error:\n {stderr}")
            return process.returncode

        except Exception as e:
            logger.exception(f"An error occurred in SyncProvider: {e}")
