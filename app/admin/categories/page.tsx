"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { categoriesApi } from "@/lib/api";
import type { CategoryResponse } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api";

export default function AdminCategoriesPage() {
  const [list, setList] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await categoriesApi.getAll();
      setList(data ?? []);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Xóa danh mục "${name}"?`)) return;
    setDeletingId(id);
    try {
      await categoriesApi.remove(id);
      setList((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      alert(getApiErrorMessage(e));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Danh mục</h1>
        <Link
          href="/admin/categories/new"
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Thêm danh mục
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
          Chưa có danh mục.{" "}
          <Link href="/admin/categories/new" className="text-emerald-600 hover:underline">
            Thêm danh mục
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
                  <th className="p-3 font-medium text-slate-600">Slug</th>
                  <th className="p-3 font-medium text-slate-600">Trạng thái</th>
                  <th className="p-3 font-medium text-slate-600 w-32">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="p-3">
                      {c.thumbnail ? (
                        <div className="relative h-12 w-16 overflow-hidden rounded bg-slate-100">
                          <Image
                            src={c.thumbnail}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="p-3 font-medium text-slate-800">{c.name}</td>
                    <td className="p-3 text-slate-600">{c.slug}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          c.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {c.is_active ? "Bật" : "Tắt"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/categories/${c.id}/edit`}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 hover:bg-slate-50"
                        >
                          Sửa
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id, c.name)}
                          disabled={deletingId === c.id}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === c.id ? "..." : "Xóa"}
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
