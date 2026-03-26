'use client';

import { categories } from '@/data/categories';
import { productsApi } from '@/lib/api';
import type { ProductResponse } from '@/lib/api';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import { useEffect, useState } from 'react';

export default function Home() {
	const [featured, setFeatured] = useState<ProductResponse[]>([]);
	const [bestSellers, setBestSellers] = useState<ProductResponse[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const featuredRes = await productsApi.getAll({ limit: 4 });
				const bestSellerRes = await productsApi.getAll({ limit: 4 });

				setFeatured(featuredRes.data);
				setBestSellers(bestSellerRes.data);
			} catch (error) {
				console.error('API error:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return (
			<div className='p-10 text-center text-slate-600'>
				Đang tải sản phẩm...
			</div>
		);
	}

	return (
		<div>
			{/* Categories */}
			<section className='mx-auto max-w-7xl px-4 py-12'>
				<h2 className='text-2xl font-bold text-slate-800'>Danh mục xe đạp</h2>

				<div className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
					{categories.map((cat) => (
						<CategoryCard key={cat.id} category={cat} />
					))}
				</div>
			</section>

			{/* Featured */}
			<section className='bg-slate-50 py-12'>
				<div className='mx-auto max-w-7xl px-4'>
					<h2 className='text-2xl font-bold text-slate-800'>
						Sản phẩm nổi bật
					</h2>

					<div className='mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
						{featured.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</div>
			</section>

			{/* Best sellers */}
			<section className='mx-auto max-w-7xl px-4 py-12'>
				<h2 className='text-2xl font-bold text-slate-800'>Bán chạy nhất</h2>

				<div className='mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
					{bestSellers.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</section>
		</div>
	);
}
