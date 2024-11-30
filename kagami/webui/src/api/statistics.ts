import request from './api';

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

/**
 * 获取访问统计数据
 * @returns Promise<ApiResponse<Statistics>>
 */
export const getVisitStatistics = () => {
  return request.get<ApiResponse<Statistics>>('/api/statistics/visits');
};
