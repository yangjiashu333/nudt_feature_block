import type {
  User,
  UserListReply,
  UserUpdateRequest,
  UserRegisterRequest,
  UserRegisterReply,
} from '@/types/auth';
import { httpService } from '@/services/http';
import type { CommonReply } from '@/types/common';

export const userApi = {
  async getUserList(): Promise<UserListReply> {
    return await httpService.get<UserListReply>('/api/user');
  },

  async getUserById(id: number): Promise<User> {
    return await httpService.get<User>(`/api/users/${id}`);
  },

  async createUser(data: UserRegisterRequest): Promise<UserRegisterReply> {
    return await httpService.post<UserRegisterReply>('/api/user/register', data);
  },

  async updateUser(id: number, data: UserUpdateRequest): Promise<CommonReply> {
    return await httpService.put<CommonReply>(`/api/user/${id}`, data);
  },

  async deleteUser(id: number): Promise<CommonReply> {
    return await httpService.delete<CommonReply>(`/api/users/${id}`);
  },
};
