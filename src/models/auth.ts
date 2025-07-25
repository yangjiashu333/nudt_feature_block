import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { User, UserLoginRequest, UserRegisterRequest } from '../types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  register: (_params: UserRegisterRequest) => void;
  login: (_params: UserLoginRequest) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      register: (params: UserRegisterRequest) => {
        console.log('registered', params);
      },
      login: (params: UserLoginRequest) => {
        const user: User = {
          id: 0,
          userName: 'user',
          userAccount: params.userAccount,
          userRole: 'user',
        };
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // localStorage的key
    }
  )
);
