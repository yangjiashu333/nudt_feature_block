export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Config {
  apiUrl: string;
  version: string;
  environment: string;
}

export interface TestNode {
  id: string;
  name: string;
  type: string;
  config: Config;
}
