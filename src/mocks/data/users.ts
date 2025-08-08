import type { User } from '@/types/auth';

export const mockUsers: User[] = [
  {
    id: 1,
    userName: '管理员',
    userAccount: 'admin',
    userRole: 'admin',
  },
  {
    id: 2,
    userName: '测试用户',
    userAccount: 'test',
    userRole: 'user',
  },
  {
    id: 3,
    userName: 'Demo用户',
    userAccount: 'demo',
    userRole: 'user',
  },
  {
    id: 4,
    userName: '被禁用户',
    userAccount: 'banned',
    userRole: 'ban',
  },
];

export const mockPasswords = {
  admin: '123456',
  test: '123456',
  demo: '123456',
  banned: '123456',
};

export const getNextUserId = (): number => {
  return Math.max(...mockUsers.map((u) => u.id)) + 1;
};

export const createUser = (userAccount: string, userName: string = userAccount): User => {
  const newUser: User = {
    id: getNextUserId(),
    userName,
    userAccount,
    userRole: 'user',
  };
  mockUsers.push(newUser);
  return newUser;
};

export const findUserByAccount = (userAccount: string): User | undefined => {
  return mockUsers.find((user) => user.userAccount === userAccount);
};
