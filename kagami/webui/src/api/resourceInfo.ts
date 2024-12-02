import api, { ApiError } from './api';

export type ResourceInfo = {
  name: string;
  status: string;
  helper: boolean;
};

export const getResource = async (): Promise<ResourceInfo[]> => {
  const response = await api.get('/resource_info');
  const data = response.data;

  if (!Array.isArray(data)) {
    throw new ApiError(400, 'INVALID_RESPONSE', 'Resource info data must be an array', data);
  }

  // Validate each resource's data structure
  for (const resource of data) {
    if (!resource.name || typeof resource.name !== 'string' ||
        !resource.status || typeof resource.status !== 'string' ||
        typeof resource.helper !== 'boolean') {
      throw new ApiError(400, 'INVALID_RESOURCE_DATA', 'Resource data is missing required fields or has invalid types', resource);
    }
  }

  return data;
};

export const createResource = async (resource: ResourceInfo): Promise<ResourceInfo[]> => {
  const response = await api.post('/resource', resource);
  const data = response.data;

  if (!Array.isArray(data)) {
    throw new ApiError(400, 'INVALID_RESPONSE', 'Created resource response must be an array', data);
  }

  // Validate each resource's data structure
  for (const res of data) {
    if (!res.name || typeof res.name !== 'string' ||
        !res.status || typeof res.status !== 'string' ||
        typeof res.helper !== 'boolean') {
      throw new ApiError(400, 'INVALID_RESOURCE_DATA', 'Resource data is missing required fields or has invalid types', res);
    }
  }

  return data;
};
