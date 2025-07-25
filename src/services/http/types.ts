import type { AxiosRequestConfig } from 'axios';

// 请求配置扩展
export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean; // 跳过认证
  skipErrorHandler?: boolean; // 跳过错误处理
}

// HTTP方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// 错误响应类型
export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}
