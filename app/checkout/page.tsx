"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CheckoutPage() {
  const { items } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank" | "momo">("cod");

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0
  );
  const shipping = items.length > 0 ? 50000 : 0;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Thanh toán</h1>
      <p className="mt-1 text-slate-600">Điền thông tin giao hàng và thanh toán</p>

      <form className="mt-8 gap-8 lg:grid lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* ... existing fields ... */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-800">Thông tin khách hàng</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Họ và tên
                </label>
                <input
                  id="name"
                  type="text"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="0901234567"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-800">Địa chỉ giao hàng</h2>
            <div className="mt-4">
              <label htmlFor="address" className="block text-sm font-medium text-slate-700">
                Địa chỉ
              </label>
              <input
                id="address"
                type="text"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Số nhà, đường, phường/xã, quận/huyện"
              />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-slate-700">
                  Tỉnh/Thành phố
                </label>
                <input
                  id="city"
                  type="text"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="TP. Hồ Chí Minh"
                />
              </div>
              <div>
                <label htmlFor="district" className="block text-sm font-medium text-slate-700">
                  Quận/Huyện
                </label>
                <input
                  id="district"
                  type="text"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Quận 1"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-800">Phương thức thanh toán</h2>
            <div className="mt-4 space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/50">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="h-4 w-4 text-emerald-600"
                />
                <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/50">
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                  className="h-4 w-4 text-emerald-600"
                />
                <span className="font-medium">Chuyển khoản ngân hàng</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50/50">
                <input
                  type="radio"
                  name="payment"
                  value="momo"
                  checked={paymentMethod === "momo"}
                  onChange={() => setPaymentMethod("momo")}
                  className="h-4 w-4 text-emerald-600"
                />
                <span className="font-medium">Ví MoMo</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 lg:mt-0">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-800">Tóm tắt đơn hàng</h2>
            <ul className="mt-4 space-y-3 border-b border-slate-200 pb-4">
              {items.map((item) => (
                item.product && (
                  <li key={item.productId} className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium text-slate-800">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </li>
                )
              ))}
            </ul>
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
            <button
              type="button"
              className="mt-6 w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Đặt hàng
            </button>
            <Link
              href="/cart"
              className="mt-3 block text-center text-sm text-emerald-600 hover:underline"
            >
              Quay lại giỏ hàng
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
