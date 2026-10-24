import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { listProducts } from "@/lib/products.functions";
import { CATEGORIES, SKIN_TYPES } from "@/lib/store-info";

const productsQuery = queryOptions({
  queryKey: ["products", "all"],
  queryFn: () => listProducts({ data: {} }),
});

type Sort = "new" | "price_asc" | "price_desc" | "discount";
const SORTS: { value: Sort; label: string }[] = [
  { value: "new", label: "الأحدث" },
  { value: "price_asc", label: "السعر: من الأقل" },
  { value: "price_desc", label: "السعر: من الأعلى" },
  { value: "discount", label: "أعلى خصم" },
];

export const Route = createFileRoute("/products")({
  validateSearch: (s: Record<string, unknown>): { q?: string; category?: string; skin?: string; sort?: Sort } => ({
    q: typeof s.q === "string" && s.q ? s.q : undefined,
    category: typeof s.category === "string" && s.category ? s.category : undefined,
    skin: typeof s.skin === "string" && s.skin ? s.skin : undefined,
    sort: SORTS.some((x) => x.value === s.sort) ? (s.sort as Sort) : undefined,
  }),
  head: () => ({ meta: [
    { title: "المنتجات — So Beauty" },
    { name: "description", content: "تسوّقي العناية بالبشرة والشعر وأجهزة الشعر والجسم والعطور من سو بيوتي." },
    { property: "og:title", content: "المنتجات — So Beauty" },
    { property: "og:description", content: "تسوّقي العناية بالبشرة والشعر وأجهزة الشعر والجسم والعطور من سو بيوتي." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: ProductsPage,
  errorComponent: ({ error }) => <div className="p-8 text-center">حدث خطأ: {error instanceof Error ? error.message : "حدث خطأ"}</div>,
  notFoundComponent: () => <div className="p-8 text-center">غير موجود</div>,
});

function ProductsPage() {
  const search = Route.useSearch();
  const cat = CATEGORIES.find((c) => c.value === search.category);
  const skin = SKIN_TYPES.find((c) => c.value === search.skin);
  const title = search.q ? `نتائج البحث عن: ${search.q}` : skin?.label ?? cat?.label ?? "جميع المنتجات";
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-5">{title}</h1>
        <Filters />
        <Suspense fallback={<div>جاري التحميل...</div>}>
          <List />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}

function Chip({ active, children, search }: { active: boolean; children: React.ReactNode; search: { q?: string; category?: string; skin?: string; sort?: Sort } }) {
  return (
    <Link
      to="/products"
      search={search}
      className={`px-3 py-1.5 rounded-full text-xs sm:text-sm border whitespace-nowrap transition-colors ${active ? "bg-primary text-primary-foreground border-primary" : "hover:border-primary"}`}
    >
      {children}
    </Link>
  );
}

function Filters() {
  const s = Route.useSearch();
  return (
    <div className="space-y-3 mb-6">
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Chip active={!s.category} search={{ ...s, category: undefined }}>الكل</Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c.value} active={s.category === c.value} search={{ ...s, category: c.value }}>{c.label}</Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-2 overflow-x-auto pb-1 flex-1 min-w-0">
          {SKIN_TYPES.map((c) => (
            <Chip key={c.value} active={s.skin === c.value} search={{ ...s, skin: s.skin === c.value ? undefined : c.value }}>{c.label}</Chip>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">الترتيب</span>
          <SortSelect />
        </label>
      </div>
    </div>
  );
}

function SortSelect() {
  const s = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <select
      value={s.sort ?? "new"}
      onChange={(e) => navigate({ search: { ...s, sort: e.target.value === "new" ? undefined : (e.target.value as Sort) } })}
      className="h-9 rounded-full border bg-background px-3 text-sm"
    >
      {SORTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function List() {
  const { q, category, skin, sort } = Route.useSearch();
  const { data } = useSuspenseQuery(productsQuery);
  const term = q?.trim().toLowerCase() ?? "";
  let rows = data.filter((p) => {
    if (category && p.category !== category) return false;
    if (skin && !(p.skin_types ?? []).includes(skin)) return false;
    if (term && ![p.name, p.description ?? "", p.ingredients ?? ""].join(" ").toLowerCase().includes(term)) return false;
    return true;
  });
  const disc = (p: (typeof data)[number]) => (p.original_price ? 1 - Number(p.price) / Number(p.original_price) : 0);
  if (sort === "price_asc") rows = [...rows].sort((a, b) => Number(a.price) - Number(b.price));
  if (sort === "price_desc") rows = [...rows].sort((a, b) => Number(b.price) - Number(a.price));
  if (sort === "discount") rows = [...rows].sort((a, b) => disc(b) - disc(a));

  if (!rows.length)
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="mb-2">لا توجد منتجات في هذا القسم حالياً — نضيف منتجات جديدة قريباً.</p>
        <Link to="/products" className="text-primary underline">عرض كل المنتجات</Link>
      </div>
    );
  return (
    <>
      <p className="text-sm text-muted-foreground mb-3">{rows.length} منتج</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {rows.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </>
  );
}
