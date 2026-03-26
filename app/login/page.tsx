'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { loginAction, type LoginActionState } from './actions';

export default function LoginPage() {
	const router = useRouter();
	const { login } = useAuth();

	/**
	 * useActionState (thay thế cho useFormState trong React 19)
	 * state: Dữ liệu trả về từ Server Action (initialState là { success: false })
	 * formAction: Hàm liên kết với thuộc tính 'action' của <form>
	 * isPending: Trạng thái đang gửi yêu cầu (thay cho submitting manually)
	 */
	const [state, formAction, isPending] = useActionState<
		LoginActionState,
		FormData
	>(loginAction, {
		success: false,
	});

	useEffect(() => {
		if (state?.success && state?.data) {
			login(state.data.accessToken, state.data.user);
			router.push('/');
		}
	}, [state, login, router]);

	return (
		<div className='mx-auto max-w-md px-4 py-12 sm:px-6 lg:py-16'>
			<div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8'>
				<h1 className='text-2xl font-bold text-slate-800'>Đăng nhập</h1>
				<p className='mt-1 text-slate-600'>Chào mừng trở lại BikeShop</p>

				{/* Lỗi được trả về trực tiếp từ Server qua 'state' */}
				{state?.error && (
					<p className='mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600'>
						{state.error}
					</p>
				)}

				<form action={formAction} className='mt-8 space-y-6'>
					<div>
						<label className='block text-sm font-medium text-slate-700'>
							Email
						</label>
						<input
							name='email'
							type='email'
							required
							className='mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
							placeholder='email@example.com'
						/>
					</div>
					<div>
						<label className='block text-sm font-medium text-slate-700'>
							Mật khẩu
						</label>
						<input
							name='password'
							type='password'
							required
							className='mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
							placeholder='••••••••'
						/>
						<div className='mt-2 text-right'>
							<Link
								href='#'
								className='text-sm text-emerald-600 hover:underline'
							>
								Quên mật khẩu?
							</Link>
						</div>
					</div>
					<button
						type='submit'
						disabled={isPending}
						className='w-full cursor-pointer rounded-xl bg-emerald-600 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50'
					>
						{isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
					</button>
				</form>

				<p className='mt-6 text-center text-sm text-slate-600'>
					Chưa có tài khoản?{' '}
					<Link
						href='/register'
						className='font-medium text-emerald-600 hover:underline'
					>
						Đăng ký
					</Link>
				</p>
			</div>
		</div>
	);
}
