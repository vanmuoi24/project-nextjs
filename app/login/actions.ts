'use server';

import { authApi } from '@/lib/api';
import { LoginResponse } from '@/lib/api/auth';

export type LoginActionState = {
	success: boolean;
	error?: string;
	data?: LoginResponse;
};

export async function loginAction(
	prevState: LoginActionState,
	formData: FormData,
): Promise<LoginActionState> {
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;

	if (!email || !password) {
		return { success: false, error: 'Vui lòng nhập đầy đủ email và mật khẩu.' };
	}

	try {
		const response = await authApi.login({ email, password });
		const result = response.data;

		return {
			success: true,
			data: result,
		};
	} catch (error) {
		console.error('Login action error:', error);
		return {
			success: false,
			error: 'Không thể kết nối tới hệ thống. Vui lòng thử lại.',
		};
	}
}
