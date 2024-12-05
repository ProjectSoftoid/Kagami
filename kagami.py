import click

from kagami.config import ConfigManager


@click.group()
def cmdline():
    pass


@cmdline.command()
@click.option("--debug-level", default="INFO", help="Set the debug level.")
@click.option("--http-host", help="Set HTTP listening host.")
@click.option("--http-port", help="Set HTTP listening port.")
@click.option("--grpc-host", help="Set gRPC listening host.")
@click.option("--grpc-port", help="Set gRPC listening port.")
def start_supervisor(debug_level, http_host, http_port, grpc_host, grpc_port):
    overrides = {
        "log_level": debug_level,
        "http_host": http_host,
        "http_port": http_port,
        "grpc_host": grpc_host,
        "grpc_port": grpc_port,
    }
    overrides = {k: v for k, v in overrides.items() if v is not None}

    ConfigManager.init(overrides=overrides)
    config = ConfigManager.get_configs()

    import uvicorn

    from kagami.server import kagami_server

    uvicorn.run(kagami_server, host=config.http_host, port=config.http_port)

if __name__ == "__main__":
    cmdline()
