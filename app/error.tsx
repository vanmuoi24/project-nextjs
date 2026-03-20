"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to an error reporting service if needed
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-red-50 text-red-500 shadow-xl shadow-red-100/50">
          <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>
      
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Đã xảy ra lỗi!</h1>
      <p className="mt-6 text-lg font-medium text-slate-500">
        Hệ thống đang gặp sự cố. Chúng tôi thành thật xin lỗi vì sự bất tiện này.
      </p>
      
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <button
          onClick={reset}
          className="w-full cursor-pointer rounded-2xl bg-emerald-600 px-10 py-4 text-center font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] hover:bg-emerald-700 sm:w-auto"
        >
          Thử lại lần nữa
        </button>
        <Link
          href="/"
          className="w-full cursor-pointer rounded-2xl border border-slate-200 bg-white px-10 py-4 text-center font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 sm:w-auto"
        >
          Trang chủ
        </Link>
      </div>

      <p className="mt-12 text-sm font-medium text-slate-400">
        Mã lỗi: <code className="rounded bg-slate-100 px-2 py-1 text-red-400">{error.digest || 'Unknown'}</code>
      </p>
    </div>
  );
}
