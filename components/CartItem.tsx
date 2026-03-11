"use client";

import Image from "next/image";
import type { Product } from "@/data/products";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

interface CartItemProps {
  product: Product;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export default function CartItem({
  product,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  const subtotal = product.price * quantity;

  return (
    <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-28 sm:w-28">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="112px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-slate-800 line-clamp-2">{product.name}</h3>
        <p className="mt-1 text-sm text-slate-500">{product.brand}</p>
        <p className="mt-2 font-semibold text-emerald-600">
          {formatPrice(product.price)}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onDecrease}
              className="flex h-9 w-9 items-center justify-center text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-800"
              aria-label="Giảm số lượng"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="min-w-[2rem] text-center text-sm font-medium">
              {quantity}
            </span>
            <button
              type="button"
              onClick={onIncrease}
              className="flex h-9 w-9 items-center justify-center text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-800"
              aria-label="Tăng số lượng"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="text-sm text-red-600 transition-colors hover:text-red-700 hover:underline"
          >
            Xóa
          </button>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-semibold text-slate-800">{formatPrice(subtotal)}</p>
      </div>
    </div>
  );
}
