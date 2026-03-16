"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { productsApi, categoriesApi, ordersApi, usersApi } from "@/lib/api";

export default function AdminDashboardPage() {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [categoryCount, setCategoryCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [productsRes, categoriesRes, ordersRes, usersRes] = await Promise.all([
          productsApi.getAll(),
          categoriesApi.getAll(),
          ordersApi.getAll(),
          usersApi.getAll(),
        ]);
        setProductCount(productsRes.data?.length ?? 0);
        setCategoryCount(categoriesRes.data?.length ?? 0);
        setOrderCount(ordersRes.data?.length ?? 0);
        setUserCount(usersRes.data?.length ?? 0);
      } catch {
        setProductCount(0);
        setCategoryCount(0);
        setOrderCount(0);
        setUserCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Tổng quan</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    { href: "/admin/orders", label: "Đơn hàng", count: orderCount ?? 0 },
    { href: "/admin/users", label: "Người dùng", count: userCount ?? 0 },
    { href: "/admin/products", label: "Sản phẩm", count: productCount ?? 0 },
    { href: "/admin/categories", label: "Danh mục", count: categoryCount ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Tổng quan</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-medium text-slate-500">{c.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-800">{c.count}</p>
            <p className="mt-1 text-sm text-emerald-600">Quản lý →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
