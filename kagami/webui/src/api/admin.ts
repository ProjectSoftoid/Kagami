import api from './api';

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
}

export interface WorkerResource {
  cpu: number;
  memory: number;
  storage: number;
}

export interface Worker {
  address: string;
  status: 'pending' | 'active' | 'offline';
  resources: WorkerResource;
}

export interface WorkerListResponse {
  code: number;
  data: {
    workers: Worker[];
  };
  message: string;
}

// Accept Worker Response
export interface AcceptWorkerResponse {
  code: number;
  data: {
    worker: Worker;
  };
  message: string;
}

// Delete Worker Response
export interface DeleteWorkerResponse {
  code: number;
  message: string;
}

// Provider Info
export interface ProviderInfo {
  name: string;        // provider 名称
  method: string;      // provider 方法 (rsync等)
  status: string;      // provider 状态
  upstream_url: string; // 上游地址
}

// Resource Info
export interface ResourceInfo {
  name: string;           // 资源名称
  status: string;         // 资源状态
  providers: ProviderInfo[];
}

// Get Worker Resource Response
export interface GetWorkerResourceResponse {
  code: number;
  message: string;
  data: {
    resources: ResourceInfo[];
  };
}

// Add Provider Request
export interface AddProviderRequest {
  resource_name: string;
  provider: {
    name: string;
    method: string;
    upstream_url: string;
  }
}

// Add Provider Response
export interface AddProviderResponse {
  code: number;
  message: string;
  data: {
    provider: ProviderInfo;
  }
}

export const adminLogin = (data: AdminLoginRequest) => {
  return api.post<AdminLoginResponse>('/admin/login', data);
};

export const getWorkerList = async (): Promise<Worker[]> => {
  try {
    const response = await api.get<WorkerListResponse>('/admin/worker/list');
    if (response.data.code === 46) {
      return response.data.data.workers;
    }
    throw new Error(response.data.message);
  } catch (error) {
    console.error('Failed to fetch workers:', error);
    throw error;
  }
};

// Accept a pending worker
export const acceptWorker = async (address: string): Promise<Worker> => {
  try {
    const response = await api.post<AcceptWorkerResponse>('/admin/worker/accept', {
      address,
    });
    if (response.data.code === 46) {
      return response.data.data.worker;
    }
    throw new Error(response.data.message);
  } catch (error) {
    console.error('Failed to accept worker:', error);
    throw error;
  }
};

// Delete an existing worker
export const deleteWorker = async (address: string): Promise<void> => {
  try {
    const response = await api.post<DeleteWorkerResponse>('/admin/worker/delete', {
      address,
    });
    if (response.data.code !== 46) {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('Failed to delete worker:', error);
    throw error;
  }
};

// Get resources of a specific worker
export const getWorkerResource = async (address: string): Promise<ResourceInfo[]> => {
  try {
    const response = await api.get<GetWorkerResourceResponse>(`/admin/worker/${address}/resource`);
    // 检查响应状态和数据
    if (response.data && response.data.data && response.data.data.resources) {
      return response.data.data.resources;
    }
    // 如果响应格式不正确，抛出更具描述性的错误
    throw new Error(`Invalid response format: ${JSON.stringify(response.data)}`);
  } catch (error: any) {
    // 添加更详细的错误日志
    console.error('Failed to get worker resources:', {
      error,
      errorMessage: error.message,
      errorResponse: error.response?.data
    });
    // 如果是服务器返回的错误消息，使用它；否则使用通用错误消息
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch worker resources';
    throw new Error(errorMessage);
  }
};

// Add provider to a worker's resource
export const addProvider = async (address: string, data: AddProviderRequest): Promise<ProviderInfo> => {
  try {
    const response = await api.post<AddProviderResponse>(`/admin/worker/${address}/add_provider`, data);
    return response.data.data.provider;
  } catch (error) {
    console.error('Failed to add provider:', error);
    throw error;
  }
};
