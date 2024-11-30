import api from './api';

export interface User {
  user_id: string;
  username: string;
  traffic_used: number;
  is_active: boolean;
  current_connections: number;
  last_active: string;
}

export interface UserListResponse {
  code: number;
  data: {
    users: User[];
  };
}

// 获取用户使用情况列表
export const getUserUsageList = () => {
  return api.get<UserListResponse>('/api/users/usage');
};
