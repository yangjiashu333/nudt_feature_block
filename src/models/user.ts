import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types/auth';

interface UserState {
  users: User[];
  getUserList: () => User[];
  addUser: (_userData: {
    userAccount: string;
    userName?: string;
    userPassword: string;
    userRole: UserRole;
  }) => { success: boolean; message: string };
  updateUser: (
    _id: number,
    _updates: { userName?: string; userPassword?: string; userRole?: UserRole }
  ) => { success: boolean; message: string };
  deleteUser: (_id: number) => { success: boolean; message: string };
  deleteUsers: (_ids: number[]) => { success: boolean; message: string };
  getUserById: (_id: number) => User | undefined;
  isUserAccountExists: (_userAccount: string, _excludeId?: number) => boolean;
}

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: 1,
    userName: '系统管理员',
    userAccount: 'admin',
    userRole: 'admin',
  },
  {
    id: 2,
    userName: '张三',
    userAccount: 'zhangsan',
    userRole: 'user',
  },
  {
    id: 3,
    userName: '李四',
    userAccount: 'lisi',
    userRole: 'user',
  },
  {
    id: 4,
    userName: '王五',
    userAccount: 'wangwu',
    userRole: 'ban',
  },
  {
    id: 5,
    userName: '赵六',
    userAccount: 'zhaoliu',
    userRole: 'user',
  },
];

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: mockUsers,

      getUserList: () => {
        return get().users;
      },

      addUser: (userData) => {
        const { users, isUserAccountExists } = get();

        // 检查用户名是否已存在
        if (isUserAccountExists(userData.userAccount)) {
          return { success: false, message: '用户名已存在' };
        }

        // 生成新的用户ID
        const newId = Math.max(...users.map((u) => u.id), 0) + 1;

        const newUser: User = {
          id: newId,
          userName: userData.userName || userData.userAccount,
          userAccount: userData.userAccount,
          userRole: userData.userRole,
        };

        set((state) => ({
          users: [...state.users, newUser],
        }));

        return { success: true, message: '用户添加成功' };
      },

      updateUser: (id, updates) => {
        const { users } = get();
        const userIndex = users.findIndex((u) => u.id === id);

        if (userIndex === -1) {
          return { success: false, message: '用户不存在' };
        }

        const updatedUsers = [...users];
        updatedUsers[userIndex] = {
          ...updatedUsers[userIndex],
          ...updates,
        };

        set({ users: updatedUsers });
        return { success: true, message: '用户更新成功' };
      },

      deleteUser: (id) => {
        const { users } = get();
        const userExists = users.some((u) => u.id === id);

        if (!userExists) {
          return { success: false, message: '用户不存在' };
        }

        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        }));

        return { success: true, message: '用户删除成功' };
      },

      deleteUsers: (ids) => {
        set((state) => ({
          users: state.users.filter((u) => !ids.includes(u.id)),
        }));

        return { success: true, message: `成功删除 ${ids.length} 个用户` };
      },

      getUserById: (id) => {
        return get().users.find((u) => u.id === id);
      },

      isUserAccountExists: (userAccount, excludeId) => {
        return get().users.some((u) => u.userAccount === userAccount && u.id !== excludeId);
      },
    }),
    {
      name: 'user-store',
    }
  )
);
