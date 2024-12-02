import api, { ApiError } from './api';

export type Helper = {
    title: string;
    content: string;
    examples: Array<string>;
    links: Array<{
        name: string;
        url: string;
    }>;
};

export const getHelper = async (resource_name: string): Promise<Helper> => {
    const response = await api.get(`/helper/${resource_name}`);
    const data = response.data;
    
    // Validate the response data structure
    if (!data || typeof data !== 'object') {
        throw new ApiError(400, 'INVALID_RESPONSE', 'Invalid helper data format', data);
    }
    
    if (!data.title || !data.content || !Array.isArray(data.examples) || !Array.isArray(data.links)) {
        throw new ApiError(400, 'MISSING_FIELDS', 'Helper data is missing required fields', data);
    }
    
    return data as Helper;
};
