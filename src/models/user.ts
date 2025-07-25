import { create } from 'zustand';
import { userApi } from '@/services/api/user';
import type { User, UserRole } from '@/types/auth';

interface UserState {
  users: User[];
  isLoading: boolean;
  getUserList: () => Promise<User[]>;
  addUser: (_userData: {
    userAccount: string;
    userName?: string;
    userPassword: string;
    userRole: UserRole;
  }) => Promise<{ success: boolean; message: string }>;
  updateUser: (
    _id: number,
    _updates: { userName?: string; userPassword?: string; userRole?: UserRole }
  ) => Promise<{ success: boolean; message: string }>;
  deleteUser: (_id: number) => Promise<{ success: boolean; message: string }>;
  deleteUsers: (_ids: number[]) => Promise<{ success: boolean; message: string }>;
  getUserById: (_id: number) => Promise<User | undefined>;
  isUserAccountExists: (_userAccount: string, _excludeId?: number) => Promise<boolean>;
}

export const useUserStore = create<UserState>((set, _get) => ({
  users: [],
  isLoading: false,

  getUserList: async () => {
    set({ isLoading: true });
    try {
      const users = await userApi.getUserList();
      set({ users, isLoading: false });
      return users;
    } catch (error: unknown) {
      set({ isLoading: false });
      throw error;
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
      set({ users, isLoading: false });

      return { success: true, message: '用户添加成功' };
    } catch (error: unknown) {
      set({ isLoading: false });
      const errorMessage = error instanceof Error ? error.message : '添加用户失败';
      return { success: false, message: errorMessage };
    }
  },

  updateUser: async (id, updates) => {
    set({ isLoading: true });
    try {
      await userApi.updateUser(id, updates);

      // 重新获取用户列表
      const users = await userApi.getUserList();
      set({ users, isLoading: false });

      return { success: true, message: '用户更新成功' };
    } catch (error: unknown) {
      set({ isLoading: false });
      const errorMessage = error instanceof Error ? error.message : '更新用户失败';
      return { success: false, message: errorMessage };
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true });
    try {
      await userApi.deleteUser(id);

      // 重新获取用户列表
      const users = await userApi.getUserList();
      set({ users, isLoading: false });

      return { success: true, message: '用户删除成功' };
    } catch (error: unknown) {
      set({ isLoading: false });
      const errorMessage = error instanceof Error ? error.message : '删除用户失败';
      return { success: false, message: errorMessage };
    }
  },

  deleteUsers: async (ids) => {
    set({ isLoading: true });
    try {
      await userApi.deleteUsers(ids);

      // 重新获取用户列表
      const users = await userApi.getUserList();
      set({ users, isLoading: false });

      return { success: true, message: `成功删除 ${ids.length} 个用户` };
    } catch (error: unknown) {
      set({ isLoading: false });
      const errorMessage = error instanceof Error ? error.message : '批量删除用户失败';
      return { success: false, message: errorMessage };
    }
  },

  getUserById: async (id) => {
    try {
      const user = await userApi.getUserById(id);
      return user;
    } catch {
      return undefined;
    }
  },

  isUserAccountExists: async (userAccount, excludeId) => {
    try {
      const result = await userApi.checkUserAccount(userAccount, excludeId);
      return result.exists;
    } catch {
      return false;
    }
  },
}));
