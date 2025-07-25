import type {
  User,
  UserLoginRequest,
  UserLoginReply,
  UserRegisterRequest,
  UserRegisterReply,
} from '@/types/auth';
import { tokenManager } from '@/services/token';

// 模拟用户数据库
const mockUsersDb: User[] = [
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

// 模拟延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 生成mock JWT token
const generateMockToken = (user: User): string => {
  const payload = btoa(
    JSON.stringify({
      id: user.id,
      userAccount: user.userAccount,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24小时后过期
    })
  );
  return `mock.${payload}.signature`;
};

// 认证相关API
export const authApi = {
  // 用户登录
  async login(data: UserLoginRequest): Promise<UserLoginReply> {
    await delay(300); // 模拟网络延迟

    // 模拟登录验证
    const user = mockUsersDb.find((u) => u.userAccount === data.userAccount);

    if (!user) {
      throw new Error('用户名不存在');
    }

    // 简单密码验证（实际项目中不应该这样做）
    if (data.userPassword !== 'password' && data.userPassword !== '123456') {
      throw new Error('密码错误');
    }

    const token = generateMockToken(user);

    // 存储token
    tokenManager.setToken(token);

    return {
      user,
      message: '登录成功',
    };
  },

  // 用户注册
  async register(data: UserRegisterRequest): Promise<UserRegisterReply> {
    await delay(300);

    // 检查用户名是否已存在
    const existingUser = mockUsersDb.find((u) => u.userAccount === data.userAccount);
    if (existingUser) {
      throw new Error('用户名已存在');
    }

    // 创建新用户
    const newUser: User = {
      id: Math.max(...mockUsersDb.map((u) => u.id), 0) + 1,
      userName: data.userName || data.userAccount,
      userAccount: data.userAccount,
      userRole: 'user', // 新注册用户默认为普通用户
    };

    mockUsersDb.push(newUser);

    return {
      id: newUser.id,
      message: '注册成功',
    };
  },

  // 退出登录
  async logout(): Promise<void> {
    await delay(100);
    // 这里可以添加服务端登出逻辑，比如让token失效

    // 清除token
    tokenManager.clearToken();
    return Promise.resolve();
  },

  // 刷新token
  async refreshToken(): Promise<{ token: string }> {
    await delay(200);
    // 这里应该验证旧token，然后生成新token
    // 简化处理，直接返回新token
    return {
      token: generateMockToken({
        id: 1,
        userAccount: 'mock',
        userName: 'Mock User',
        userRole: 'user',
      }),
    };
  },

  // 获取当前用户信息
  async getCurrentUser(): Promise<UserLoginReply> {
    await delay(200);
    // 这里应该从token中解析用户信息
    // 简化处理，返回默认用户
    const user = mockUsersDb[0]; // 返回第一个用户作为示例
    return {
      user,
      message: '获取用户信息成功',
    };
  },
};
