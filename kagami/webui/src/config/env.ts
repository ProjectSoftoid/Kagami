// 环境变量配置
export const env = {
  // API配置
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL as string,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT || 10000),
  },
  // 判断当前环境
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

// 类型检查，确保必要的环境变量存在
if (!env.api.baseURL) {
  throw new Error('VITE_API_BASE_URL is required');
}
