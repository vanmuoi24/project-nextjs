import Link from "next/link";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";

const featuredIds = ["7", "1", "4", "8"];
const bestSellersIds = ["2", "5", "10", "3"];

export default function Home() {
  const featured = products.filter((p) => featuredIds.includes(p.id));
  const bestSellers = products.filter((p) => bestSellersIds.includes(p.id));

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Xe đạp chính hãng
              <span className="block text-emerald-200">Cho mọi hành trình</span>
            </h1>
            <p className="mt-4 text-lg text-emerald-100">
              Địa hình, đường phố, thể thao hay trẻ em — chúng tôi có đủ. Giao hàng tận nơi, bảo hành toàn quốc.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center rounded-xl bg-white px-6 py-3 text-base font-semibold text-emerald-700 shadow-lg transition-all hover:bg-emerald-50 hover:shadow-xl"
              >
                Mua sắm ngay
              </Link>
              <Link
                href="/shop?category=mountain"
                className="inline-flex items-center rounded-xl border-2 border-white/80 bg-transparent px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                Xe đạp địa hình
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">Danh mục xe đạp</h2>
        <p className="mt-1 text-slate-600">Chọn loại xe phù hợp với bạn</p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">Sản phẩm nổi bật</h2>
          <p className="mt-1 text-slate-600">Những mẫu xe được yêu thích nhất</p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Xem tất cả
            </Link>
          </div>
        </div>
      </section>

      {/* Promo banner */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/shop?category=sport"
          className="block overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white shadow-xl transition-transform hover:scale-[1.01] sm:p-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-sm font-medium uppercase tracking-wider text-emerald-400">
                Khuyến mãi
              </span>
              <h3 className="mt-2 text-2xl font-bold sm:text-3xl">
                Giảm đến 15% xe đạp thể thao
              </h3>
              <p className="mt-2 text-slate-300">
                Áp dụng cho dòng xe đua, đường trường. Số lượng có hạn.
              </p>
              <span className="mt-4 inline-block font-semibold text-emerald-400">
                Mua ngay →
              </span>
            </div>
            <div className="mt-6 sm:mt-0 sm:shrink-0">
              <div className="text-5xl font-bold text-white/10 sm:text-7xl">BIKE</div>
            </div>
          </div>
        </Link>
      </section>

      {/* Best sellers */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-800 sm:text-3xl">Bán chạy nhất</h2>
        <p className="mt-1 text-slate-600">Khách hàng lựa chọn nhiều</p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
