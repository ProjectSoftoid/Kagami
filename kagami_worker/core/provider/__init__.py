from .base import BaseProvider
from .rsync import RsyncProvider

PROVIDER_CLASS_MAP = {
    "rsync": RsyncProvider,
    # "git": GitProvider
}


__all__ = ["BaseProvider", "RsyncProvider"]
