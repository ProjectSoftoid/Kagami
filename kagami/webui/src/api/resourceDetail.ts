import api, { ApiError } from './api';


export type ResourceDetail = {
    name: string; 
    providers: { 
        replica_id: number; 
        upstream_url: string; 
        provider_method: string; 
        status: string; 
    }[]; 
};

export const getResourceDetail = async (resource_name: string): Promise<ResourceDetail> => {
    const response = await api.get(`/resource/${resource_name}`);
    const data = response.data;

    if (!data || typeof data !== 'object') {
        throw new ApiError(400, 'INVALID_RESPONSE', 'Invalid resource detail data format', data);
    }

    if (!data.name || !data.providers || !Array.isArray(data.providers)) {
        throw new ApiError(400, 'MISSING_FIELDS', 'Resource detail is missing required fields', data);
    }

    for (const provider of data.providers) {
        if (
            typeof provider.replica_id !== 'number' ||
            typeof provider.upstream_url !== 'string' ||
            typeof provider.provider_method !== 'string' ||
            typeof provider.status !== 'string'
        ) {
            throw new ApiError(400, 'INVALID_PROVIDER_DATA', 'Provider data is invalid or missing required fields', provider);
        }
    }

    return data as ResourceDetail;
};
