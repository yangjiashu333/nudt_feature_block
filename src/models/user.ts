import { create } from 'zustand';
import { userApi } from '@/services/api/user';
import type { User, UserRole } from '@/types/auth';

interface UserState {
  users: User[];
  isLoading: boolean;
  getUserList: () => Promise<void>;
  addUser: (_userData: {
    userAccount: string;
    userName?: string;
    userPassword: string;
    userRole: UserRole;
  }) => Promise<void>;
  updateUser: (
    _id: number,
    _updates: { userName?: string; userPassword?: string; userRole?: UserRole }
  ) => Promise<void>;
  deleteUser: (_id: number) => Promise<void>;
  deleteUsers: (_ids: number[]) => Promise<void>;
}

export const useUserStore = create<UserState>((set, _get) => ({
  users: [],
  isLoading: false,

  getUserList: async () => {
    set({ isLoading: true });
    try {
      const users = await userApi.getUserList();
      set({ users });
    } finally {
      set({ isLoading: false });
    }
  },

  addUser: async (userData) => {
    set({ isLoading: true });
    try {
      await userApi.createUser({
        userAccount: userData.userAccount,
        userName: userData.userName,
        userPassword: userData.userPassword,
        userRole: userData.userRole,
      });
      // 重新获取用户列表
      const users = await userApi.getUserList();
      set({ users });
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (id, updates) => {
    set({ isLoading: true });
    try {
      await userApi.updateUser(id, updates);
      const users = await userApi.getUserList();
      set({ users });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true });
    try {
      await userApi.deleteUser(id);
      const users = await userApi.getUserList();
      set({ users });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUsers: async (ids) => {
    set({ isLoading: true });
    try {
      await userApi.deleteUsers(ids);
      const users = await userApi.getUserList();
      set({ users });
    } finally {
      set({ isLoading: false });
    }
  },
}));
