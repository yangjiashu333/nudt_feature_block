import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { useAuthStore } from '@/models/auth';
import { tokenManager } from '@/services/token';
import { apiConfig } from '@/config/env';
import type { RequestConfig } from './types';

// 创建axios实例
const http: AxiosInstance = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    const customConfig = config as RequestConfig;

    // 如果不跳过认证，自动添加token
    if (!customConfig.skipAuth) {
      const token = tokenManager.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回data，符合你的需求
    return response.data;
  },
  (error) => {
    const customConfig = error.config as RequestConfig;

    // 如果跳过错误处理，直接抛出
    if (customConfig?.skipErrorHandler) {
      return Promise.reject(error);
    }

    // 统一错误处理
    let errorMessage = '请求失败';

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401: {
          errorMessage = '登录已过期，请重新登录';
          tokenManager.clearToken();
          const { logout } = useAuthStore.getState();
          logout();
          break;
        }
        case 403:
          errorMessage = '没有权限访问该资源';
          break;
        case 404:
          errorMessage = '请求的资源不存在';
          break;
        case 500:
          errorMessage = '服务器内部错误';
          break;
        default:
          errorMessage = data?.message || `请求失败 (${status})`;
      }
    } else if (error.request) {
      errorMessage = '网络连接失败，请检查网络';
    } else {
      errorMessage = error.message || '未知错误';
    }

    // 使用alert显示错误
    alert(errorMessage);

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      details: error.response?.data,
    });
  }
);

// 基础HTTP方法封装
export const httpService = {
  // GET请求
  get<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return http.get(url, config);
  },

  // POST请求
  post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return http.post(url, data, config);
  },

  // PUT请求
  put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return http.put(url, data, config);
  },

  // DELETE请求
  delete<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return http.delete(url, config);
  },

  // PATCH请求
  patch<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return http.patch(url, data, config);
  },
};

// 导出axios实例（如果需要直接使用）
export { http };
export default httpService;
