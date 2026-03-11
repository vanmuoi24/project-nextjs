"use client";

import { categories } from "@/data/categories";

const priceRanges = [
  { id: "all", label: "Tất cả", min: 0, max: Infinity },
  { id: "under5", label: "Dưới 5 triệu", min: 0, max: 5_000_000 },
  { id: "5-15", label: "5 - 15 triệu", min: 5_000_000, max: 15_000_000 },
  { id: "15-30", label: "15 - 30 triệu", min: 15_000_000, max: 30_000_000 },
  { id: "over30", label: "Trên 30 triệu", min: 30_000_000, max: Infinity },
];

const brands = ["Giant", "Trek", "Specialized", "Cannondale", "Marin"];

interface FilterSidebarProps {
  selectedCategory: string | null;
  selectedPriceRange: string | null;
  selectedBrands: string[];
  onCategoryChange: (id: string | null) => void;
  onPriceRangeChange: (id: string | null) => void;
  onBrandToggle: (brand: string) => void;
}

export default function FilterSidebar({
  selectedCategory,
  selectedPriceRange,
  selectedBrands,
  onCategoryChange,
  onPriceRangeChange,
  onBrandToggle,
}: FilterSidebarProps) {
  return (
    <aside className="w-full shrink-0 space-y-6 lg:w-64">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800">
          Danh mục
        </h3>
        <ul className="mt-3 space-y-1">
          <li>
            <button
              type="button"
              onClick={() => onCategoryChange(null)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                !selectedCategory
                  ? "bg-emerald-50 font-medium text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              Tất cả
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-emerald-50 font-medium text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800">
          Khoảng giá
        </h3>
        <ul className="mt-3 space-y-1">
          {priceRanges.map((range) => (
            <li key={range.id}>
              <button
                type="button"
                onClick={() => onPriceRangeChange(selectedPriceRange === range.id ? null : range.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  selectedPriceRange === range.id
                    ? "bg-emerald-50 font-medium text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {range.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800">
          Thương hiệu
        </h3>
        <ul className="mt-3 space-y-2">
          {brands.map((brand) => (
            <li key={brand}>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => onBrandToggle(brand)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-slate-600">{brand}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
