class BaseProvider:
    name: str
    work_dir: str
    upstream_url: str
    provider_method: str
    retry: bool

    provider_cmdline: str | None

    def __init__(
        self,
        name: str,
        work_dir: str,
        upstream_url: str,
        provider_method: str,
        retry: bool,
    ):
        self.name = name
        self.work_dir = work_dir
        self.upstream_url = upstream_url
        self.provider_method = provider_method
        self.retry = retry
