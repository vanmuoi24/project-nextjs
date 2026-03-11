"use client";

import { useState } from "react";
import Link from "next/link";

const demoOrders = [
  { id: "DH001", date: "2024-03-01", total: 12500000, status: "Đã giao" },
  { id: "DH002", date: "2024-02-15", total: 7900000, status: "Đã giao" },
  { id: "DH003", date: "2024-02-01", total: 18900000, status: "Đang giao" },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"info" | "orders">("info");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Tài khoản</h1>
      <p className="mt-1 text-slate-600">Quản lý thông tin và đơn hàng</p>

      <div className="mt-8 flex gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("info")}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "info"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Thông tin cá nhân
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "orders"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Đơn hàng đã mua
        </button>
      </div>

      {activeTab === "info" && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-800">Thông tin người dùng</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Họ và tên</label>
              <input
                type="text"
                defaultValue="Nguyễn Văn A"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                defaultValue="user@example.com"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Số điện thoại</label>
              <input
                type="tel"
                defaultValue="0901234567"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Địa chỉ</label>
              <input
                type="text"
                defaultValue="123 Đường ABC, Quận 1, TP.HCM"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
          <button
            type="button"
            className="mt-6 rounded-xl bg-emerald-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Cập nhật
          </button>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="mt-8 space-y-4">
          {demoOrders.map((order) => (
            <div
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
            >
              <div>
                <p className="font-semibold text-slate-800">Đơn hàng {order.id}</p>
                <p className="text-sm text-slate-500">{order.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                  {order.status}
                </span>
                <span className="font-semibold text-emerald-600">
                  {formatPrice(order.total)}
                </span>
              </div>
              <Link
                href="#"
                className="text-sm font-medium text-emerald-600 hover:underline"
              >
                Xem chi tiết
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
