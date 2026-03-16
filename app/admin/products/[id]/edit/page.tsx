"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { productsApi, categoriesApi } from "@/lib/api";
import type { UpdateProductDto } from "@/lib/api";
import type { CategoryResponse } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api";

export default function AdminEditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [form, setForm] = useState<UpdateProductDto>({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    imageUrl: "",
    categoryId: undefined,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Number.isNaN(id)) {
      setLoading(false);
      return;
    }
    Promise.all([productsApi.getById(id), categoriesApi.getAll()])
      .then(([productRes, categoriesRes]) => {
        const p = productRes.data;
        if (p) {
          setForm({
            name: p.name,
            description: p.description,
            price: p.price,
            quantity: p.quantity,
            imageUrl: p.imageUrl,
            categoryId: p.categoryRelation?.id,
          });
        }
        setCategories(categoriesRes.data ?? []);
      })
      .catch(() => setError("Không tải được sản phẩm."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await productsApi.update(id, form);
      router.push("/admin/products");
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="h-96 animate-pulse rounded-xl bg-slate-200" />
      </div>
    );
  }

  if (error && !form.name) {
    return (
      <div className="space-y-4">
        <Link href="/admin/products" className="text-emerald-600 hover:underline">
          ← Sản phẩm
        </Link>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="text-slate-500 hover:text-slate-700">
          ← Sản phẩm
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Sửa sản phẩm</h1>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-slate-700">Tên *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Mô tả *</label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Giá (VNĐ) *</label>
            <input
              type="number"
              required
              min={0}
              value={form.price ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) || 0 }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Số lượng *</label>
            <input
              type="number"
              required
              min={0}
              value={form.quantity ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, quantity: Number(e.target.value) || 0 }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">URL ảnh *</label>
          <input
            type="url"
            required
            value={form.imageUrl ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Danh mục</label>
          <select
            value={form.categoryId ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                categoryId: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="">— Chọn —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
          <Link
            href="/admin/products"
            className="rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
