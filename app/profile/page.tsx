'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

function formatPrice(price: number) {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
		maximumFractionDigits: 0,
	}).format(price);
}

function formatDate(s?: string) {
	if (!s) return '—';
	return new Date(s).toLocaleDateString('vi-VN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});
}

export default function ProfilePage() {
	const { user, loading } = useAuth();

	const [activeTab, setActiveTab] = useState<'info' | 'orders'>('info');
	const [orders, setOrders] = useState<any[]>([]);
	const [ordersLoading, setOrdersLoading] = useState(false);

	useEffect(() => {
		if (!user) return;

		setOrdersLoading(true);

		// Giả lập độ trễ tải dữ liệu
		const timer = setTimeout(() => {
			try {
				const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
				// Lọc đơn hàng theo userId của người dùng hiện tại
				const userOrders = savedOrders.filter((o: any) => o.userId === user.id);
				setOrders(userOrders);
			} catch (error) {
				console.error('Error loading orders:', error);
				setOrders([]);
			} finally {
				setOrdersLoading(false);
			}
		}, 500);

		return () => clearTimeout(timer);
	}, [user]);

	const isAdmin = user?.role?.toLowerCase() === 'admin'; // ✅ fix role

	if (loading) {
		return (
			<div className='mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8'>
				<div className='h-8 w-64 animate-pulse rounded bg-slate-200' />
				<div className='mt-6 h-96 animate-pulse rounded-2xl bg-slate-100' />
			</div>
		);
	}

	if (!user) {
		return (
			<div className='mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 text-center'>
				<h1 className='text-2xl font-bold text-slate-800'>Tài khoản</h1>
				<p className='mt-4 text-slate-600'>
					Vui lòng đăng nhập để xem thông tin tài khoản.
				</p>
				<Link
					href='/login'
					className='mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700'
				>
					Đăng nhập
				</Link>
			</div>
		);
	}

	return (
		<div className='mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8'>
			<h1 className='text-2xl font-bold text-slate-800 sm:text-3xl'>
				Tài khoản
			</h1>
			<p className='mt-1 text-slate-600'>Xin chào, {user.name || user.email}</p>

			<div className='mt-8 flex gap-2 border-b border-slate-200'>
				<button
					type='button'
					onClick={() => setActiveTab('info')}
					className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
						activeTab === 'info'
							? 'border-emerald-600 text-emerald-600'
							: 'border-transparent text-slate-500 hover:text-slate-700'
					}`}
				>
					Thông tin cá nhân
				</button>
				<button
					type='button'
					onClick={() => setActiveTab('orders')}
					className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
						activeTab === 'orders'
							? 'border-emerald-600 text-emerald-600'
							: 'border-transparent text-slate-500 hover:text-slate-700'
					}`}
				>
					Đơn hàng đã mua
				</button>
			</div>

			{activeTab === 'info' && (
				<div className='mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
					<h2 className='font-semibold text-slate-800'>Thông tin người dùng</h2>
					<dl className='mt-6 space-y-4'>
						<div>
							<dt className='text-sm font-medium text-slate-500'>Họ và tên</dt>
							<dd className='mt-1 text-slate-800'>{user.name || '—'}</dd>
						</div>
						<div>
							<dt className='text-sm font-medium text-slate-500'>Email</dt>
							<dd className='mt-1 text-slate-800'>{user.email}</dd>
						</div>
						<div>
							<dt className='text-sm font-medium text-slate-500'>Vai trò</dt>
							<dd className='mt-1 text-slate-800'>
								{isAdmin ? 'Quản trị viên' : 'Khách hàng'}
							</dd>
						</div>
						<div>
							<dt className='text-sm font-medium text-slate-500'>
								Tham gia từ
							</dt>
							<dd className='mt-1 text-slate-800'>
								{formatDate(user.createdAt)}
							</dd>
						</div>
					</dl>
				</div>
			)}

			{activeTab === 'orders' && (
				<div className='mt-8 space-y-4'>
					{ordersLoading ? (
						<div className='rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500'>
							Đang tải đơn hàng...
						</div>
					) : orders.length === 0 ? (
						<div className='rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500'>
							Bạn chưa có đơn hàng nào.
						</div>
					) : (
						orders.map((order) => (
							<div
								key={order.id}
								className='flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6'
							>
								<div>
									<p className='font-semibold text-slate-800'>
										Đơn hàng #{order.id}
									</p>
									<p className='text-sm text-slate-500'>
										{formatDate(order.createdAt)}
									</p>
								</div>

								<div className='flex items-center gap-4'>
									<span
										className={`rounded-full px-3 py-1 text-sm font-medium ${
											order.status === 'delivered'
												? 'bg-emerald-50 text-emerald-700'
												: order.status === 'cancelled'
													? 'bg-red-50 text-red-700'
													: 'bg-amber-50 text-amber-700'
										}`}
									>
										{order.status === 'pending'
											? 'Chờ xử lý'
											: order.status === 'confirmed'
												? 'Đã xác nhận'
												: order.status === 'processing'
													? 'Đang xử lý'
													: order.status === 'shipping'
														? 'Đang giao'
														: order.status === 'delivered'
															? 'Đã giao'
															: 'Đã hủy'}
									</span>

									<span className='font-semibold text-emerald-600'>
										{formatPrice(order.total)}
									</span>
								</div>

								<Link
									href={`/profile/orders/${order.id}`}
									className='text-sm font-medium text-emerald-600 hover:underline'
								>
									Xem chi tiết
								</Link>
							</div>
						))
					)}
				</div>
			)}
		</div>
	);
}
