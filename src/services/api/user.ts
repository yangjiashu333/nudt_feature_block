import type { 
  User, 
  UserListReply, 
  UserUpdateRequest,
  UserRegisterRequest,
  UserRegisterReply,
  UserRole 
} from '@/types/auth';

// 模拟用户数据库（内存存储）
let mockUsersDb: User[] = [
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

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 用户管理相关API
export const userApi = {
  // 获取用户列表
  async getUserList(params?: { 
    page?: number; 
    pageSize?: number; 
    search?: string; 
    role?: string; 
  }): Promise<UserListReply> {
    await delay(200);
    
    let filteredUsers = [...mockUsersDb];
    
    // 搜索过滤
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.userAccount.toLowerCase().includes(searchTerm) ||
        user.userName.toLowerCase().includes(searchTerm)
      );
    }
    
    // 角色过滤
    if (params?.role && params.role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.userRole === params.role);
    }
    
    // 分页处理（简化版）
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedUsers = filteredUsers.slice(start, end);
    
    return paginatedUsers;
  },

  // 根据ID获取用户详情
  async getUserById(id: number): Promise<User> {
    await delay(100);
    
    const user = mockUsersDb.find(u => u.id === id);
    if (!user) {
      throw new Error('用户不存在');
    }
    
    return user;
  },

  // 创建用户
  async createUser(data: UserRegisterRequest & { userRole: UserRole }): Promise<UserRegisterReply> {
    await delay(300);
    
    // 检查用户名是否已存在
    const existingUser = mockUsersDb.find(u => u.userAccount === data.userAccount);
    if (existingUser) {
      throw new Error('用户名已存在');
    }
    
    // 创建新用户
    const newUser: User = {
      id: Math.max(...mockUsersDb.map(u => u.id), 0) + 1,
      userName: data.userName || data.userAccount,
      userAccount: data.userAccount,
      userRole: data.userRole,
    };
    
    mockUsersDb.push(newUser);
    
    return {
      id: newUser.id,
      message: '用户创建成功'
    };
  },

  // 更新用户信息
  async updateUser(id: number, data: UserUpdateRequest): Promise<User> {
    await delay(200);
    
    const userIndex = mockUsersDb.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('用户不存在');
    }
    
    // 更新用户信息
    mockUsersDb[userIndex] = {
      ...mockUsersDb[userIndex],
      ...data,
    };
    
    return mockUsersDb[userIndex];
  },

  // 删除用户
  async deleteUser(id: number): Promise<void> {
    await delay(200);
    
    const userIndex = mockUsersDb.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('用户不存在');
    }
    
    mockUsersDb.splice(userIndex, 1);
  },

  // 批量删除用户
  async deleteUsers(ids: number[]): Promise<void> {
    await delay(300);
    
    mockUsersDb = mockUsersDb.filter(user => !ids.includes(user.id));
  },

  // 检查用户名是否存在
  async checkUserAccount(userAccount: string, excludeId?: number): Promise<{ exists: boolean }> {
    await delay(100);
    
    const exists = mockUsersDb.some(u => 
      u.userAccount === userAccount && u.id !== excludeId
    );
    
    return { exists };
  },

  // 修改密码
  async changePassword(id: number, _data: { oldPassword?: string; newPassword: string }): Promise<void> {
    await delay(200);
    
    const user = mockUsersDb.find(u => u.id === id);
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 这里只是模拟，实际项目中需要验证旧密码
    // 在mock API中，我们假设密码修改总是成功的
    return Promise.resolve();
  },

  // 修改用户角色
  async changeUserRole(id: number, role: UserRole): Promise<User> {
    await delay(200);
    
    const userIndex = mockUsersDb.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new Error('用户不存在');
    }
    
    mockUsersDb[userIndex].userRole = role;
    return mockUsersDb[userIndex];
  },
};