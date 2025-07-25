import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/services/api/auth';
import type { User, UserLoginRequest, UserRegisterRequest } from '../types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (_params: UserRegisterRequest) => Promise<void>;
  login: (_params: UserLoginRequest) => Promise<void>;
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
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (params: UserLoginRequest) => {
        set({ isLoading: true });
        try {
          const result = await authApi.login(params);
          set({
            user: result.user,
            isAuthenticated: true,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage的key
    }
  )
);
