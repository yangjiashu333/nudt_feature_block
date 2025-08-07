import type {
  User,
  UserListReply,
  UserUpdateRequest,
  UserRegisterRequest,
  UserRegisterReply,
  UserRole,
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

    const url = queryParams.toString() ? `/api/users?${queryParams}` : '/api/users';
    return await httpService.get<UserListReply>(url);
  },

  async getUserById(id: number): Promise<User> {
    return await httpService.get<User>(`/api/users/${id}`);
  },

  async createUser(data: UserRegisterRequest & { userRole: UserRole }): Promise<UserRegisterReply> {
    return await httpService.post<UserRegisterReply>('/api/users', data);
  },

  async updateUser(id: number, data: UserUpdateRequest): Promise<User> {
    return await httpService.put<User>(`/api/users/${id}`, data);
  },

  async deleteUser(id: number): Promise<void> {
    await httpService.delete(`/api/users/${id}`);
  },

  async deleteUsers(ids: number[]): Promise<void> {
    await httpService.delete('/api/users/batch', { data: { ids } });
  },

  async checkUserAccount(userAccount: string, excludeId?: number): Promise<{ exists: boolean }> {
    const queryParams = new URLSearchParams({ userAccount });
    if (excludeId) queryParams.append('excludeId', excludeId.toString());

    return await httpService.get<{ exists: boolean }>(`/api/users/check?${queryParams}`);
  },

  async changePassword(
    id: number,
    data: { oldPassword?: string; newPassword: string }
  ): Promise<void> {
    await httpService.put(`/api/users/${id}/password`, data);
  },

  async changeUserRole(id: number, role: UserRole): Promise<User> {
    return await httpService.put<User>(`/api/users/${id}/role`, { role });
  },
};
