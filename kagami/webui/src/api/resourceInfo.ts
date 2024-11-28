import api from './api';

export interface ResourceInfo {
    name:string;
    status:string;
    helper:boolean;
    };


export const getResource = async (): Promise<ResourceInfo[]> => {
    try {
      const response = await api.get('/resource_info');
      return response.data;
    } catch (error) {
      console.error('获取公告失败:', error);
      throw error;
    }
  };
  export const createAnnouncement = async (resource: ResourceInfo): Promise<ResourceInfo[]> => {
    try {
      const response = await api.post('/resource', resource);
      return response.data;
    } catch (error) {
      console.error('创建公告失败:', error);
      throw error;
    }
};
