import type {
  UserLoginRequest,
  UserLoginReply,
  UserRegisterRequest,
  UserRegisterReply,
} from '@/types/auth';
import { httpService } from '@/services/http';

export const authApi = {
  async login(data: UserLoginRequest): Promise<UserLoginReply> {
    const response = await httpService.post<UserLoginReply>('/api/user/login', data);
    return response;
  },

  async register(data: UserRegisterRequest): Promise<UserRegisterReply> {
    return await httpService.post<UserRegisterReply>('/api/user/register', data);
  },

  async logout(): Promise<void> {
    await httpService.post('/api/user/logout', undefined, {
      silentError: true,
    });
  },
};
