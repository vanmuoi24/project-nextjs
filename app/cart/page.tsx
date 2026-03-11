"use client";

import { useState } from "react";
import Link from "next/link";
import { products } from "@/data/products";
import CartItem from "@/components/CartItem";

// Demo cart: 2 items
const demoCart = [
  { productId: "1", quantity: 2 },
  { productId: "4", quantity: 1 },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CartPage() {
  const [items, setItems] = useState(demoCart);

  const cartProducts = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter(Boolean) as { product: (typeof products)[0]; quantity: number }[];

  const updateQuantity = (productId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const subtotal = cartProducts.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );
  const shipping = 50000;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Giỏ hàng</h1>
      <p className="mt-1 text-slate-600">Kiểm tra và chỉnh sửa giỏ hàng của bạn</p>

      {cartProducts.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
          <p className="text-slate-600">Giỏ hàng trống.</p>
          <Link
            href="/shop"
            className="mt-4 inline-block font-medium text-emerald-600 hover:underline"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="mt-8 gap-8 lg:grid lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cartProducts.map(({ product, quantity }) => (
              <CartItem
                key={product.id}
                product={product}
                quantity={quantity}
                onIncrease={() => updateQuantity(product.id, 1)}
                onDecrease={() => updateQuantity(product.id, -1)}
                onRemove={() => removeItem(product.id)}
              />
            ))}
          </div>

          <div className="mt-8 lg:mt-0">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-slate-800">Tóm tắt đơn hàng</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Tạm tính</dt>
                  <dd className="font-medium text-slate-800">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Phí vận chuyển</dt>
                  <dd className="font-medium text-slate-800">{formatPrice(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
                  <dt className="font-semibold text-slate-800">Tổng cộng</dt>
                  <dd className="font-bold text-emerald-600">{formatPrice(total)}</dd>
                </div>
              </dl>
              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-xl bg-emerald-600 py-3 text-center font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Thanh toán
              </Link>
              <Link
                href="/shop"
                className="mt-3 block text-center text-sm text-emerald-600 hover:underline"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
