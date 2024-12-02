import api from './api';

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
    try {
      const response = await api.get(`/helper/${resource_name}`);
      return response.data as Helper;
    } catch (error) {
      console.error('获取帮助信息失败:', error);
      throw error;
    }
  };
