import type { User } from '@/types/auth';

export const mockAuthUsers: User[] = [
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
];

// Session Cookie认证不需要token生成函数

export const mockLoginCredentials = {
  validPasswords: ['password', '123456'],
  adminUser: mockAuthUsers[0],
  regularUser: mockAuthUsers[1],
};
