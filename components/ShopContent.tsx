"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { productsApi } from "@/lib/api";
import type { ProductResponse } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import SearchBar from "@/components/SearchBar";

const ITEMS_PER_PAGE = 8;
const priceRangeMap: Record<string, { min: number; max: number }> = {
  under5: { min: 0, max: 5_000_000 },
  "5-15": { min: 5_000_000, max: 15_000_000 },
  "15-30": { min: 15_000_000, max: 30_000_000 },
  over30: { min: 30_000_000, max: Infinity },
};

function getProductBrand(p: ProductResponse): string {
  return p.categoryRelation?.name ?? p.category ?? "";
}

function ShopContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const categoryFromUrl = searchParams.get("category");

  const [productsList, setProductsList] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); //NEW

  const [searchQuery, setSearchQuery] = useState(q);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryFromUrl);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Task 5: Fetch API + error handling
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await productsApi.getAll();
        setProductsList(data ?? []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
        setProductsList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setSearchQuery(q);
    setSelectedCategory(categoryFromUrl);
    setCurrentPage(1);
  }, [q, categoryFromUrl]);

  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      if (searchQuery.trim()) {
        const lower = searchQuery.trim().toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(lower) ||
          getProductBrand(p).toLowerCase().includes(lower) ||
          (p.description ?? "").toLowerCase().includes(lower);
        if (!matchesSearch) return false;
      }

      if (selectedCategory) {
        const matchesCat =
          p.category === selectedCategory ||
          p.categoryRelation?.slug === selectedCategory ||
          String(p.categoryRelation?.id) === selectedCategory;
        if (!matchesCat) return false;
      }

      if (selectedPriceRange && selectedPriceRange !== "all") {
        const range = priceRangeMap[selectedPriceRange];
        if (range && (p.price < range.min || p.price >= range.max)) return false;
      }

      if (selectedBrands.length > 0) {
        if (!selectedBrands.includes(getProductBrand(p))) return false;
      }

      return true;
    });
  }, [productsList, searchQuery, selectedCategory, selectedPriceRange, selectedBrands]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleBrandToggle = useCallback((brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  }, []);

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedPriceRange(null);
    setSelectedBrands([]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">Cửa hàng</h1>
      <p className="mt-1 text-slate-600">Tìm xe đạp phù hợp với bạn</p>

      {/*HIỂN THỊ LỖI */}
      {error && (
        <div className="mt-6 rounded-2xl border border-red-300 bg-red-50 py-6 text-center">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      <div className="mt-6 lg:hidden">
        <SearchBar initialQuery={searchQuery} />
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <FilterSidebar
          selectedCategory={selectedCategory}
          selectedPriceRange={selectedPriceRange}
          selectedBrands={selectedBrands}
          onCategoryChange={(id) => {
            setSelectedCategory(id);
            setCurrentPage(1);
          }}
          onPriceRangeChange={(id) => {
            setSelectedPriceRange(id);
            setCurrentPage(1);
          }}
          onBrandToggle={handleBrandToggle}
        />

        <div className="min-w-0 flex-1">
          <div className="hidden lg:block">
            <SearchBar initialQuery={searchQuery} />
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Hiển thị {paginatedProducts.length} / {filteredProducts.length} sản phẩm
          </p>

          {loading ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-200" />
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
              <div className="text-6xl mb-3 opacity-70">🔍</div>
              <p className="text-slate-600 font-medium">
                Không tìm thấy sản phẩm phù hợp.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Thử thay đổi bộ lọc hoặc từ khóa.
              </p>

              <button
                onClick={resetFilters}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700"
              >
                🧹 Xóa bộ lọc
              </button>
            </div>
          ) : (
            <>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}