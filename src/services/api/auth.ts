import type {
  UserLoginRequest,
  UserLoginReply,
  UserRegisterRequest,
  UserRegisterReply,
} from '@/types/auth';
import { httpService } from '@/services/http';

export const authApi = {
  async login(data: UserLoginRequest): Promise<UserLoginReply> {
    const response = await httpService.post<UserLoginReply>('/api/auth/login', data, {
      skipAuth: true,
    });

    return response;
  },

  async register(data: UserRegisterRequest): Promise<UserRegisterReply> {
    return await httpService.post<UserRegisterReply>('/api/auth/register', data, {
      skipAuth: true,
    });
  },

  async logout(): Promise<void> {
    await httpService.post('/api/auth/logout', undefined, {
      silentError: true,
    });
  },

  async getCurrentUser(): Promise<UserLoginReply> {
    return await httpService.get<UserLoginReply>('/api/auth/me');
  },
};
