import type { User } from '@/types/auth';

export const mockUsersDatabase: User[] = [
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

export const createMockUser = (data: {
  userAccount: string;
  userName?: string;
  userRole: 'admin' | 'user' | 'ban';
}): User => {
  const maxId = Math.max(...mockUsersDatabase.map((u) => u.id), 0);
  return {
    id: maxId + 1,
    userName: data.userName || data.userAccount,
    userAccount: data.userAccount,
    userRole: data.userRole,
  };
};
