import { http, HttpResponse } from 'msw';
import type {
  UserListReply,
  UserUpdateRequest,
  UserRegisterRequest,
  UserRegisterReply,
  UserRole,
} from '@/types/auth';
import { mockUsers, mockPasswords, findUserByAccount, createUser } from '../data/users';
import { mockSession } from '../data/session';

export const userHandlers = [
  http.get('*/api/user', async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!mockSession.isAuthenticated()) {
      return HttpResponse.json({ message: '未登录或登录已过期' }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const search = url.searchParams.get('search') || '';
    const role = url.searchParams.get('role') || 'all';

    let filteredUsers = [...mockUsers];

    if (search) {
      filteredUsers = filteredUsers.filter(
        (user) => user.userName.includes(search) || user.userAccount.includes(search)
      );
    }

    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter((user) => user.userRole === role);
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const response: UserListReply = paginatedUsers;

    return HttpResponse.json(response);
  }),

  http.get('*/api/users/:id', async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (!mockSession.isAuthenticated()) {
      return HttpResponse.json({ message: '未登录或登录已过期' }, { status: 401 });
    }

    const id = parseInt(params.id as string);
    const user = mockUsers.find((u) => u.id === id);

    if (!user) {
      return HttpResponse.json({ message: '用户不存在' }, { status: 404 });
    }

    return HttpResponse.json(user);
  }),

  http.post('*/api/user/register', async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!mockSession.isAuthenticated()) {
      return HttpResponse.json({ message: '未登录或登录已过期' }, { status: 401 });
    }

    const currentUser = mockSession.getCurrentUser();
    if (currentUser?.userRole !== 'admin') {
      return HttpResponse.json({ message: '权限不足' }, { status: 403 });
    }

    const data = (await request.json()) as UserRegisterRequest;

    if (findUserByAccount(data.userAccount)) {
      return HttpResponse.json({ message: '用户名已存在' }, { status: 400 });
    }

    const newUser = createUser(data.userAccount, data.userName || data.userAccount);
    newUser.userRole = 'user';
    mockPasswords[data.userAccount as keyof typeof mockPasswords] = data.userPassword;

    const response: UserRegisterReply = {
      message: '创建用户成功',
      id: newUser.id,
    };

    return HttpResponse.json(response);
  }),

  http.put('*/api/user/:id', async ({ params, request }) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (!mockSession.isAuthenticated()) {
      return HttpResponse.json({ message: '未登录或登录已过期' }, { status: 401 });
    }

    const id = parseInt(params.id as string);
    const data = (await request.json()) as UserUpdateRequest;
    const userIndex = mockUsers.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return HttpResponse.json({ message: '用户不存在' }, { status: 404 });
    }

    const currentUser = mockSession.getCurrentUser();
    if (currentUser?.userRole !== 'admin' && currentUser?.id !== id) {
      return HttpResponse.json({ message: '权限不足' }, { status: 403 });
    }

    if (data.userName) {
      mockUsers[userIndex].userName = data.userName;
    }
    if (data.userRole && currentUser?.userRole === 'admin') {
      mockUsers[userIndex].userRole = data.userRole;
    }
    if (data.userPassword) {
      mockPasswords[mockUsers[userIndex].userAccount as keyof typeof mockPasswords] =
        data.userPassword;
    }

    return HttpResponse.json(mockUsers[userIndex]);
  }),

  http.delete('*/api/users/batch', async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!mockSession.isAuthenticated()) {
      return HttpResponse.json({ message: '未登录或登录已过期' }, { status: 401 });
    }

    const currentUser = mockSession.getCurrentUser();
    if (currentUser?.userRole !== 'admin') {
      return HttpResponse.json({ message: '权限不足' }, { status: 403 });
    }

    const { ids } = (await request.json()) as { ids: number[] };

    if (ids.includes(currentUser.id)) {
      return HttpResponse.json({ message: '不能删除自己' }, { status: 400 });
    }

    const initialLength = mockUsers.length;
    for (let i = mockUsers.length - 1; i >= 0; i--) {
      if (ids.includes(mockUsers[i].id)) {
        mockUsers.splice(i, 1);
      }
    }

    const deletedCount = initialLength - mockUsers.length;

    return HttpResponse.json({
      message: `成功删除 ${deletedCount} 个用户`,
    });
  }),

  http.delete('*/api/users/:id', async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!mockSession.isAuthenticated()) {
      return HttpResponse.json({ message: '未登录或登录已过期' }, { status: 401 });
    }

    const currentUser = mockSession.getCurrentUser();
    if (currentUser?.userRole !== 'admin') {
      return HttpResponse.json({ message: '权限不足' }, { status: 403 });
    }

    const id = parseInt(params.id as string);
    const userIndex = mockUsers.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return HttpResponse.json({ message: '用户不存在' }, { status: 404 });
    }

    if (mockUsers[userIndex].id === currentUser.id) {
      return HttpResponse.json({ message: '不能删除自己' }, { status: 400 });
    }

    mockUsers.splice(userIndex, 1);

    return HttpResponse.json({ message: '删除成功' });
  }),

  http.get('*/api/users/check', async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const url = new URL(request.url);
    const userAccount = url.searchParams.get('userAccount');
    const excludeId = url.searchParams.get('excludeId');

    if (!userAccount) {
      return HttpResponse.json({ message: '缺少用户账号参数' }, { status: 400 });
    }

    let exists = false;
    const user = findUserByAccount(userAccount);

    if (user && (!excludeId || user.id !== parseInt(excludeId))) {
      exists = true;
    }

    return HttpResponse.json({ exists });
  }),

  http.put('*/api/users/:id/password', async ({ params, request }) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (!mockSession.isAuthenticated()) {
      return HttpResponse.json({ message: '未登录或登录已过期' }, { status: 401 });
    }

    const id = parseInt(params.id as string);
    const { oldPassword, newPassword } = (await request.json()) as {
      oldPassword?: string;
      newPassword: string;
    };

    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      return HttpResponse.json({ message: '用户不存在' }, { status: 404 });
    }

    const currentUser = mockSession.getCurrentUser();
    if (currentUser?.userRole !== 'admin' && currentUser?.id !== id) {
      return HttpResponse.json({ message: '权限不足' }, { status: 403 });
    }

    if (currentUser?.id === id && oldPassword) {
      const currentPassword = mockPasswords[user.userAccount as keyof typeof mockPasswords];
      if (oldPassword !== currentPassword) {
        return HttpResponse.json({ message: '原密码错误' }, { status: 400 });
      }
    }

    mockPasswords[user.userAccount as keyof typeof mockPasswords] = newPassword;

    return HttpResponse.json({ message: '密码修改成功' });
  }),

  http.put('*/api/users/:id/role', async ({ params, request }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!mockSession.isAuthenticated()) {
      return HttpResponse.json({ message: '未登录或登录已过期' }, { status: 401 });
    }

    const currentUser = mockSession.getCurrentUser();
    if (currentUser?.userRole !== 'admin') {
      return HttpResponse.json({ message: '权限不足' }, { status: 403 });
    }

    const id = parseInt(params.id as string);
    const { role } = (await request.json()) as { role: UserRole };

    const userIndex = mockUsers.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return HttpResponse.json({ message: '用户不存在' }, { status: 404 });
    }

    if (id === currentUser.id) {
      return HttpResponse.json({ message: '不能修改自己的角色' }, { status: 400 });
    }

    mockUsers[userIndex].userRole = role;

    return HttpResponse.json(mockUsers[userIndex]);
  }),
];
