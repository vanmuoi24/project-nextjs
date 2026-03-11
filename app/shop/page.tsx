import { Suspense } from "react";
import ShopContent from "@/components/ShopContent";

function ShopFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
      <div className="mt-8 flex gap-8">
        <div className="h-96 w-64 animate-pulse rounded-xl bg-slate-100" />
        <div className="flex-1 space-y-4">
          <div className="h-12 w-full animate-pulse rounded-xl bg-slate-100" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopContent />
    </Suspense>
  );
}
