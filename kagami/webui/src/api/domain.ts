import api, { ApiError } from './api';

export type Domain = {
  autoSelect_ip: string;
  ipv4: string;
  ipv6: string;
};

export const getDomain = async (): Promise<Domain> => {
  try {
    const response = await api.get(`/domain`);
    const data = response.data;

    if (!data || typeof data !== 'object') {
      throw new ApiError(400, 'INVALID_RESPONSE', 'Invalid domain data format', data);
    }

    if (!data.autoSelect_ip || !data.ipv4 || !data.ipv6) {
      throw new ApiError(400, 'MISSING_FIELDS', 'Domain data is missing required fields', data);
    }

    return data as Domain;
  } catch (error) {
    console.error('Error fetching domain:', error);
    throw error;
  }
};
