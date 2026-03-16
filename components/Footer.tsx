import Link from "next/link";
const footerLinks = {
  shop: [
    { label: "Tất cả sản phẩm", href: "/shop" },
    { label: "Xe đạp địa hình", href: "/shop?category=mountain" },
    { label: "Xe đạp đường phố", href: "/shop?category=street" },
    { label: "Xe đạp thể thao", href: "/shop?category=sport" },
    { label: "Xe đạp trẻ em", href: "/shop?category=kids" },
  ],
  support: [
    { label: "Liên hệ", href: "#" },
    { label: "Hướng dẫn mua hàng", href: "#" },
    { label: "Chính sách đổi trả", href: "#" },
    { label: "Bảo hành", href: "#" },
  ],
  legal: [
    { label: "Điều khoản sử dụng", href: "#" },
    { label: "Chính sách bảo mật", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          <div>
            <Link href="/" className="text-lg font-bold text-emerald-600">
              BikeShop
            </Link>
            <p className="mt-3 text-sm text-slate-600">
              Chuyên xe đạp chính hãng, bảo hành toàn quốc. Giao hàng tận nơi.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800">
              Cửa hàng
            </h3>

            <ul className="mt-4 space-y-2">
              {footerLinks.shop.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800">
              Hỗ trợ
            </h3>

            <ul className="mt-4 space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800">
              Pháp lý
            </h3>

            <ul className="mt-4 space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} BikeShop. All rights reserved.
        </div>

      </div>
    </footer>
  );
}