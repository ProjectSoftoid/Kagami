import api, { ApiError } from './api';

export type Helper = {
    name: string;
    content: string;
    last_update: string;
};

export const getHelper = async (resource_name: string): Promise<Helper[]> => {
    const response = await api.get(`/helper/${resource_name}`);
    const data = response.data;
    
    // Validate the response data structure
    if (!Array.isArray(data)) {
        throw new ApiError(400, 'INVALID_RESPONSE', 'Invalid helper data format: expected an array', data);
    }
    
    // Validate each item in the array
    for (const item of data) {
        if (!item.name || !item.content || !item.last_update) {
            throw new ApiError(400, 'MISSING_FIELDS', 'Helper data item is missing required fields', item);
        }
    }
    
    return data as Helper[];
};
