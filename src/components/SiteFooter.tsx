import { Link } from "@tanstack/react-router";
import { Home, Store, Info, Phone, MapPin, MessageCircle, Facebook, Instagram } from "lucide-react";

export function SiteFooter() {
  return (
    <footer
      className="text-primary-foreground mt-16 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.35 0.14 330) 0%, oklch(0.42 0.15 320) 45%, oklch(0.48 0.12 300) 100%)",
      }}
    >
      {/* Decorative waves */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-14 grid md:grid-cols-3 gap-10 relative">
        {/* Brand */}
        <div className="order-3 md:order-1 text-center md:text-right">
          <div className="inline-block bg-white rounded-2xl px-6 py-4 mb-5 shadow-lg">
            <h3 className="text-2xl font-bold text-primary tracking-tight" style={{ fontFamily: "var(--font-latin)" }}>So Beauty</h3>
            <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "var(--font-display)" }}>سو بيوتي · عناية طبيعية</p>
          </div>
          <h4 className="text-lg font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>روائع العناية</h4>
          <p className="text-sm opacity-90 leading-relaxed max-w-sm md:mr-0 md:ml-auto mx-auto">
            نسعى جاهدين لنقدم لكم أفضل منتجات العناية الطبيعية بالبشرة، بأسعار تنافسية وجودة عالية.
            نضمن لكم أن جميع منتجاتنا أصلية بنسبة 100%.
          </p>
        </div>

        {/* Quick links */}
        <div className="order-2 text-center">
          <h4 className="text-lg font-bold mb-5" style={{ fontFamily: "var(--font-display)" }}>روابط سريعة</h4>
          <ul className="space-y-3 text-sm inline-block text-right">
            <li><Link to="/" className="flex items-center gap-3 hover:opacity-80"><Home className="w-4 h-4" /> الرئيسية</Link></li>
            <li><Link to="/products" className="flex items-center gap-3 hover:opacity-80"><Store className="w-4 h-4" /> المتجر</Link></li>
            <li><Link to="/boxes" className="flex items-center gap-3 hover:opacity-80"><Info className="w-4 h-4" /> من نحن</Link></li>
            <li><Link to="/account" className="flex items-center gap-3 hover:opacity-80"><Phone className="w-4 h-4" /> تواصل معنا</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="order-1 md:order-3 text-center md:text-right">
          <h4 className="text-lg font-bold mb-5" style={{ fontFamily: "var(--font-display)" }}>معلومات التواصل</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3 justify-center md:justify-end">
              <span>أم درمان — شارع الوادي</span>
              <MapPin className="w-4 h-4 shrink-0" />
            </li>
            <li className="flex items-center gap-3 justify-center md:justify-end">
              <span dir="ltr">+249 900 776 688</span>
              <Phone className="w-4 h-4 shrink-0" />
            </li>
            <li className="flex items-center gap-3 justify-center md:justify-end">
              <span dir="ltr">sobeauty.one@gmail.com</span>
              <MessageCircle className="w-4 h-4 shrink-0" />
            </li>
          </ul>
          <div className="flex gap-3 mt-6 justify-center md:justify-end">
            <a href="#" aria-label="facebook" className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" aria-label="instagram" className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 py-4 text-center text-xs opacity-80 relative">
        © {new Date().getFullYear()} So Beauty · سو بيوتي. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
