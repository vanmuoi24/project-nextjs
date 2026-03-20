'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { productsApi } from '@/lib/api';
import type { ProductResponse } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import SearchBar from '@/components/SearchBar';

const ITEMS_PER_PAGE = 8;
const priceRangeMap: Record<string, { min: number; max: number }> = {
	under5: { min: 0, max: 5_000_000 },
	'5-15': { min: 5_000_000, max: 15_000_000 },
	'15-30': { min: 15_000_000, max: 30_000_000 },
	over30: { min: 30_000_000, max: Infinity },
};

/** Brand hiển thị trên card = categoryRelation?.name hoặc category */
function productBrand(p: ProductResponse): string {
	return p.categoryRelation?.name ?? p.category ?? '';
}

export default function ShopContent() {
	const searchParams = useSearchParams();
	const q = searchParams.get('q') ?? '';
	const categoryFromUrl = searchParams.get('category');

	const [productsList, setProductsList] = useState<ProductResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState(q);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		categoryFromUrl,
	);
	const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
		null,
	);
	const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const { data } = await productsApi.getAll();
				setProductsList(data ?? []);
			} catch {
				setProductsList([]);
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, []);

	useEffect(() => {
		setSearchQuery(q);
	}, [q]);

	const filteredProducts = useMemo(() => {
		let list = [...productsList];

		if (searchQuery.trim()) {
			const lower = searchQuery.trim().toLowerCase();
			list = list.filter(
				(p) =>
					p.name.toLowerCase().includes(lower) ||
					productBrand(p).toLowerCase().includes(lower) ||
					p.description.toLowerCase().includes(lower),
			);
		}

		if (selectedCategory) {
			list = list.filter(
				(p) =>
					p.category === selectedCategory ||
					p.categoryRelation?.slug === selectedCategory ||
					String(p.categoryRelation?.id) === selectedCategory,
			);
		}

		if (selectedPriceRange && selectedPriceRange !== 'all') {
			const range = priceRangeMap[selectedPriceRange];
			if (range) {
				list = list.filter((p) => p.price >= range.min && p.price < range.max);
			}
		}

		if (selectedBrands.length > 0) {
			list = list.filter((p) => selectedBrands.includes(productBrand(p)));
		}

		return list;
	}, [
		productsList,
		searchQuery,
		selectedCategory,
		selectedPriceRange,
		selectedBrands,
	]);

	const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
	const paginatedProducts = useMemo(() => {
		const start = (currentPage - 1) * ITEMS_PER_PAGE;
		return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
	}, [filteredProducts, currentPage]);

	const handleBrandToggle = useCallback((brand: string) => {
		setSelectedBrands((prev) =>
			prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
		);
		setCurrentPage(1);
	}, []);

	return (
		<div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
			<h1 className='text-2xl font-bold text-slate-800 sm:text-3xl'>
				Cửa hàng
			</h1>
			<p className='mt-1 text-slate-600'>Tìm xe đạp phù hợp với bạn</p>

			<div className='mt-6 lg:hidden'>
				<SearchBar initialQuery={searchQuery} />
			</div>

			<div className='mt-8 flex flex-col gap-8 lg:flex-row'>
				<FilterSidebar
					selectedCategory={selectedCategory}
					selectedPriceRange={selectedPriceRange}
					selectedBrands={selectedBrands}
					onCategoryChange={(id) => {
						setSelectedCategory(id);
						setCurrentPage(1);
					}}
					onPriceRangeChange={(id) => {
						setSelectedPriceRange(id);
						setCurrentPage(1);
					}}
					onBrandToggle={handleBrandToggle}
				/>

				<div className='min-w-0 flex-1'>
					<div className='hidden lg:block'>
						<SearchBar initialQuery={searchQuery} />
					</div>
					<p className='mt-4 text-sm text-slate-500'>
						Hiển thị {paginatedProducts.length} / {filteredProducts.length} sản
						phẩm
					</p>

					{loading ? (
						<div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'>
							{Array.from({ length: 6 }).map((_, i) => (
								<div
									key={i}
									className='aspect-[4/3] animate-pulse rounded-2xl bg-slate-200'
								/>
							))}
						</div>
					) : paginatedProducts.length === 0 ? (
						<div className='mt-12 rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center'>
							<p className='text-slate-600'>Không tìm thấy sản phẩm phù hợp.</p>
							<p className='mt-1 text-sm text-slate-500'>
								Thử thay đổi bộ lọc hoặc từ khóa.
							</p>
						</div>
					) : (
						<>
							<div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'>
								{paginatedProducts.map((product) => (
									<ProductCard key={product.id} product={product} />
								))}
							</div>

							{totalPages > 1 && (
								<div className='mt-10 flex justify-center gap-2'>
									<button
										type='button'
										onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
										disabled={currentPage === 1}
										className='rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50'
									>
										Trước
									</button>
									{Array.from({ length: totalPages }, (_, i) => i + 1).map(
										(page) => (
											<button
												key={page}
												type='button'
												onClick={() => setCurrentPage(page)}
												className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
													currentPage === page
														? 'bg-emerald-600 text-white'
														: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
												}`}
											>
												{page}
											</button>
										),
									)}
									<button
										type='button'
										onClick={() =>
											setCurrentPage((p) => Math.min(totalPages, p + 1))
										}
										disabled={currentPage === totalPages}
										className='rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50'
									>
										Sau
									</button>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
