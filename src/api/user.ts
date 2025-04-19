import request from "@/api/request.ts";
import type { ApiResponse } from '@/types';

// 定义返回的接口类型
interface User {
  id: number;
  account: string;
  nickname: string;
  email?: string;
  phone?: string;
  avatar?: string;
  gender: number;
  roles: string;
  lastLoginTime?: string;
  lastLoginIp?: string;
  createTime: string;
}

interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export const login = (data: any) => {
  return request.post<ApiResponse<LoginResponse>>("/auth/login", data);
};

export const getUserInfo = () => {
  return request.get<ApiResponse<User>>("/auth/user-info");
};

export const logout = () => {
  return request.post<ApiResponse<boolean>>("/auth/logout");
};