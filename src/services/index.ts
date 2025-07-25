// HTTP服务
export { default as httpService, http } from './http';
export type { RequestConfig, HttpMethod, ApiError } from './http/types';

// API服务
export { authApi, userApi, api } from './api';

// 导入用于默认导出
import httpService from './http';
import { authApi, userApi } from './api';

// 默认导出常用的服务
export default {
  http: httpService,
  api: {
    auth: authApi,
    user: userApi,
  },
} as const;
