import axios from 'axios';
import { env } from '../config/env';

const api = axios.create({
  baseURL: env.api.baseURL,
  timeout: env.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 开发环境下打印请求信息
if (env.isDev) {
  api.interceptors.request.use(config => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config);
    return config;
  });

  api.interceptors.response.use(
    response => {
      console.log(`[API Response] ${response.config.url}`, response.data);
      return response;
    },
    error => {
      console.error(`[API Error] ${error.config?.url}`, error);
      return Promise.reject(error);
    }
  );
}

export default api;
