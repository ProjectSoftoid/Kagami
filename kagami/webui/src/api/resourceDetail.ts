import api, { ApiError } from './api';


// 定义资源详情类型
export type ResourceDetail = {
    name: string; // 资源名称
    providers: { // 提供者信息数组
        replica_id: number; // 副本 ID
        upstream_url: string; // 上游 URL
        provider_method: string; // 提供方法
        status: string; // 提供者状态
    }[]; // 数组类型
};

// 获取资源详情的函数
export const getResourceDetail = async (resource_name: string): Promise<ResourceDetail> => {
    const response = await api.get(`/resource/${resource_name}`);
    const data = response.data;

    // 验证数据是否为对象类型
    if (!data || typeof data !== 'object') {
        throw new ApiError(400, 'INVALID_RESPONSE', 'Invalid resource detail data format', data);
    }

    // 验证所需字段是否存在
    if (!data.name || !data.providers || !Array.isArray(data.providers)) {
        throw new ApiError(400, 'MISSING_FIELDS', 'Resource detail is missing required fields', data);
    }

    // 验证每个 provider 的结构
    for (const provider of data.providers) {
        if (
            typeof provider.replica_id !== 'number' ||
            typeof provider.upstream_url !== 'string' ||
            typeof provider.provider_method !== 'string' ||
            typeof provider.status !== 'string'
        ) {
            throw new ApiError(400, 'INVALID_PROVIDER_DATA', 'Provider data is invalid or missing required fields', provider);
        }
    }

    return data as ResourceDetail;
};
