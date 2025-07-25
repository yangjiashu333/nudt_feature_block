import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/services/api/auth';
import type { User, UserLoginRequest, UserRegisterRequest } from '../types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (_params: UserRegisterRequest) => Promise<{ success: boolean; message?: string }>;
  login: (_params: UserLoginRequest) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      register: async (params: UserRegisterRequest) => {
        set({ isLoading: true });
        try {
          await authApi.register(params);
          set({ isLoading: false });
          return { success: true, message: '注册成功' };
        } catch (error: any) {
          set({ isLoading: false });
          return { success: false, message: error.message || '注册失败' };
        }
      },
      
      login: async (params: UserLoginRequest) => {
        set({ isLoading: true });
        try {
          const result = await authApi.login(params);
          set({ 
            user: result.user, 
            isAuthenticated: true,
            isLoading: false 
          });
          return { success: true, message: '登录成功' };
        } catch (error: any) {
          set({ isLoading: false });
          return { success: false, message: error.message || '登录失败' };
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
          // 清除token
          localStorage.removeItem('api_token');
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false 
          });
        } catch (error) {
          // 即使API失败，也要清除本地状态
          localStorage.removeItem('api_token');
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage的key
    }
  )
);
