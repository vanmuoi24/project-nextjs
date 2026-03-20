import { apiClient } from './axios';
import type { UserResponse } from './auth';

/**
 * API quản lý người dùng (admin - cần role admin)
 * GET /users thường do backend bảo vệ bằng guard admin
 */
export const usersApi = {
	getAll: () => apiClient.get<UserResponse[]>('/users'),

	getById: (id: number) => apiClient.get<UserResponse>(`/users/${id}`),
};
