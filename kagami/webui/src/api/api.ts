import axios, { AxiosError } from 'axios';
import { env } from '../config/env';

// Custom error types
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor() {
    super('Request timeout');
    this.name = 'TimeoutError';
  }
}

// Error transformation utility
const transformError = (error: AxiosError): Error => {
  if (error.response) {
    // Server responded with error
    const status = error.response.status;
    const data = error.response.data as any;
    return new ApiError(
      status,
      data.code || 'UNKNOWN_ERROR',
      data.message || 'An unknown error occurred',
      data
    );
  } else if (error.code === 'ECONNABORTED') {
    return new TimeoutError();
  } else if (!error.response) {
    return new NetworkError('Network error occurred');
  }
  return error;
};

const api = axios.create({
  baseURL: env.api.baseURL,
  timeout: env.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  config => {
    if (env.isDev) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config);
    }
    return config;
  },
  error => {
    console.error('[API Request Error]', error);
    return Promise.reject(transformError(error));
  }
);

// Response interceptor
api.interceptors.response.use(
  response => {
    if (env.isDev) {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }
    return response;
  },
  error => {
    if (env.isDev) {
      console.error(`[API Error] ${error.config?.url}`, error);
    }
    
    const transformedError = transformError(error);
    
    // Log errors in production, but with less detail
    if (!env.isDev) {
      console.error(`[API Error] ${transformedError.name}: ${transformedError.message}`);
    }
    
    return Promise.reject(transformedError);
  }
);

export default api;
