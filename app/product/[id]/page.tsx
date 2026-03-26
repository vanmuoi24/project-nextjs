import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/ProductDetail';
import type { ProductResponse } from '@/lib/api';

const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

async function getProduct(id: string): Promise<ProductResponse | null> {
	console.log('Fetching at:', new Date().toISOString());

	try {
		const res = await fetch(`${apiURL}/products/${id}`, {
			cache: 'force-cache',
		});

		if (!res.ok) return null;
		return res.json();
	} catch (error) {
		console.error('Error fetching product:', error);
		return null;
	}
}
async function getRelatedProducts(
	product: ProductResponse,
): Promise<ProductResponse[]> {
	try {
		const res = await fetch(`${apiURL}/products`, {
			cache: 'force-cache',
		});
		if (!res.ok) return [];
		const all: ProductResponse[] = await res.json();

		const sameCategory = all.filter(
			(p) =>
				p.id !== product.id &&
				(p.categoryRelation?.id === product.categoryRelation?.id ||
					p.category === product.category),
		);
		return sameCategory.slice(0, 4);
	} catch (error) {
		console.error('Error fetching related products:', error);
		return [];
	}
}

export default async function ProductPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const resolvedParams = await params;
	const product = await getProduct(resolvedParams.id);

	if (!product) {
		notFound();
	}

	const relatedProducts = await getRelatedProducts(product);

	return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const resolvedParams = await params;
	const product = await getProduct(resolvedParams.id);
	if (!product) {
		return {
			title: 'Sản phẩm không tồn tại | BikeShop',
		};
	}

	return {
		title: `${product.name} | BikeShop`,
		description: product.description,
		openGraph: {
			title: product.name,
			description: product.description,
			images: product.imageUrl ? [product.imageUrl] : [],
		},
	};
}
