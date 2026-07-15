import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShoppingCart, Search, Menu, X, ShieldCheck, CreditCard, Truck, Sparkles,
  Star, Phone, Mail, Facebook, Instagram, Linkedin, Twitter, Youtube, ArrowLeft, Flower2,
} from "lucide-react";
import heroProducts from "@/assets/hero-products.jpg";
import natural from "@/assets/natural-collection.jpg";
import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import beforeImg from "@/assets/before.jpg";
import afterImg from "@/assets/after.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const navLinks = [
  { label: "الرئيسية", href: "#home" },
  { label: "منتجاتنا", href: "#products" },
  { label: "عروض وتخفيضات", href: "#offers" },
  { label: "بوكسات العناية", href: "#boxes" },
  { label: "مفضّرات", href: "#care" },
  { label: "مضاد وقطن", href: "#accessories" },
];

const features = [
  { icon: Sparkles, title: "نتائج فعّالة ومضمونة", desc: "منتجات مصنوعة بعناية لتعطيك أفضل النتائج." },
  { icon: Truck, title: "شحن سريع", desc: "توصيل طلبك في أسرع وقت وأمان لكل أنحاء العالم." },
  { icon: CreditCard, title: "طرق دفع آمنة وسهلة", desc: "ادفع عند الاستلام أو أونلاين عبر بوابات دفع موثوقة." },
  { icon: ShieldCheck, title: "منتجات أصلية 100%", desc: "نضمن لك جودة وأصالة كل صنف وسلامة كل بوم." },
];

const products = [
  { name: "صابونة الكركم", price: "43.00 ر.س", img: p1 },
  { name: "مزيل العرق", price: "43.00 ر.س", img: p2 },
  { name: "كريم تفتيح", price: "43.00 ر.س", img: p3 },
  { name: "دلكة سودانية", price: "43.00 ر.س", img: p4 },
];

const testimonials = [
  { name: "محمود علي", rating: 5, title: "دعم مستمر وخدمة ممتازة", body: "المنتجات فعلاً غيرت روتين بشرتي، وصلت بسرعة والتغليف رائع." },
  { name: "مصطفى عامر", rating: 5, title: "جودة قيّمة ومفيدة", body: "أحس الفرق من أول أسبوع، بشرتي أصبحت أنعم وأكثر إشراقاً." },
  { name: "أحمد عبدالله", rating: 4, title: "تعلم سهل وممتع", body: "تجربتي معهم ممتازة والدعم متواجد دايماً للإجابة على كل استفساراتي." },
];

function Index() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <TopBar onMenu={() => setOpen(true)} />
      <MobileNav open={open} onClose={() => setOpen(false)} />
      <Hero />
      <Features />
      <NaturalBloom />
      <Products />
      <BeforeAfter />
      <Testimonials />
      <Footer />
    </div>
  );
}

function TopBar({ onMenu }: { onMenu: () => void }) {
  return (
    <header id="home" className="sticky top-0 z-40 bg-brand text-brand-foreground shadow-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6 lg:py-4">
        <div className="flex items-center gap-2">
          <button onClick={onMenu} className="lg:hidden" aria-label="القائمة">
            <Menu className="h-6 w-6" />
          </button>
          <button aria-label="السلة" className="hidden rounded-full bg-white/10 p-2 transition hover:bg-white/20 sm:block">
            <ShoppingCart className="h-5 w-5" />
          </button>
          <button className="hidden rounded-full border border-white/30 px-4 py-1.5 text-sm transition hover:bg-white/10 sm:block">
            تسجيل دخول
          </button>
        </div>

        <div className="relative min-w-0">
          <input
            type="search"
            placeholder="ابحث عن منتجك…"
            className="w-full rounded-full bg-white/95 px-11 py-2 text-sm text-foreground outline-none ring-0 placeholder:text-muted-foreground focus:bg-white"
          />
          <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        <a href="#home" className="flex shrink-0 items-center gap-2">
          <Flower2 className="h-7 w-7" />
          <span className="hidden text-xl font-black tracking-tight sm:block">moonflower</span>
        </a>
      </div>

      <nav className="hidden border-t border-white/15 lg:block">
        <ul className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-6 py-3 text-sm font-semibold">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="opacity-90 transition hover:opacity-100">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-72 bg-brand p-6 text-brand-foreground shadow-2xl">
        <div className="mb-8 flex items-center justify-between">
          <span className="text-lg font-black">moonflower</span>
          <button onClick={onClose} aria-label="إغلاق"><X className="h-6 w-6" /></button>
        </div>
        <ul className="space-y-4 text-base font-semibold">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={onClose} className="block rounded-lg px-3 py-2 hover:bg-white/10">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

function Hero() {
  return (
    <section className="bg-brand text-brand-foreground">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-16 pt-8 sm:px-6 md:grid-cols-2 md:gap-12 md:pt-12 lg:pb-24">
        <div className="order-2 md:order-1">
          <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
            امنحي بشرتك العناية التي تستحقّها.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            اكتشفي مجموعة مختارة من منتجات العناية بالبشرة، لتمنحك إشراقة طبيعية
            وإحساساً بالانتعاش في كل يوم.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#products" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-brand shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
              سجّل الآن
              <ArrowLeft className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <div className="relative mx-auto max-w-md">
            <div className="absolute inset-0 -translate-x-6 translate-y-6 rounded-[2rem] bg-white/10 blur-2xl" />
            <img
              src={heroProducts}
              alt="مجموعة منتجات Moonflower الطبيعية"
              width={1024}
              height={1024}
              className="relative aspect-square w-full rounded-[2rem] object-cover shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-black text-brand sm:text-4xl">ما الذي يميّزنا؟</h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          ابدأ رحلتك التعليمية الآن مع دورات احترافية في العناية والتصميم، التسويق، اللغات والمزيد.
        </p>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="group rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand text-brand-foreground shadow-md transition group-hover:scale-110">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold">{f.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function NaturalBloom() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <img
          src={natural}
          alt="منتجات طبيعية"
          width={1024}
          height={1024}
          loading="lazy"
          className="w-full rounded-3xl object-cover shadow-lg"
        />
        <div>
          <h2 className="text-3xl font-black leading-tight sm:text-4xl">
            خلّي جمالك الطبيعي يزهر مع
            <span className="mt-2 block text-brand">Moon Flower</span>
          </h2>
          <p className="mt-6 text-base leading-loose text-muted-foreground">
            منتجاتنا مستوحاة من نقاء الطبيعة لتمنح بشرتك النعومة والإشراقة التي
            تستحقّها. لأننا نؤمن إن العناية الحقيقية تبدأ من مكوّنات بسيطة،
            ونتائج تدوم.
          </p>
          <a href="#products" className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3 text-sm font-bold text-brand-foreground shadow-md transition hover:bg-brand-deep">
            اكتشف المجموعة
            <ArrowLeft className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Products() {
  return (
    <section id="products" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-black sm:text-3xl md:text-4xl">منتجاتنا الأكثر مبيعاً</h2>
        <a href="#" className="text-sm font-bold text-brand hover:underline">المزيد</a>
      </div>
      <div className="mt-10 grid gap-6 grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <article key={p.name} className="group">
            <div className="relative overflow-hidden rounded-t-[6rem] rounded-b-2xl bg-brand-soft aspect-[3/4]">
              <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-brand-foreground shadow">
                <ShoppingCart className="h-3 w-3" /> إضافة
              </span>
              <img
                src={p.img}
                alt={p.name}
                width={1024}
                height={1024}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="mt-3 text-center">
              <h3 className="text-sm font-bold sm:text-base">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.price}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BeforeAfter() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-black leading-snug sm:text-3xl md:text-4xl">
          من المشكلة إلى الحل مع كريم التفتيح
          <span className="mt-2 block text-brand">Moon Flower ✿</span>
        </h2>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Card
          tag="قبل العناية"
          img={beforeImg}
          quote="استهلكت نصاري وأوّدد لو بشرتي، والترطيب بقي طبيعي وملمسي ناعم من أول أسبوع."
          reverse
        />
        <Card
          tag="بعد العناية بكريم"
          img={afterImg}
          quote="بشرتي بهت من الشمس والتعب اليومي، وجرّبت منتجات كثير من غير نتيجة حقيقية."
        />
      </div>
    </section>
  );
}

function Card({ tag, img, quote, reverse }: { tag: string; img: string; quote: string; reverse?: boolean }) {
  return (
    <div className={`grid overflow-hidden rounded-3xl bg-brand text-brand-foreground shadow-xl ${reverse ? "sm:grid-cols-[1fr_auto]" : "sm:grid-cols-[auto_1fr]"}`}>
      <img
        src={img}
        alt={tag}
        width={512}
        height={512}
        loading="lazy"
        className={`h-64 w-full object-cover sm:h-full sm:w-56 ${reverse ? "sm:order-2" : ""}`}
      />
      <div className="p-6 sm:p-8">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
          {tag} ✿
        </span>
        <p className="mt-4 text-sm leading-loose text-white/90 sm:text-base">{quote}</p>
      </div>
    </div>
  );
}

function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="text-center">
        <h2 className="text-2xl font-black sm:text-3xl md:text-4xl">آراء العملاء</h2>
        <p className="mt-3 text-sm text-muted-foreground">شارك رأيك معنا وشاهد جميع آراء العملاء</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <div key={t.name} className="relative rounded-2xl border border-border bg-card p-6 pt-14 text-center shadow-sm transition hover:shadow-lg">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-brand text-2xl font-black text-brand-foreground ring-4 ring-background">
                {t.name.charAt(0)}
              </div>
            </div>
            <div className="flex justify-center gap-0.5 text-brand">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className={`h-4 w-4 ${j < t.rating ? "fill-current" : "opacity-30"}`} />
              ))}
            </div>
            <h3 className="mt-3 text-base font-bold">{t.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
            <p className="mt-4 text-xs font-bold text-brand">— {t.name}</p>
            <span className="sr-only">{i}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-brand text-brand-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Flower2 className="h-7 w-7" />
            <span className="text-xl font-black">moonflower</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            نحن نؤمن إن الجمال الحقيقي يبدأ من العناية الصحّية بالبشرة. رسالتنا
            نقدّم لك منتجات طبيعية وموثوقة.
          </p>
          <div className="mt-5 flex gap-3">
            {[Facebook, Instagram, Linkedin, Twitter, Youtube].map((Ic, i) => (
              <a key={i} href="#" aria-label="social" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/25">
                <Ic className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-black">روابط مهمّة</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li><a href="#" className="hover:text-white">الرئيسية</a></li>
            <li><a href="#" className="hover:text-white">سياسات الطلبات</a></li>
            <li><a href="#" className="hover:text-white">سياسات الاسترجاع والاستبدال</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-black">تواصل معنا</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +966 55 963 7277</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +966 55 963 7277</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> flowerx2121@gmail.com</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-black">أرسل لنا معلوماتك تواصلك</h4>
          <p className="mt-3 text-xs text-white/70">لكي دائماً نواصل معك أوّلاً بأوّل، ساعدنا بجرد على استفساراتك مهما كانت بسيطة وسنبذل كل ما لدينا.</p>
          <form className="mt-4 flex gap-2 rounded-full bg-white p-1.5">
            <input placeholder="بريدك الإلكتروني" className="w-full flex-1 bg-transparent px-3 py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground" />
            <button className="rounded-full bg-brand px-5 py-1.5 text-xs font-bold text-brand-foreground">إرسال</button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/15 py-4 text-center text-xs text-white/70">
        © {new Date().getFullYear()} Moonflower. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
