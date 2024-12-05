import request from './api'

export interface SystemMonitorData {
  cpu: {
    user: number;
    system: number;
    idle: number;
    iowait: number;
    temperature: number;
    usage: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    cached: number;
    buffered: number;
    usage: number;
  };
}

export interface SystemMonitorResponse {
  code: number;
  message: string;
  data: SystemMonitorData;
}

/**
 * 获取系统监控数据
 * @returns Promise<SystemMonitorResponse>
 */
export const getSystemMonitor = () => {
  return request.get<SystemMonitorResponse>('/api/monitor/system');
};

export interface TrafficData {
  current: number;
  mean_5m: number;
  max_5m: number;
}

export interface ServiceData {
  name: string;
  traffic: TrafficData;
  status: string;
}

export interface NetworkServices {
  services: ServiceData[];
}

export interface NetworkMonitorData {
  current_time: string;
  ipv4: NetworkServices;
  ipv6: NetworkServices;
}

export interface NetworkMonitorResponse {
  code: number;
  message: string;
  data: NetworkMonitorData;
}

/**
 * 获取网络监控数据
 * @returns Promise<NetworkMonitorResponse>
 */
export const getNetworkMonitor = () => {
  return request.get<NetworkMonitorResponse>('/api/monitor/network');
};

export interface DiskData {
  disk_id: string;
  hostname: string;
  usage: number;
  read_throughput: number;
  write_throughput: number;
  status: string;
}

export interface DiskMonitorData {
  current_time: string;
  disks: DiskData[];
}

export interface DiskMonitorResponse {
  code: number;
  message: string;
  data: DiskMonitorData;
}

/**
 * 获取磁盘监控数据
 * @returns Promise<DiskMonitorResponse>
 */
export const getDiskMonitor = () => {
  return request.get<DiskMonitorResponse>('/api/monitor/disk');
};
