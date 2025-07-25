// Token管理模块
const TOKEN_KEY = 'api_token';

export const tokenManager = {
  /**
   * 设置token
   */
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * 获取token
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * 清除token
   */
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};
