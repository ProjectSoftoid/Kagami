import { request } from '../utils/request';

export interface Statistics {
  timestamp: string;
  metrics: {
    active_users: number;
    total_traffic: number;
    concurrent_connections: number;
  };
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export const getVisitStatistics = () => {
  return request<ApiResponse<Statistics>>('/api/statistics/visits');
};
