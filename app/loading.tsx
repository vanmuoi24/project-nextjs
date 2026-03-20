"use client";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent shadow-xl shadow-emerald-500/10" />
      </div>
      <div className="animate-pulse space-y-2 text-center">
        <p className="text-xl font-bold text-slate-800">Đang tải dữ liệu...</p>
        <p className="text-sm font-medium text-slate-500">Vui lòng chờ trong giây lát</p>
      </div>
    </div>
  );
}
