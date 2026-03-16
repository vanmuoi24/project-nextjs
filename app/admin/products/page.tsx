"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { productsApi } from "@/lib/api";
import type { ProductResponse } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function AdminProductsPage() {
  const [list, setList] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await productsApi.getAll();
      setList(data ?? []);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Xóa sản phẩm "${name}"?`)) return;
    setDeletingId(id);
    try {
      await productsApi.remove(id);
      setList((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert(getApiErrorMessage(e));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Sản phẩm</h1>
        <Link
          href="/admin/products/new"
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Thêm sản phẩm
        </Link>
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
          Chưa có sản phẩm.{" "}
          <Link href="/admin/products/new" className="text-emerald-600 hover:underline">
            Thêm sản phẩm
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="p-3 font-medium text-slate-600">Ảnh</th>
                  <th className="p-3 font-medium text-slate-600">Tên</th>
                  <th className="p-3 font-medium text-slate-600">Giá</th>
                  <th className="p-3 font-medium text-slate-600">SL</th>
                  <th className="p-3 font-medium text-slate-600">Danh mục</th>
                  <th className="p-3 font-medium text-slate-600 w-32">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="p-3">
                      <div className="relative h-12 w-16 overflow-hidden rounded bg-slate-100">
                        {p.imageUrl ? (
                          <Image
                            src={p.imageUrl}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : null}
                      </div>
                    </td>
                    <td className="p-3 font-medium text-slate-800">{p.name}</td>
                    <td className="p-3 text-slate-600">{formatPrice(p.price)}</td>
                    <td className="p-3 text-slate-600">{p.quantity}</td>
                    <td className="p-3 text-slate-600">
                      {p.categoryRelation?.name ?? p.category ?? "—"}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 hover:bg-slate-50"
                        >
                          Sửa
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deletingId === p.id}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === p.id ? "..." : "Xóa"}
                        </button>
                      </div>
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
