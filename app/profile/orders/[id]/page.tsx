'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const STATUS_LABEL: Record<string, string> = {
	pending: 'Chờ xử lý',
	confirmed: 'Đã xác nhận',
	processing: 'Đang xử lý',
	shipping: 'Đang giao',
	delivered: 'Đã giao',
	cancelled: 'Đã hủy',
};

function formatPrice(price: number) {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
		maximumFractionDigits: 0,
	}).format(price);
}

function formatDate(s: string) {
	return new Date(s).toLocaleDateString('vi-VN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}

export default function ProfileOrderDetailPage() {
	const params = useParams();
	const { user } = useAuth();
	const orderId = params.id as string;
	const [order, setOrder] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!user || !orderId) {
			setLoading(false);
			return;
		}

		// Giả lập tải từ localStorage
		const timer = setTimeout(() => {
			try {
				const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
				const foundOrder = savedOrders.find(
					(o: any) => o.id === orderId && o.userId === user.id,
				);

				if (foundOrder) {
					setOrder(foundOrder);
				} else {
					setError('Không tìm thấy đơn hàng hoặc bạn không có quyền xem.');
				}
			} catch (err) {
				setError('Đã xảy ra lỗi khi tải đơn hàng.');
			} finally {
				setLoading(false);
			}
		}, 500);

		return () => clearTimeout(timer);
	}, [user, orderId]);

	if (!user) {
		return (
			<div className='mx-auto max-w-3xl px-4 py-8 text-center'>
				<p className='text-slate-600'>Vui lòng đăng nhập.</p>
				<Link
					href='/login'
					className='mt-4 inline-block text-emerald-600 hover:underline'
				>
					Đăng nhập
				</Link>
			</div>
		);
	}

	if (loading) {
		return (
			<div className='mx-auto max-w-3xl px-4 py-8'>
				<div className='h-8 w-48 animate-pulse rounded bg-slate-200' />
				<div className='mt-6 h-64 animate-pulse rounded-xl bg-slate-100' />
			</div>
		);
	}

	if (error || !order) {
		return (
			<div className='mx-auto max-w-3xl px-4 py-8'>
				<Link href='/profile' className='text-emerald-600 hover:underline'>
					← Tài khoản
				</Link>
				<p className='mt-4 text-red-600 font-medium'>
					{error ?? 'Không tìm thấy đơn hàng.'}
				</p>
			</div>
		);
	}

	return (
		<div className='mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8'>
			<Link
				href='/profile'
				className='inline-flex items-center text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700'
			>
				<svg
					className='mr-2 h-4 w-4'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M10 19l-7-7m0 0l7-7m-7 7h18'
					/>
				</svg>
				Quay lại tài khoản
			</Link>

			<div className='mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end'>
				<div>
					<h1 className='text-3xl font-extrabold text-slate-900 leading-tight'>
						Đơn hàng #{order.id}
					</h1>
					<p className='mt-2 text-slate-500'>
						Đặt ngày {formatDate(order.createdAt)}
					</p>
				</div>
				<div>
					<span
						className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold shadow-sm ${
							order.status === 'delivered'
								? 'bg-emerald-50 text-emerald-700'
								: order.status === 'cancelled'
									? 'bg-red-50 text-red-700'
									: 'bg-amber-50 text-amber-700'
						}`}
					>
						<span
							className={`mr-2 h-2 w-2 rounded-full ${
								order.status === 'delivered'
									? 'bg-emerald-500'
									: order.status === 'cancelled'
										? 'bg-red-500'
										: 'bg-amber-500'
							}`}
						/>
						{STATUS_LABEL[order.status] ?? order.status}
					</span>
				</div>
			</div>

			<div className='mt-10 grid gap-8 lg:grid-cols-2'>
				<div className='space-y-8'>
					<div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
						<h2 className='text-lg font-bold text-slate-900 border-b border-slate-100 pb-4'>
							Thông tin giao hàng
						</h2>
						<div className='mt-4 flex gap-4'>
							<div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400'>
								<svg
									className='h-6 w-6'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
									/>
								</svg>
							</div>
							<div className='space-y-1'>
								<p className='text-sm font-bold text-slate-900'>
									{order.customerInfo.name}
								</p>
								<p className='text-sm text-slate-500'>
									{order.customerInfo.phone}
								</p>
								<p className='text-sm text-slate-500'>
									{order.customerInfo.email}
								</p>
							</div>
						</div>
						<div className='mt-6 flex gap-4 border-t border-slate-50 pt-6'>
							<div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400'>
								<svg
									className='h-6 w-6'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
									/>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
									/>
								</svg>
							</div>
							<div>
								<p className='text-sm leading-relaxed text-slate-600'>
									{order.customerInfo.address}, {order.customerInfo.district},{' '}
									{order.customerInfo.city}
								</p>
							</div>
						</div>
					</div>

					<div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
						<h2 className='text-lg font-bold text-slate-900 border-b border-slate-100 pb-4'>
							Thanh toán
						</h2>
						<div className='mt-4 flex items-center justify-between'>
							<span className='text-sm text-slate-500'>Phương thức</span>
							<span className='text-sm font-bold text-slate-900'>
								{order.paymentMethod === 'cod'
									? 'Thanh toán khi nhận hàng'
									: order.paymentMethod === 'bank'
										? 'Chuyển khoản ngân hàng'
										: 'Ví MoMo'}
							</span>
						</div>
					</div>
				</div>

				<div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
					<h2 className='text-lg font-bold text-slate-900 border-b border-slate-100 pb-4'>
						Tóm tắt đơn hàng
					</h2>
					<div className='mt-4 space-y-4'>
						{order.items.map((item: any) => (
							<div
								key={item.product.id}
								className='flex items-start justify-between gap-4'
							>
								<div className='flex-1'>
									<p className='text-sm font-bold text-slate-900'>
										{item.product.name}
									</p>
									<p className='text-xs text-slate-500'>
										SL: {item.quantity} × {formatPrice(item.product.price)}
									</p>
								</div>
								<p className='text-sm font-bold text-slate-900'>
									{formatPrice(item.product.price * item.quantity)}
								</p>
							</div>
						))}
					</div>

					<div className='mt-8 space-y-3 border-t border-slate-100 pt-6'>
						<div className='flex justify-between text-sm'>
							<span className='text-slate-500'>Tạm tính</span>
							<span className='font-medium text-slate-900'>
								{formatPrice(order.totalPrice)}
							</span>
						</div>
						<div className='flex justify-between text-sm'>
							<span className='text-slate-500'>Phí vận chuyển</span>
							<span className='font-medium text-slate-900'>
								{formatPrice(order.shipping)}
							</span>
						</div>
						<div className='flex justify-between border-t border-slate-100 pt-3'>
							<span className='text-base font-bold text-slate-900'>
								Tổng cộng
							</span>
							<span className='text-xl font-extrabold text-emerald-600'>
								{formatPrice(order.total)}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
