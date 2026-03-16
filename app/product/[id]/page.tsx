"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { productsApi } from "@/lib/api";
import type { ProductResponse } from "@/lib/api";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const idNum = Number(id);

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [related, setRelated] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || Number.isNaN(idNum)) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await productsApi.getById(idNum);
        setProduct(data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, idNum]);

  useEffect(() => {
    if (!product) return;
    const fetchRelated = async () => {
      try {
        const { data: list } = await productsApi.getAll();
        const sameCategory = (list ?? []).filter(
          (p) =>
            p.id !== product.id &&
            (p.categoryRelation?.id === product.categoryRelation?.id ||
              p.category === product.category)
        );
        setRelated(sameCategory.slice(0, 4));
      } catch {
        setRelated([]);
      }
    };
    fetchRelated();
  }, [product]);

  const addToCart = () => {
    router.push("/cart");
  };

  const categoryName =
    product?.categoryRelation?.name ?? product?.category ?? "";

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 h-5 w-48 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-slate-200" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-6 w-1/4 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-slate-800">Không tìm thấy sản phẩm</h2>
        <Link href="/shop" className="mt-4 inline-block text-emerald-600 hover:underline">
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const galleryImages = product.imageUrl ? [product.imageUrl] : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm text-slate-500">
        <Link href="/" className="hover:text-emerald-600">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-emerald-600">Cửa hàng</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={galleryImages} alt={product.name} />

        <div>
          {categoryName && (
            <p className="text-sm font-medium text-emerald-600">{categoryName}</p>
          )}
          <h1 className="mt-2 text-2xl font-bold text-slate-800 sm:text-3xl">{product.name}</h1>
          <p className="mt-2 text-lg font-semibold text-emerald-600">
            {formatPrice(product.price)}
          </p>
          <p className="mt-4 text-slate-600">{product.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center text-slate-600 hover:bg-slate-200"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="min-w-[2.5rem] text-center font-medium">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-10 w-10 items-center justify-center text-slate-600 hover:bg-slate-200"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <button
              type="button"
              onClick={addToCart}
              className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Thêm vào giỏ hàng
            </button>
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <h3 className="font-semibold text-slate-800">Thông tin</h3>
            <dl className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <dt className="text-slate-500">Số lượng có sẵn</dt>
                <dd className="font-medium text-slate-800">{product.quantity}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-slate-800">Sản phẩm liên quan</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
