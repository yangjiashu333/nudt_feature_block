// API统一导出
export { authApi } from './auth';
export { userApi } from './user';

// 也可以创建一个包含所有API的对象
import { authApi } from './auth';
import { userApi } from './user';

export const api = {
  auth: authApi,
  user: userApi,
} as const;