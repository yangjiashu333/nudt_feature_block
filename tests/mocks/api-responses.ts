import type { UserLoginReply, UserRegisterReply, UserListReply } from '@/types/auth';
import { mockAuthUsers } from './auth-data';
import { mockUsersDatabase } from './user-data';

export const mockApiResponses = {
  // Auth responses
  loginSuccess: (): UserLoginReply => ({
    user: mockAuthUsers[0],
    message: '登录成功',
    // Session Cookie认证不返回token
  }),

  loginFailure: (message: string) => {
    throw new Error(message);
  },

  registerSuccess: (id: number): UserRegisterReply => ({
    id,
    message: '注册成功',
  }),

  registerFailure: (message: string) => {
    throw new Error(message);
  },

  getCurrentUserSuccess: (): UserLoginReply => ({
    user: mockAuthUsers[0],
    message: '获取用户信息成功',
    // Session Cookie认证不返回token
  }),

  // User management responses
  getUserListSuccess: (): UserListReply => mockUsersDatabase,

  createUserSuccess: (id: number): UserRegisterReply => ({
    id,
    message: '用户创建成功',
  }),

  updateUserSuccess: (user: unknown) => user,

  checkUserAccountSuccess: (exists: boolean) => ({ exists }),
};

export const mockApiErrors = {
  USER_NOT_EXISTS: '用户名不存在',
  WRONG_PASSWORD: '密码错误',
  USER_ALREADY_EXISTS: '用户名已存在',
  USER_NOT_FOUND: '用户不存在',
  NETWORK_ERROR: '网络连接失败，请检查网络',
  SERVER_ERROR: '服务器内部错误',
};
