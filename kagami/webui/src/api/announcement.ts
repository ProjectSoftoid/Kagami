import api from './api';

// 定义公告数据的类型
export interface Announcement {
  id: number;
  data: {
    title: string;
    content: string;
    date: string;
  };
}

// 获取所有公告
export const getAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const response = await api.get('/announcement');
    return response.data;
  } catch (error) {
    console.error('获取公告失败:', error);
    throw error;
  }
};

// 创建公告
export const createAnnouncement = async (announcement: Announcement): Promise<Announcement> => {
  try {
    const response = await api.post('/announcement', announcement);
    return response.data;
  } catch (error) {
    console.error('创建公告失败:', error);
    throw error;
  }
};
