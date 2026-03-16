"use client";

import { useEffect, useState } from "react";
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

export default function AdminOrdersPage() {
  const [list, setList] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "">("");

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await ordersApi.getAll(
        filterStatus ? { status: filterStatus as OrderStatus } : undefined
      );
      setList(data ?? []);
    } catch (e) {
      setError(getApiErrorMessage(e));
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Đơn hàng</h1>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as OrderStatus | "")}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="">Tất cả trạng thái</option>
          {(Object.entries(STATUS_LABEL) as [OrderStatus, string][]).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Đang tải...
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Chưa có đơn hàng.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="p-3 font-medium text-slate-600">Mã đơn</th>
                  <th className="p-3 font-medium text-slate-600">Khách hàng</th>
                  <th className="p-3 font-medium text-slate-600">Tổng tiền</th>
                  <th className="p-3 font-medium text-slate-600">Trạng thái</th>
                  <th className="p-3 font-medium text-slate-600">Ngày tạo</th>
                  <th className="p-3 font-medium text-slate-600 w-24">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {list.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="p-3 font-medium text-slate-800">#{order.id}</td>
                    <td className="p-3 text-slate-600">
                      {order.userName ?? order.userEmail ?? `User #${order.userId}`}
                    </td>
                    <td className="p-3 font-medium text-slate-800">
                      {formatPrice(order.total)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          order.status === "delivered"
                            ? "bg-emerald-100 text-emerald-700"
                            : order.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {STATUS_LABEL[order.status]}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{formatDate(order.createdAt)}</td>
                    <td className="p-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-emerald-600 hover:underline"
                      >
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
