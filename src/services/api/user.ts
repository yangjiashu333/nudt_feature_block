import type {
  User,
  UserListReply,
  UserUpdateRequest,
  UserRegisterRequest,
  UserRegisterReply,
} from '@/types/auth';
import { httpService } from '@/services/http';

export const userApi = {
  async getUserList(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: string;
  }): Promise<UserListReply> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.role && params.role !== 'all') queryParams.append('role', params.role);

    const url = queryParams.toString() ? `/api/user?${queryParams}` : '/api/user';
    return await httpService.get<UserListReply>(url);
  },

  async getUserById(id: number): Promise<User> {
    return await httpService.get<User>(`/api/users/${id}`);
  },

  async createUser(data: UserRegisterRequest): Promise<UserRegisterReply> {
    return await httpService.post<UserRegisterReply>('/api/user/register', data);
  },

  async updateUser(id: number, data: UserUpdateRequest): Promise<User> {
    return await httpService.put<User>(`/api/user/${id}`, data);
  },

  async deleteUser(id: number): Promise<void> {
    await httpService.delete(`/api/users/${id}`);
  },
};
