import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';
import { useAuthStore } from '@/models/auth';
import { apiConfig } from '@/config/env';
import { toast } from 'sonner';
import type { RequestConfig, ApiError } from './types';

const http: AxiosInstance = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.timeout,
  withCredentials: true, // 启用cookie认证
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 获取错误信息
 */
function getErrorMessage(error: AxiosError): string {
  if (error.response) {
    const { status } = error.response;
    switch (status) {
      case 401:
        return '登录已过期，请重新登录';
      case 403:
        return '没有权限访问该资源';
      case 404:
        return '请求的资源不存在';
      case 500:
        return '服务器内部错误';
      default:
        return `请求失败 (${status})`;
    }
  } else if (error.request) {
    return '网络连接失败，请检查网络';
  } else {
    return error.message || '未知错误';
  }
}

/**
 * 获取错误代码
 */
function getErrorCode(error: AxiosError): string {
  if (error.response) {
    return `HTTP_${error.response.status}`;
  } else if (error.request) {
    return 'NETWORK_ERROR';
  } else {
    return 'UNKNOWN_ERROR';
  }
}

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    const customConfig = error.config as RequestConfig;

    const apiError: ApiError = {
      message: getErrorMessage(error),
      code: getErrorCode(error),
      status: error.response?.status,
      details: error.response?.data,
      original: error,
    };

    if (error.response?.status === 401) {
      // Session Cookie由服务器管理，前端只需要清除状态
      const { logout } = useAuthStore.getState();
      logout();
    }

    if (customConfig?.customErrorHandler) {
      customConfig.customErrorHandler(apiError);
    } else if (!customConfig?.silentError && !customConfig?.skipErrorHandler) {
      toast.error(apiError.message);
    }

    return Promise.reject(apiError);
  }
);

// 基础HTTP方法封装
export const httpService = {
  get<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return http.get(url, config);
  },

  post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return http.post(url, data, config);
  },

  put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return http.put(url, data, config);
  },

  delete<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return http.delete(url, config);
  },

  patch<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return http.patch(url, data, config);
  },
};
export { http };
export default httpService;
