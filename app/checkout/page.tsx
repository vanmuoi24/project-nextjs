'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { createOrderAction } from './actions';

function formatPrice(price: number) {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
		maximumFractionDigits: 0,
	}).format(price);
}

export default function CheckoutPage() {
	const router = useRouter();
	const { user, loading: authLoading } = useAuth();
	const { items, totalPrice, clearCart } = useCart();
	const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank' | 'momo'>(
		'cod',
	);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [orderCompleted, setOrderCompleted] = useState(false);
	const [lastOrder, setLastOrder] = useState<any>(null);
	const [showToast, setShowToast] = useState(false);

	// Form states
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		address: '',
		city: '',
		district: '',
	});

	// Pre-fill user info once loaded
	useEffect(() => {
		if (user) {
			setFormData((prev) => ({
				...prev,
				name: user.name || '',
				email: user.email || '',
			}));
		}
	}, [user]);

	// Redirect to login if not authenticated
	useEffect(() => {
		if (!authLoading && !user && !orderCompleted) {
			router.push('/login?redirect=/checkout');
		}
	}, [user, authLoading, router, orderCompleted]);

	if (authLoading || (!user && !orderCompleted)) {
		return (
			<div className='flex min-h-[400px] items-center justify-center'>
				<div className='h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent'></div>
			</div>
		);
	}

	const shipping = 50000;
	const total = totalPrice + shipping;

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		console.log('id, val:', id, value);
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (items.length === 0) return;
		setIsSubmitting(true);

		try {
			// Gọi Server Action
			const result = await createOrderAction({
				userId: user?.id,
				customerInfo: formData,
				items: items,
				totalPrice,
				shipping,
				total,
				paymentMethod,
			});
			if (!result.success) {
				alert(result.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
				return;
			}
			const newOrder = result.order;
			const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
			localStorage.setItem(
				'orders',
				JSON.stringify([newOrder, ...savedOrders]),
			);

			setLastOrder(newOrder);
			setOrderCompleted(true);
			setShowToast(true);
			clearCart();
			setTimeout(() => setShowToast(false), 5000);
		} catch (error) {
			console.error('Lỗi đặt hàng:', error);
			alert('Có lỗi xảy ra khi kết nối tới máy chủ. Vui lòng thử lại.');
		} finally {
			setIsSubmitting(false);
		}
	};

	if (orderCompleted && lastOrder) {
		return (
			<div className='mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8'>
				<div className='mb-8 flex justify-center'>
					<div className='flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-xl shadow-emerald-100/50'>
						<svg
							className='h-10 w-10'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={3}
								d='M5 13l4 4L19 7'
							/>
						</svg>
					</div>
				</div>

				<h1 className='text-3xl font-extrabold text-slate-900'>
					Đặt hàng thành công!
				</h1>
				<p className='mt-4 text-lg text-slate-600'>
					Cảm ơn bạn đã tin tưởng. Mã đơn hàng của bạn là{' '}
					<span className='font-bold text-emerald-600'>{lastOrder.id}</span>.
				</p>

				<div className='mt-12 rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm'>
					<h2 className='text-xl font-bold text-slate-900'>
						Chi tiết đơn hàng
					</h2>

					<div className='mt-6 space-y-4'>
						{lastOrder.items.map((item: any) => (
							<div
								key={item.product.id}
								className='flex justify-between text-sm'
							>
								<span className='text-slate-600'>
									{item.product.name} × {item.quantity}
								</span>
								<span className='font-medium text-slate-900'>
									{formatPrice(item.product.price * item.quantity)}
								</span>
							</div>
						))}
						<div className='border-t border-slate-100 pt-4 flex justify-between font-bold text-slate-900'>
							<span>Tổng thanh toán</span>
							<span className='text-xl text-emerald-600'>
								{formatPrice(lastOrder.total)}
							</span>
						</div>
					</div>

					<div className='mt-8 grid gap-6 sm:grid-cols-2'>
						<div>
							<h3 className='text-xs font-bold uppercase tracking-wider text-slate-400'>
								Giao đến
							</h3>
							<p className='mt-1 text-sm font-medium text-slate-800'>
								{lastOrder.customerInfo.name}
							</p>
							<p className='text-xs text-slate-500'>
								{lastOrder.customerInfo.phone}
							</p>
							<p className='mt-1 text-xs text-slate-500'>
								{lastOrder.customerInfo.address}, {lastOrder.customerInfo.city}
							</p>
						</div>
						<div>
							<h3 className='text-xs font-bold uppercase tracking-wider text-slate-400'>
								Thanh toán
							</h3>
							<p className='mt-1 text-sm font-medium text-slate-800'>
								{lastOrder.paymentMethod === 'cod'
									? 'Thanh toán khi nhận hàng'
									: lastOrder.paymentMethod === 'bank'
										? 'Chuyển khoản ngân hàng'
										: 'Ví MoMo'}
							</p>
						</div>
					</div>
				</div>

				<div className='mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
					<Link
						href='/shop'
						className='w-full cursor-pointer rounded-xl bg-emerald-600 px-8 py-4 font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-700 hover:scale-[1.02] sm:w-auto'
					>
						Tiếp tục mua sắm
					</Link>
					<Link
						href='/'
						className='text-sm font-bold text-slate-500 hover:text-emerald-600'
					>
						Về trang chủ
					</Link>
				</div>

				{/* Success Toast */}
				{showToast && (
					<div className='fixed bottom-8 right-8 z-[100] flex animate-in fade-in slide-in-from-bottom-10 items-center gap-4 rounded-2xl border-2 border-emerald-500/20 bg-white/95 p-5 shadow-[0_20px_50px_rgba(16,185,129,0.3)] backdrop-blur-xl transition-all duration-500'>
						<div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/40'>
							<svg
								className='h-6 w-6'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={3}
									d='M5 13l4 4L19 7'
								/>
							</svg>
						</div>
						<div>
							<p className='text-lg font-extrabold text-slate-900'>
								Xác nhận đơn hàng!
							</p>
							<p className='text-sm font-medium text-slate-500'>
								Hệ thống đang chuẩn bị giao cho bạn.
							</p>
						</div>
						<button
							onClick={() => setShowToast(false)}
							className='ml-4 cursor-pointer rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
						>
							<svg
								className='h-4 w-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M6 18L18 6M6 6l12 12'
								/>
							</svg>
						</button>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
			<h1 className='text-2xl font-bold text-slate-800 sm:text-3xl'>
				Thanh toán
			</h1>
			<p className='mt-1 text-slate-600'>
				Điền thông tin giao hàng và thanh toán
			</p>

			<form
				onSubmit={handleSubmit}
				className='mt-8 gap-8 lg:grid lg:grid-cols-3'
			>
				<div className='space-y-8 lg:col-span-2'>
					<div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
						<h2 className='font-semibold text-slate-800'>
							Thông tin khách hàng
						</h2>
						<div className='mt-4 grid gap-4 sm:grid-cols-2'>
							<div>
								<label
									htmlFor='name'
									className='block text-sm font-medium text-slate-700'
								>
									Họ và tên
								</label>
								<input
									id='name'
									type='text'
									required
									value={formData.name}
									onChange={handleInputChange}
									className='mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
									placeholder='Nguyễn Văn A'
								/>
							</div>
							<div>
								<label
									htmlFor='phone'
									className='block text-sm font-medium text-slate-700'
								>
									Số điện thoại
								</label>
								<input
									id='phone'
									type='tel'
									required
									value={formData.phone}
									onChange={handleInputChange}
									className='mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
									placeholder='0901234567'
								/>
							</div>
						</div>
						<div className='mt-4'>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-slate-700'
							>
								Email
							</label>
							<input
								id='email'
								type='email'
								required
								value={formData.email}
								onChange={handleInputChange}
								className='mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
								placeholder='email@example.com'
							/>
						</div>
					</div>

					<div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
						<h2 className='font-semibold text-slate-800'>Địa chỉ giao hàng</h2>
						<div className='mt-4'>
							<label
								htmlFor='address'
								className='block text-sm font-medium text-slate-700'
							>
								Địa chỉ
							</label>
							<input
								id='address'
								type='text'
								required
								value={formData.address}
								onChange={handleInputChange}
								className='mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
								placeholder='Số nhà, đường, phường/xã, quận/huyện'
							/>
						</div>
						<div className='mt-4 grid gap-4 sm:grid-cols-2'>
							<div>
								<label
									htmlFor='city'
									className='block text-sm font-medium text-slate-700'
								>
									Tỉnh/Thành phố
								</label>
								<input
									id='city'
									type='text'
									required
									value={formData.city}
									onChange={handleInputChange}
									className='mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
									placeholder='TP. Hồ Chí Minh'
								/>
							</div>
							<div>
								<label
									htmlFor='district'
									className='block text-sm font-medium text-slate-700'
								>
									Quận/Huyện
								</label>
								<input
									id='district'
									type='text'
									required
									value={formData.district}
									onChange={handleInputChange}
									className='mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
									placeholder='Quận 1'
								/>
							</div>
						</div>
					</div>

					<div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
						<h2 className='font-semibold text-slate-800'>
							Phương thức thanh toán
						</h2>
						<div className='mt-4 space-y-3'>
							<label className='flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/50'>
								<input
									type='radio'
									name='payment'
									value='cod'
									checked={paymentMethod === 'cod'}
									onChange={() => setPaymentMethod('cod')}
									className='h-4 w-4 text-emerald-600'
								/>
								<span className='font-medium'>
									Thanh toán khi nhận hàng (COD)
								</span>
							</label>
							<label className='flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/50'>
								<input
									type='radio'
									name='payment'
									value='bank'
									checked={paymentMethod === 'bank'}
									onChange={() => setPaymentMethod('bank')}
									className='h-4 w-4 text-emerald-600'
								/>
								<span className='font-medium'>Chuyển khoản ngân hàng</span>
							</label>
							<label className='flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/50'>
								<input
									type='radio'
									name='payment'
									value='momo'
									checked={paymentMethod === 'momo'}
									onChange={() => setPaymentMethod('momo')}
									className='h-4 w-4 text-emerald-600'
								/>
								<span className='font-medium'>Ví MoMo</span>
							</label>
						</div>
					</div>
				</div>

				<div className='mt-8 lg:mt-0'>
					<div className='sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
						<h2 className='font-semibold text-slate-800'>Tóm tắt đơn hàng</h2>
						<ul className='mt-4 space-y-3 border-b border-slate-200 pb-4'>
							{items.map(({ product, quantity }) => (
								<li
									key={product.id}
									className='flex items-start justify-between gap-x-8 text-sm'
								>
									<span className='flex-1 text-slate-600'>
										{product.name} × {quantity}
									</span>
									<span className='shrink-0 font-medium text-slate-800'>
										{formatPrice(product.price * quantity)}
									</span>
								</li>
							))}
						</ul>
						<dl className='mt-4 space-y-2 text-sm'>
							<div className='flex justify-between'>
								<dt className='text-slate-500'>Tạm tính</dt>
								<dd className='font-medium text-slate-800'>
									{formatPrice(totalPrice)}
								</dd>
							</div>
							<div className='flex justify-between'>
								<dt className='text-slate-500'>Phí vận chuyển</dt>
								<dd className='font-medium text-slate-800'>
									{formatPrice(shipping)}
								</dd>
							</div>
							<div className='flex justify-between border-t border-slate-200 pt-3 text-base'>
								<dt className='font-semibold text-slate-800'>Tổng cộng</dt>
								<dd className='font-bold text-emerald-600'>
									{formatPrice(total)}
								</dd>
							</div>
						</dl>
						<button
							type='submit'
							disabled={isSubmitting || items.length === 0}
							className='mt-6 w-full cursor-pointer rounded-xl bg-emerald-600 py-3 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400'
						>
							{isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
						</button>
						<Link
							href='/cart'
							className='mt-3 block text-center text-sm text-emerald-600 hover:underline'
						>
							Quay lại giỏ hàng
						</Link>
					</div>
				</div>
			</form>
		</div>
	);
}
