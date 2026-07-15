import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-black mb-3">Moonflower</h3>
          <p className="text-sm opacity-90">منتجات عناية طبيعية بالبشرة مستوحاة من نقاء الطبيعة.</p>
        </div>
        <div>
          <h4 className="font-bold mb-3">روابط</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:underline">المنتجات</Link></li>
            <li><Link to="/offers" className="hover:underline">العروض</Link></li>
            <li><Link to="/boxes" className="hover:underline">بوكسات العناية</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">حسابي</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/auth" className="hover:underline">تسجيل الدخول</Link></li>
            <li><Link to="/cart" className="hover:underline">السلة</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">تواصل</h4>
          <p className="text-sm opacity-90">للاستفسارات: support@moonflower.com</p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20 py-4 text-center text-xs opacity-75">
        © {new Date().getFullYear()} Moonflower. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
