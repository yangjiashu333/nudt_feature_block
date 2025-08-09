import type { AxiosRequestConfig } from 'axios';

// 请求配置扩展
export interface RequestConfig extends AxiosRequestConfig {
  silentError?: boolean; // 静默错误，不显示toast提示
  customErrorHandler?: (error: ApiError) => void; // 自定义错误处理函数
}

// HTTP方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// 错误响应类型
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
  original?: unknown;
}
