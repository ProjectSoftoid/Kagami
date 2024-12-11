import asyncio
import logging

import click


@click.group()
def cmdline():
    pass


@cmdline.command()
@click.option("--log-level", default="INFO", help="Set the log level.")
@click.option("--http-host", help="Set HTTP listening host.")
@click.option("--http-port", help="Set HTTP listening port.")
@click.option("--grpc-host", help="Set gRPC listening host.")
@click.option("--grpc-port", help="Set gRPC listening port.")
def start_supervisor(debug_level, http_host, http_port, grpc_host, grpc_port):
    from kagami.config import ConfigManager

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


@cmdline.command()
@click.option("--log-level", default="INFO", help="Set the log level.")
@click.option("--grpc-host", help="Set gRPC listening host.")
@click.option("--grpc-port", help="Set gRPC listening port.")
@click.option("--supervisor-host", help="Set supervisor host.")
@click.option("--supervisor-port", help="Set supervisor port.")
def start_worker(debug_level, grpc_host, grpc_port, supervisor_host, supervisor_port):
    from kagami_worker.config import ConfigManager

    overrides = {
        "log_level": debug_level,
        "grpc_host": grpc_host,
        "grpc_port": grpc_port,
        "supervisor_host": supervisor_host,
        "supervisor_port": supervisor_port,
    }
    overrides = {k: v for k, v in overrides.items() if v is not None}
    logging.basicConfig(level=debug_level)
    ConfigManager.init(overrides=overrides)

    from kagami_worker.server import start_worker

    asyncio.run(start_worker())


if __name__ == "__main__":
    cmdline()
