import api, { ApiError } from './api';

// 定义公告数据的类型
export type Announcement = {
  id: number;
  data: {
    title: string;
    content: string;
    date: string;
  };
};

// 获取所有公告
export const getAnnouncements = async (): Promise<Announcement[]> => {
  const response = await api.get('/announcement');
  if (!Array.isArray(response.data)) {
    throw new ApiError(400, 'INVALID_RESPONSE', 'Invalid announcement data format', response.data);
  }
  return response.data;
};

// 创建公告
export const createAnnouncement = async (announcement: Announcement): Promise<Announcement> => {
  const response = await api.post('/announcement', announcement);
  if (!response.data || !response.data.id) {
    throw new ApiError(400, 'INVALID_RESPONSE', 'Invalid created announcement data', response.data);
  }
  return response.data;
};
