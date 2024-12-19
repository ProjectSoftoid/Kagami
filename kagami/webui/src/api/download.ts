import api, { ApiError } from './api';

// 定义文件列表项类型
type FileListItem = {
  version: string;
  file: string;
};

// 定义下载信息类型
export type Download = {
  category: string;
  resource_name: string;
  file_list: FileListItem[];
};

// 获取下载信息的函数
export const getDownloadList = async (): Promise<Download[]> => {
  try {
    const response = await api.get(`/iso_info`); // 请求 API
    const data = response.data;

    // 验证数据是否是数组
    if (!Array.isArray(data)) {
      throw new ApiError(400, 'INVALID_RESPONSE', 'Expected an array of downloads', data);
    }

    // 验证数组中每个元素的结构
    data.forEach((item, index) => {
      if (
        typeof item.category !== 'string' ||
        typeof item.resource_name !== 'string' ||
        !Array.isArray(item.file_list) ||
        item.file_list.some(
          (file: FileListItem) => typeof file.version !== 'string' || typeof file.file !== 'string'
        )
      ) {
        throw new ApiError(
          400,
          'INVALID_ELEMENT',
          `Invalid structure in download list at index ${index}`,
          item
        );
      }
    });

    return data as Download[];
  } catch (error) {
    console.error('Error fetching download list:', error);
    throw error;
  }
};
