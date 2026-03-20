"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ordersApi } from "@/lib/api";
import type { OrderResponse } from "@/lib/api";

const STATUS_LABEL: Record<string, string> = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ProfileOrderDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const id = Number(params.id);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || Number.isNaN(id)) {
      setLoading(false);
      return;
    }
    ordersApi
      .getById(id)
      .then(({ data }) => setOrder(data))
      .catch(() => setError("Không tải được đơn hàng."))
      .finally(() => setLoading(false));
  }, [user, id]);

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-center">
        <p className="text-slate-600">Vui lòng đăng nhập.</p>
        <Link href="/login" className="mt-4 inline-block text-emerald-600 hover:underline">
          Đăng nhập
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-6 h-64 animate-pulse rounded-xl bg-slate-100" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/profile" className="text-emerald-600 hover:underline">
          ← Tài khoản
        </Link>
        <p className="mt-4 text-red-600">{error ?? "Không tìm thấy đơn hàng."}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/profile" className="text-emerald-600 hover:underline">
        ← Tài khoản
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-800">Đơn hàng #{order.id}</h1>
      <p className="mt-1 text-slate-500">{formatDate(order.createdAt)}</p>
      <p className="mt-2">
        Trạng thái:{" "}
        <span className="font-medium text-slate-800">{STATUS_LABEL[order.status] ?? order.status}</span>
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-800">Chi tiết đơn hàng</h2>
        <table className="mt-3 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="pb-2 pr-2">Sản phẩm</th>
              <th className="pb-2 pr-2 text-right">SL</th>
              <th className="pb-2 pr-2 text-right">Đơn giá</th>
              <th className="pb-2 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-slate-100">
                <td className="py-2 pr-2 font-medium text-slate-800">
                  {item.productName ?? `#${item.productId}`}
                </td>
                <td className="py-2 pr-2 text-right text-slate-600">{item.quantity}</td>
                <td className="py-2 pr-2 text-right text-slate-600">{formatPrice(item.totalPrice)}</td>
                <td className="py-2 text-right font-medium text-slate-800">
                  {formatPrice(item.subtotal ?? item.totalPrice * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 flex justify-end gap-2 border-t border-slate-200 pt-3 text-base font-semibold text-slate-800">
          Tổng cộng: <span className="text-emerald-600">{formatPrice(order.totalAmount)}</span>
        </p>
      </div>
    </div>
  );
}
