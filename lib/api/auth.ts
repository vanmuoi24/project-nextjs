import { apiClient } from "./axios";

/**
 * Khớp với backend UserRole enum
 */
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

/**
 * Khớp với backend entity User (TypeORM).
 * API không trả về password.
 */
export interface UserResponse {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

/**
 * Khớp với backend LoginDto
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * Khớp với backend RegisterUserDto
 */
export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "user";
}

/**
 * Response từ POST /auth/login (NestJS JWT thường trả access_token)
 */
export interface LoginResponse {
  access_token: string;
  user?: UserResponse;
}

/**
 * Khớp với NestJS AuthController
 */
export const authApi = {
  /** POST /auth/register */
  register: (dto: RegisterUserDto) =>
    apiClient.post<LoginResponse | UserResponse>("/auth/register", dto),

  /** POST /auth/login - trả access_token, lưu vào localStorage và set vào axios header */
  login: (dto: LoginDto) =>
    apiClient.post<LoginResponse>("/auth/login", dto),

  /** GET /auth/profile - cần gửi kèm Authorization: Bearer <token> (axios interceptor đã xử lý) */
  getProfile: () =>
    apiClient.get<UserResponse>("/auth/profile"),
};
