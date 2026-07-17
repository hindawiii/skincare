import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { listProducts } from "@/lib/products.functions";

const productsQuery = queryOptions({
  queryKey: ["products", "all"],
  queryFn: () => listProducts({ data: {} }),
});

export const Route = createFileRoute("/products")({
  head: () => ({ meta: [{ title: "المنتجات — So Beauty" }, { name: "description", content: "تسوّق مجموعتنا الكاملة من منتجات العناية الطبيعية بالبشرة." }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: ProductsPage,
  errorComponent: ({ error }) => <div className="p-8 text-center">حدث خطأ: {error.message}</div>,
  notFoundComponent: () => <div className="p-8 text-center">غير موجود</div>,
});

function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">جميع المنتجات</h1>
        <Suspense fallback={<div>جاري التحميل...</div>}>
          <List />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}

function List() {
  const { data } = useSuspenseQuery(productsQuery);
  if (!data.length) return <p>لا توجد منتجات.</p>;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}