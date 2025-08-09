import { http, HttpResponse } from 'msw';
import type {
  UserLoginRequest,
  UserRegisterRequest,
  UserLoginReply,
  UserRegisterReply,
} from '@/types/auth';
import { mockPasswords, findUserByAccount, createUser } from '../data/users';
import { mockSession } from '../data/session';

export const authHandlers = [
  http.post('*/api/user/login', async ({ request }) => {
    const { userAccount, userPassword } = (await request.json()) as UserLoginRequest;

    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = findUserByAccount(userAccount);

    if (!user) {
      return HttpResponse.json({ code: 40001, message: '用户不存在' }, { status: 401 });
    }

    const correctPassword = mockPasswords[userAccount as keyof typeof mockPasswords];
    if (userPassword !== correctPassword) {
      return HttpResponse.json({ code: 40001, message: '密码错误' }, { status: 401 });
    }

    if (user.userRole === 'ban') {
      return HttpResponse.json({ code: 40003, message: '账号已被禁用' }, { status: 403 });
    }

    mockSession.setCurrentUser(user);

    const response: UserLoginReply = {
      message: '登录成功',
      user,
    };

    return HttpResponse.json(response, {
      headers: {
        'Set-Cookie': `session=mock-session-${user.id}; HttpOnly; Path=/; Max-Age=86400`,
      },
    });
  }),

  http.post('*/api/user/register', async ({ request }) => {
    const { userAccount, userName, userPassword } = (await request.json()) as UserRegisterRequest;

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (findUserByAccount(userAccount)) {
      return HttpResponse.json({ code: 40000, message: '用户名已存在' }, { status: 400 });
    }

    if (userPassword.length < 6) {
      return HttpResponse.json({ code: 40000, message: '密码至少需要6位' }, { status: 400 });
    }

    const newUser = createUser(userAccount, userName || userAccount);
    mockPasswords[userAccount as keyof typeof mockPasswords] = userPassword;

    const response: UserRegisterReply = {
      message: '注册成功',
      id: newUser.id,
    };

    return HttpResponse.json(response);
  }),

  http.post('*/api/user/logout', async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    mockSession.clear();

    return HttpResponse.json(
      { code: 0, message: '退出成功' },
      {
        headers: {
          'Set-Cookie': 'session=; HttpOnly; Path=/; Max-Age=0',
        },
      }
    );
  }),
];
