
import Link from "next/link";
import type { ProductResponse } from "@/lib/api/products";
import Image from "next/image";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

interface ProductCardProps {
  product: ProductResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
  const brand =
    product.categoryRelation?.name || product.category || undefined;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
      <img src={product.imageUrl} />
     
        <span className="absolute left-3 top-3 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          {brand}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold text-slate-800 transition-colors group-hover:text-emerald-600">
          {product.name}
        </h3>

        <p className="mt-2 text-lg font-bold text-emerald-600">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}