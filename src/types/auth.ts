import type { CommonReply } from './common';

// DTO

export type UserListReply = User[];

export interface UserUpdateRequest {
  userName?: string;
  userPassword?: string;
  userRole?: UserRole;
}

export interface UserRegisterRequest {
  userAccount: string;
  userName?: string;
  userPassword: string;
}

export type UserRegisterReply = CommonReply & {
  id: number;
};

export interface UserLoginRequest {
  userAccount: string;
  userPassword: string;
}

export type UserLoginReply = CommonReply & {
  user: User;
};

// Model

export type UserRole = 'user' | 'admin' | 'ban';

export type User = {
  id: number;
  userName: string;
  userAccount: string;
  userRole: UserRole;
};
