import axios, { type AxiosError } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

export const apiClient = axios.create({
	baseURL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request: gắn token nếu có (chạy trên client)
apiClient.interceptors.request.use(
	(config) => {
		if (typeof window !== 'undefined') {
			const token = localStorage.getItem('token');
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// Response: xử lý lỗi chung
apiClient.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			if (typeof window !== 'undefined') {
				localStorage.removeItem('token');
				// Có thể redirect sang /login
				// window.location.href = '/login';
			}
		}
		return Promise.reject(error);
	},
);
