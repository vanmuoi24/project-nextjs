import Link from "next/link";

const navItems = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/orders", label: "Quản lý đơn hàng" },

  { href: "/admin/products", label: "Quản lý sản phẩm" },
  { href: "/admin/categories", label: "Quản lý danh mục" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed left-0 top-0 z-40 h-screen w-56 border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-4">
          <Link href="/admin" className="font-semibold text-slate-800">
            BikeShop Admin
          </Link>
        </div>
        <nav className="p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-2">
          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            ← Về trang chủ
          </Link>
        </div>
      </aside>
      <main className="pl-56">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
