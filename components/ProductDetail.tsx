'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ProductResponse } from '@/lib/api';
import ProductGallery from '@/components/ProductGallery';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/contexts/CartContext';

function formatPrice(price: number) {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
		maximumFractionDigits: 0,
	}).format(price);
}

interface ProductDetailProps {
	product: ProductResponse;
	relatedProducts: ProductResponse[];
}

export default function ProductDetail({
	product,
	relatedProducts,
}: ProductDetailProps) {
	const { addItem } = useCart();
	const [quantity, setQuantity] = useState(1);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		let timeout: NodeJS.Timeout;
		if (success) {
			timeout = setTimeout(() => setSuccess(false), 3000);
		}
		return () => clearTimeout(timeout);
	}, [success]);

	const addToCart = () => {
		addItem(product, quantity);
		setSuccess(true);
	};

	const categoryName =
		product?.categoryRelation?.name ?? product?.category ?? '';
	const galleryImages = product.imageUrl ? [product.imageUrl] : [];

	return (
		<div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
			<nav className='mb-8 text-sm text-slate-500'>
				<Link href='/' className='hover:text-emerald-600'>
					Trang chủ
				</Link>
				<span className='mx-2'>/</span>
				<Link href='/shop' className='hover:text-emerald-600'>
					Cửa hàng
				</Link>
				<span className='mx-2'>/</span>
				<span className='text-slate-800'>{product.name}</span>
			</nav>

			<div className='grid gap-8 lg:grid-cols-2'>
				<ProductGallery images={galleryImages} alt={product.name} />

				<div>
					{categoryName && (
						<p className='text-sm font-medium text-emerald-600'>
							{categoryName}
						</p>
					)}
					<h1 className='mt-2 text-2xl font-bold text-slate-800 sm:text-3xl'>
						{product.name}
					</h1>
					<p className='mt-2 text-lg font-semibold text-emerald-600'>
						{formatPrice(product.price)}
					</p>
					<p className='mt-4 text-slate-600'>{product.description}</p>

					<div className='mt-6 flex flex-wrap items-center gap-4'>
						<div className='flex items-center rounded-lg border border-slate-200 bg-slate-50'>
							<button
								type='button'
								onClick={() => setQuantity((q) => Math.max(1, q - 1))}
								className='flex h-10 w-10 cursor-pointer items-center justify-center text-slate-600 hover:bg-slate-200'
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
										d='M20 12H4'
									/>
								</svg>
							</button>
							<span className='min-w-[2.5rem] text-center font-medium'>
								{quantity}
							</span>
							<button
								type='button'
								onClick={() => setQuantity((q) => q + 1)}
								className='flex h-10 w-10 cursor-pointer items-center justify-center text-slate-600 hover:bg-slate-200'
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
										d='M12 4v16m8-8H4'
									/>
								</svg>
							</button>
						</div>
						<button
							type='button'
							onClick={addToCart}
							className='cursor-pointer rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700'
						>
							Thêm vào giỏ hàng
						</button>
					</div>

					<div className='mt-8 rounded-xl border border-slate-200 bg-slate-50/50 p-4'>
						<h3 className='font-semibold text-slate-800'>Thông tin</h3>
						<dl className='mt-3 space-y-2'>
							<div className='flex justify-between text-sm'>
								<dt className='text-slate-500'>Số lượng có sẵn</dt>
								<dd className='font-medium text-slate-800'>
									{product.quantity}
								</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>

			{relatedProducts.length > 0 && (
				<section className='mt-16'>
					<h2 className='text-xl font-bold text-slate-800'>
						Sản phẩm liên quan
					</h2>
					<div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
						{relatedProducts.map((p) => (
							<ProductCard key={p.id} product={p} />
						))}
					</div>
				</section>
			)}

			{/* Toast Success */}
			{success && (
				<div className='fixed bottom-6 right-6 z-[100] flex min-w-[360px] transform items-center gap-4 overflow-hidden rounded-2xl border-2 border-emerald-500/20 bg-white/90 p-5 shadow-[0_20px_50px_rgba(16,185,129,0.2)] backdrop-blur-xl transition-all duration-500 animate-in fade-in slide-in-from-right-10'>
					<div className='absolute -left-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl' />
					<div className='relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/40'>
						<svg
							className='h-8 w-8'
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
					<div className='relative flex-1'>
						<h3 className='text-base font-extrabold text-slate-900'>
							Tuyệt vời!
						</h3>
						<p className='mt-0.5 text-sm font-medium text-slate-600 line-clamp-1'>
							Đã thêm {product.name} x {quantity}
						</p>
						<div className='mt-2 flex items-center gap-3'>
							<Link
								href='/cart'
								className='text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline'
							>
								Xem giỏ hàng ngay
							</Link>
						</div>
					</div>
					<button
						type='button'
						onClick={() => setSuccess(false)}
						className='relative -top-6 ml-2 cursor-pointer rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600'
					>
						<svg
							className='h-5 w-5'
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
					<div
						className='absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-[3000ms] ease-linear group-data-[state=open]:w-full'
						style={{ width: '100%', animation: 'shrink 3s linear forwards' }}
					/>
					<style jsx>{`
						@keyframes shrink {
							from {
								width: 100%;
							}
							to {
								width: 0%;
							}
						}
					`}</style>
				</div>
			)}
		</div>
	);
}
