'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { productsApi, categoriesApi } from '@/lib/api';
import type { CreateProductDto } from '@/lib/api';
import type { CategoryResponse } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api';

export default function AdminNewProductPage() {
	const router = useRouter();
	const [categories, setCategories] = useState<CategoryResponse[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [form, setForm] = useState<CreateProductDto>({
		name: '',
		description: '',
		price: 0,
		quantity: 0,
		imageUrl: '',
		categoryId: undefined,
	});

	useEffect(() => {
		categoriesApi.getAll().then(({ data }) => setCategories(data ?? []));
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await productsApi.create({
				...form,
				categoryId: form.categoryId || undefined,
			});
			router.push('/admin/products');
		} catch (e) {
			setError(getApiErrorMessage(e));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='max-w-2xl space-y-6'>
			<div className='flex items-center gap-4'>
				<Link
					href='/admin/products'
					className='text-slate-500 hover:text-slate-700'
				>
					← Sản phẩm
				</Link>
				<h1 className='text-2xl font-bold text-slate-800'>Thêm sản phẩm</h1>
			</div>

			{error && (
				<div className='rounded-lg bg-red-50 p-4 text-sm text-red-700'>
					{error}
				</div>
			)}

			<form
				onSubmit={handleSubmit}
				className='space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm'
			>
				<div>
					<label className='block text-sm font-medium text-slate-700'>
						Tên *
					</label>
					<input
						type='text'
						required
						value={form.name}
						onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
						className='mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium text-slate-700'>
						Mô tả *
					</label>
					<textarea
						required
						rows={3}
						value={form.description}
						onChange={(e) =>
							setForm((f) => ({ ...f, description: e.target.value }))
						}
						className='mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
					/>
				</div>
				<div className='grid gap-4 sm:grid-cols-2'>
					<div>
						<label className='block text-sm font-medium text-slate-700'>
							Giá (VNĐ) *
						</label>
						<input
							type='number'
							required
							min={0}
							value={form.price || ''}
							onChange={(e) =>
								setForm((f) => ({ ...f, price: Number(e.target.value) || 0 }))
							}
							className='mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
						/>
					</div>
					<div>
						<label className='block text-sm font-medium text-slate-700'>
							Số lượng *
						</label>
						<input
							type='number'
							required
							min={0}
							value={form.quantity ?? ''}
							onChange={(e) =>
								setForm((f) => ({
									...f,
									quantity: Number(e.target.value) || 0,
								}))
							}
							className='mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
						/>
					</div>
				</div>
				<div>
					<label className='block text-sm font-medium text-slate-700'>
						URL ảnh *
					</label>
					<input
						type='url'
						required
						value={form.imageUrl}
						onChange={(e) =>
							setForm((f) => ({ ...f, imageUrl: e.target.value }))
						}
						className='mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
					/>
				</div>
				<div>
					<label className='block text-sm font-medium text-slate-700'>
						Danh mục
					</label>
					<select
						value={form.categoryId ?? ''}
						onChange={(e) =>
							setForm((f) => ({
								...f,
								categoryId: e.target.value ? Number(e.target.value) : undefined,
							}))
						}
						className='mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
					>
						<option value=''>— Chọn —</option>
						{categories.map((c) => (
							<option key={c.id} value={c.id}>
								{c.name}
							</option>
						))}
					</select>
				</div>
				<div className='flex gap-3 pt-2'>
					<button
						type='submit'
						disabled={loading}
						className='rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50'
					>
						{loading ? 'Đang lưu...' : 'Lưu'}
					</button>
					<Link
						href='/admin/products'
						className='rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50'
					>
						Hủy
					</Link>
				</div>
			</form>
		</div>
	);
}
