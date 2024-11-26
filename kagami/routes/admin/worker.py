from fastapi import APIRouter, HTTPException
from ...deps import SupervisorDeps

worker_router = APIRouter(prefix="/admin/worker")

@worker_router.get("/list")
async def list_workers(supervisor: SupervisorDeps):
    """get all workers"""
    workers = supervisor.registered_workers
    return [
        {
            "addr": addr,
            "providers": [p.name for p in worker.providers.values()],
            "status": "online" if await supervisor.check_worker_health(addr) else "offline"
        }
        for addr, worker in workers.items()
    ]

@worker_router.get("/{worker_addr}/detail")
async def get_worker_detail(worker_addr: str, supervisor: SupervisorDeps):
    """get worker detail"""
    worker = supervisor.registered_workers.get(worker_addr)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    return {
        "addr": worker_addr,
        "status": "online" if await supervisor.check_worker_health(worker_addr) else "offline",
        "providers": [
            {
                "name": p.name,
                "status": p.provider_status.value,
                "upstream_url": p.upstream_url
            }
            for p in worker.providers.values()
        ]
    }

@worker_router.post("/{worker_addr}/register")
async def register_worker(worker_addr: str, supervisor: SupervisorDeps):
    """register worker"""
    await supervisor.regiser_worker(worker_addr)
    return {"message": "Worker registered successfully"}
