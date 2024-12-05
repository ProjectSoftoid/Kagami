import api, { ApiError } from './api';

export enum Resourcestatus{
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
    ERROR = "ERROR"

};

export type ResourceDetail = {
    name:string;
    upstream_url:string;
    workers:{
        name:string;
        replica_id:number;
        provider_method:string;
        status:Resourcestatus
    }
};

export const getResourceDetail = async (resource_name: string): Promise<ResourceDetail> => {
    const response = await api.get(`/resource/${resource_name}`);
    const data = response.data;

    // Validate the response data structure
    if (!data || typeof data !== 'object') {
        throw new ApiError(400, 'INVALID_RESPONSE', 'Invalid resource detail data format', data);
    }

    // Validate required fields
    if (!data.name || !data.upstream_url || !data.workers) {
        throw new ApiError(400, 'MISSING_FIELDS', 'Resource detail is missing required fields', data);
    }

    // Validate workers data
    if (!Array.isArray(data.workers)) {
        throw new ApiError(400, 'INVALID_WORKERS', 'Workers data must be an array', data);
    }

    // Validate each worker's data structure
    for (const worker of data.workers) {
        if (!worker.name ||
            typeof worker.replica_id !== 'number' ||
            !worker.provider_method ||
            !Object.values(Resourcestatus).includes(worker.status)) {
            throw new ApiError(400, 'INVALID_WORKER_DATA', 'Worker data is invalid or missing required fields', worker);
        }
    }

    return data as ResourceDetail;
};
