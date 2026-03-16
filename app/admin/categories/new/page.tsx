"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { categoriesApi } from "@/lib/api";
import type { CreateCategoryDto } from "@/lib/api";
import type { CategoryResponse } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api";

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminNewCategoryPage() {
  const router = useRouter();
  const [parents, setParents] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateCategoryDto>({
    name: "",
    slug: "",
    thumbnail: "",
    parent_id: null,
    is_active: true,
  });

  useEffect(() => {
    categoriesApi.getAll().then(({ data }) => setParents(data ?? []));
  }, []);

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: slugify(name) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await categoriesApi.create({
        ...form,
        thumbnail: form.thumbnail || null,
        parent_id: form.parent_id ?? null,
      });
      router.push("/admin/categories");
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories" className="text-slate-500 hover:text-slate-700">
          ← Danh mục
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Thêm danh mục</h1>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700">Tên *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Slug *</label>
          <input
            type="text"
            required
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">URL ảnh (thumbnail)</label>
          <input
            type="url"
            value={form.thumbnail ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value || undefined }))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Danh mục cha</label>
          <select
            value={form.parent_id ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                parent_id: e.target.value ? Number(e.target.value) : null,
              }))
            }
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="">— Không có —</option>
            {parents.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={form.is_active ?? true}
            onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="is_active" className="text-sm text-slate-700">
            Kích hoạt
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
          <Link
            href="/admin/categories"
            className="rounded-xl border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
