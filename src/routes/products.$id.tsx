import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Star, Heart, MessageCircle, Truck, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { getProduct, listProducts, listReviews, addReview } from "@/lib/products.functions";
import { resolveProductImage } from "@/lib/product-images";
import { formatPrice, whatsappLink } from "@/lib/store-info";
import { useCart, MAX_QTY } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const productQuery = (id: string) => queryOptions({
  queryKey: ["product", id],
  queryFn: async () => {
    const p = await getProduct({ data: { id } });
    if (!p) throw notFound();
    return p;
  },
});
const reviewsQuery = (id: string) => queryOptions({
  queryKey: ["reviews", id],
  queryFn: () => listReviews({ data: { productId: id } }),
});

export const Route = createFileRoute("/products/$id")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(productQuery(params.id)),
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.name} — So Beauty` : "تفاصيل المنتج — So Beauty";
    const desc = loaderData?.description ?? "تعرّفي على وصف المنتج وسعره في سو بيوتي.";
    return { meta: [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ] };
  },
  component: Page,
  errorComponent: ({ error }) => <div className="p-8 text-center">{error.message}</div>,
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col"><SiteHeader />
    <main className="flex-1 p-8 text-center"><h1 className="text-2xl font-bold">المنتج غير موجود</h1><Link to="/products" className="text-primary underline">عودة</Link></main>
    <SiteFooter /></div>
  ),
});

function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Suspense fallback={<div>...</div>}><Detail /></Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}

function Detail() {
  const { id } = Route.useParams();
  const { data: p } = useSuspenseQuery(productQuery(id));
  const { add } = useCart();
  const wish = useWishlist();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "ing" | "use">("desc");
  const price = Number(p.price);
  const original = p.original_price != null ? Number(p.original_price) : null;
  const out = p.stock <= 0;
  const maxQty = Math.min(MAX_QTY, Math.max(1, p.stock));
  const liked = wish.has(p.id);

  return (
    <>
      <nav className="text-xs text-muted-foreground mb-4">
        <Link to="/" className="hover:text-primary">الرئيسية</Link> / <Link to="/products" className="hover:text-primary">المنتجات</Link> / <span>{p.name}</span>
      </nav>
      <div className="grid md:grid-cols-2 gap-8">
        <img src={resolveProductImage(p.image_url)} alt={p.name} className="w-full aspect-square object-cover rounded-2xl" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{p.name}</h1>
          <RatingSummary id={p.id} />
          <div className="flex items-baseline gap-3 my-4">
            <span className="text-3xl font-bold text-primary">{formatPrice(price)}</span>
            {original && original > price && <span className="text-lg text-muted-foreground line-through">{formatPrice(original)}</span>}
          </div>
          <p className={`text-sm font-semibold mb-4 ${out ? "text-destructive" : p.stock <= 5 ? "text-destructive" : "text-primary"}`}>
            {out ? "نفد المخزون حالياً" : p.stock <= 5 ? `متبقي ${p.stock} قطع فقط` : "متوفر في المخزون"}
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center border rounded-full">
              <button className="px-3 py-2" aria-label="إنقاص الكمية" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={out}>−</button>
              <span className="w-8 text-center" aria-live="polite">{qty}</span>
              <button className="px-3 py-2" aria-label="زيادة الكمية" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} disabled={out}>+</button>
            </div>
            <Button size="lg" className="rounded-full flex-1 min-w-40" disabled={out}
              onClick={() => { add({ id: p.id, name: p.name, price, image_url: p.image_url }, qty); toast.success("أُضيف إلى السلة"); }}>
              أضف إلى السلة
            </Button>
            <Button size="lg" variant="outline" className="rounded-full" aria-label="المفضلة" aria-pressed={liked}
              onClick={() => { const now = wish.toggle({ id: p.id, name: p.name, price, original_price: original, image_url: p.image_url }); toast.success(now ? "أُضيف إلى المفضلة" : "أُزيل من المفضلة"); }}>
              <Heart className={`w-5 h-5 ${liked ? "fill-primary text-primary" : ""}`} />
            </Button>
          </div>
          <a href={whatsappLink(`مرحباً سو بيوتي، أستفسر عن: ${p.name}`)} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary mb-6">
            <MessageCircle className="w-4 h-4" /> استفسري عبر واتساب
          </a>
          <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground mb-6">
            <Link to="/shipping" className="flex items-center gap-2 p-3 border rounded-xl hover:border-primary"><Truck className="w-4 h-4" /> الشحن والتوصيل</Link>
            <Link to="/returns" className="flex items-center gap-2 p-3 border rounded-xl hover:border-primary"><ShieldCheck className="w-4 h-4" /> الاستبدال والاسترجاع</Link>
          </div>
          <div className="border-b flex gap-4 text-sm mb-3">
            {([["desc", "الوصف"], ["ing", "المكونات"], ["use", "طريقة الاستخدام"]] as const).map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} className={`pb-2 font-semibold ${tab === k ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}>{l}</button>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
            {tab === "desc" ? p.description || "—" : tab === "ing" ? p.ingredients || "سيتم إضافة المكونات قريباً." : p.how_to_use || "سيتم إضافة طريقة الاستخدام قريباً."}
          </p>
        </div>
      </div>
      <Reviews id={p.id} />
      <Related id={p.id} category={p.category} />
    </>
  );
}

function Stars({ value, size = 4 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex" aria-label={`${value} من 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-${size} h-${size} ${i <= Math.round(value) ? "fill-primary text-primary" : "text-muted-foreground"}`} />
      ))}
    </span>
  );
}

function RatingSummary({ id }: { id: string }) {
  const { data } = useQuery(reviewsQuery(id));
  if (!data?.length) return <p className="text-xs text-muted-foreground">لا توجد تقييمات بعد</p>;
  const avg = data.reduce((s, r) => s + r.rating, 0) / data.length;
  return <div className="flex items-center gap-2 text-sm"><Stars value={avg} /> <span>{avg.toFixed(1)} ({data.length} تقييم)</span></div>;
}

function Reviews({ id }: { id: string }) {
  const { data = [] } = useQuery(reviewsQuery(id));
  const qc = useQueryClient();
  const submit = useServerFn(addReview);
  const [authed, setAuthed] = useState(false);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { supabase.auth.getUser().then(({ data }) => setAuthed(!!data.user)); }, []);

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold mb-4">آراء العملاء</h2>
      {data.length === 0 && <p className="text-sm text-muted-foreground mb-4">كوني أول من يقيّم هذا المنتج.</p>}
      <ul className="space-y-3 mb-6">
        {data.map((r) => (
          <li key={r.id} className="p-4 border rounded-xl">
            <div className="flex items-center justify-between mb-1"><span className="font-semibold text-sm">{r.author_name}</span><Stars value={r.rating} /></div>
            {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
          </li>
        ))}
      </ul>
      {authed ? (
        <form className="p-4 border rounded-xl space-y-3 max-w-xl" onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            await submit({ data: { productId: id, author_name: name, rating, comment } });
            toast.success("شكراً لتقييمك");
            setComment("");
            qc.invalidateQueries({ queryKey: ["reviews", id] });
          } catch (err) { toast.error(err instanceof Error ? err.message : "تعذّر الإرسال"); }
          finally { setBusy(false); }
        }}>
          <div className="flex gap-1" role="radiogroup" aria-label="التقييم">
            {[1, 2, 3, 4, 5].map((i) => (
              <button type="button" key={i} onClick={() => setRating(i)} aria-label={`${i} نجوم`}>
                <Star className={`w-6 h-6 ${i <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
              </button>
            ))}
          </div>
          <Input required maxLength={60} placeholder="اسمك" value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea maxLength={1000} placeholder="شاركينا تجربتك" value={comment} onChange={(e) => setComment(e.target.value)} />
          <Button type="submit" disabled={busy}>{busy ? "..." : "إرسال التقييم"}</Button>
        </form>
      ) : (
        <Link to="/auth" className="text-primary underline text-sm">سجّلي الدخول لإضافة تقييم</Link>
      )}
    </section>
  );
}

function Related({ id, category }: { id: string; category: string }) {
  const { data = [] } = useQuery({
    queryKey: ["related", id, category],
    queryFn: () => listProducts({ data: { category, excludeId: id, limit: 4 } }),
  });
  if (!data.length) return null;
  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold mb-4">منتجات قد تعجبك</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{data.map((r) => <ProductCard key={r.id} product={r} />)}</div>
    </section>
  );
}
