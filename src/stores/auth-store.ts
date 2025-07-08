import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  username: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      login: (username: string, _password: string) => {
        // 简单登录，不进行验证
        const user: User = {
          username,
          email: `${username}@example.com`,
        };
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
