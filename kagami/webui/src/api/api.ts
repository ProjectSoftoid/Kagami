import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:4523/m1/5454758-5129914-default',
  timeout: 10_000, // 超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
