# HTTP服务使用指南

## 📂 文件结构
```
src/services/
├── http/
│   ├── index.ts      # axios实例 + 基础HTTP方法
│   └── types.ts      # HTTP相关类型定义
├── api/
│   ├── auth.ts       # 认证相关API
│   ├── user.ts       # 用户管理API
│   └── index.ts      # API统一导出
├── index.ts          # services统一导出
└── README.md         # 使用说明（本文件）
```

## 🚀 使用方式

### 1. 基础HTTP方法
```typescript
import { httpService } from '@/services';

// GET请求
const users = await httpService.get<User[]>('/users');

// POST请求
const newUser = await httpService.post<User>('/users', {
  name: 'John',
  email: 'john@example.com'
});

// PUT请求
const updatedUser = await httpService.put<User>(`/users/${id}`, userData);

// DELETE请求
await httpService.delete(`/users/${id}`);
```

### 2. 使用封装好的API
```typescript
import { authApi, userApi } from '@/services';

// 用户登录
try {
  const loginResult = await authApi.login({
    userAccount: 'admin',
    userPassword: 'password'
  });
  console.log('登录成功:', loginResult);
} catch (error) {
  // 错误已经在拦截器中处理（显示alert）
  console.error('登录失败:', error);
}

// 获取用户列表
const users = await userApi.getUserList();

// 创建用户
const newUser = await userApi.createUser({
  userAccount: 'newuser',
  userName: '新用户',
  userPassword: 'password123'
});
```

### 3. 特殊配置选项
```typescript
// 跳过认证（如登录接口）
const data = await httpService.post('/auth/login', loginData, {
  skipAuth: true
});

// 跳过错误处理
const data = await httpService.get('/users', {
  skipErrorHandler: true
});
```

## ⚙️ 配置说明

### 环境变量
在对应的环境文件中配置API地址：
- `.env` - 通用配置
- `.env.development` - 开发环境
- `.env.production` - 生产环境

```bash
VITE_API_BASE_URL=http://localhost:5000
```

### 认证处理
- 自动从auth store获取用户信息
- 自动在请求头添加 `Authorization: Bearer ${token}`
- 401错误自动清除认证并跳转登录页

### 错误处理
- 统一使用alert显示错误信息
- 自动处理常见HTTP状态码
- 网络错误友好提示

## 📝 类型定义

所有的请求和响应类型都在 `src/types/auth.ts` 中定义：

```typescript
// 登录请求
interface UserLoginRequest {
  userAccount: string;
  userPassword: string;
}

// 登录响应
interface UserLoginReply {
  user: User;
  token?: string;
}
```

## 🔧 扩展使用

如果需要添加新的API模块，参考现有的 `auth.ts` 和 `user.ts` 文件结构：

1. 在 `src/services/api/` 下创建新文件
2. 定义API方法并导出
3. 在 `src/services/api/index.ts` 中添加导出
4. 在 `src/types/` 中定义相关类型

## 🚨 注意事项

1. **token管理**: 目前使用mock token，实际项目中需要完善token存储和刷新逻辑
2. **错误处理**: 可根据项目需求替换alert为toast或其他提示方式
3. **类型安全**: 建议为所有API调用指定返回类型
4. **环境配置**: 确保环境变量配置正确