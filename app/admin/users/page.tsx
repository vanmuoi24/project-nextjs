"use client";

import { useEffect, useState } from "react";
import { usersApi } from "@/lib/api";
import type { UserResponse } from "@/lib/api";
import { UserRole } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api";

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AdminUsersPage() {
  const [list, setList] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    usersApi
      .getAll()
      .then(({ data }) => setList(data ?? []))
      .catch((e) => {
        setError(getApiErrorMessage(e));
        setList([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Người dùng</h1>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Đang tải...
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Chưa có người dùng hoặc không có quyền xem.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="p-3 font-medium text-slate-600">ID</th>
                  <th className="p-3 font-medium text-slate-600">Tên</th>
                  <th className="p-3 font-medium text-slate-600">Email</th>
                  <th className="p-3 font-medium text-slate-600">Vai trò</th>
                  <th className="p-3 font-medium text-slate-600">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {list.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="p-3 font-medium text-slate-800">{u.id}</td>
                    <td className="p-3 text-slate-800">{u.name}</td>
                    <td className="p-3 text-slate-600">{u.email}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          u.role === UserRole.ADMIN
                            ? "bg-violet-100 text-violet-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {u.role === UserRole.ADMIN ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{formatDate(u.createdAt)}</td>
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
