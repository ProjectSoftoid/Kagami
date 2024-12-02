import api, { ApiError } from './api';

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

export const adminLogin = async (data: AdminLoginRequest): Promise<string> => {
  const response = await api.post<AdminLoginResponse>('/admin/login', data);
  return response.data.token;
};

export const getWorkerList = async (): Promise<Worker[]> => {
  const response = await api.get<WorkerListResponse>('/admin/worker/list');
  if (response.data.code === 46) {
    return response.data.data.workers;
  }
  throw new ApiError(400, response.data.code.toString(), response.data.message);
};

// Accept a pending worker
export const acceptWorker = async (address: string): Promise<Worker> => {
  const response = await api.post<AcceptWorkerResponse>('/admin/worker/accept', {
    address,
  });
  if (response.data.code === 46) {
    return response.data.data.worker;
  }
  throw new ApiError(400, response.data.code.toString(), response.data.message);
};

// Delete an existing worker
export const deleteWorker = async (address: string): Promise<void> => {
  const response = await api.post<DeleteWorkerResponse>('/admin/worker/delete', {
    address,
  });
  if (response.data.code !== 46) {
    throw new ApiError(400, response.data.code.toString(), response.data.message);
  }
};

// Get resources of a specific worker
export const getWorkerResource = async (address: string): Promise<ResourceInfo[]> => {
  const response = await api.get<GetWorkerResourceResponse>(`/admin/worker/${address}/resource`);
  if (response.data && response.data.data && response.data.data.resources) {
    return response.data.data.resources;
  }
  throw new ApiError(
    400,
    'INVALID_RESPONSE',
    'Invalid response format from server',
    response.data
  );
};

// Add provider to a worker's resource
export const addProvider = async (address: string, data: AddProviderRequest): Promise<ProviderInfo> => {
  const response = await api.post<AddProviderResponse>(`/admin/worker/${address}/add_provider`, data);
  if (response.data.code === 46) {
    return response.data.data.provider;
  }
  throw new ApiError(400, response.data.code.toString(), response.data.message);
};
