"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ordersApi } from "@/lib/api";
import type { OrderResponse, OrderStatus } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipping",
  "delivered",
  "cancelled",
];

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

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);

  useEffect(() => {
    if (Number.isNaN(id)) {
      setLoading(false);
      return;
    }
    ordersApi
      .getById(id)
      .then(({ data }) => {
        setOrder(data);
        setSelectedStatus(data?.status ?? null);
      })
      .catch(() => setError("Không tải được đơn hàng."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdateStatus = async () => {
    if (!order || selectedStatus === null || selectedStatus === order.status) return;
    setSaving(true);
    setError(null);
    try {
      const { data } = await ordersApi.updateStatus(id, selectedStatus);
      setOrder(data);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-64 animate-pulse rounded-xl bg-slate-200" />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="space-y-4">
        <Link href="/admin/orders" className="text-emerald-600 hover:underline">
          ← Đơn hàng
        </Link>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <Link href="/admin/orders" className="text-emerald-600 hover:underline">
          ← Đơn hàng
        </Link>
        <p className="text-slate-600">Không tìm thấy đơn hàng.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="text-slate-500 hover:text-slate-700">
          ← Đơn hàng
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Đơn hàng #{order.id}</h1>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-800">Thông tin khách hàng</h2>
        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Tên</dt>
            <dd className="font-medium text-slate-800">{order.userName ?? "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium text-slate-800">{order.userEmail ?? "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Số điện thoại</dt>
            <dd className="font-medium text-slate-800">{order.phone ?? "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Địa chỉ giao hàng</dt>
            <dd className="font-medium text-slate-800">{order.shippingAddress ?? "—"}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
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
                <td className="py-2 pr-2 text-right text-slate-600">
                  {formatPrice(item.price)}
                </td>
                <td className="py-2 text-right font-medium text-slate-800">
                  {formatPrice((item.subtotal ?? item.price * item.quantity))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 flex justify-end gap-2 border-t border-slate-200 pt-3 text-base font-semibold text-slate-800">
          Tổng cộng: <span className="text-emerald-600">{formatPrice(order.total)}</span>
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-800">Cập nhật trạng thái</h2>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <select
            value={selectedStatus ?? order.status}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleUpdateStatus}
            disabled={
              saving || selectedStatus === null || selectedStatus === order.status
            }
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu trạng thái"}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Tạo lúc: {formatDate(order.createdAt)} · Cập nhật: {formatDate(order.updatedAt)}
        </p>
      </div>
    </div>
  );
}
