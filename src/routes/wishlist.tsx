import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import { useWishlist } from "@/hooks/useWishlist";
import { pageHead } from "@/components/InfoPage";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/wishlist")({
  head: () => pageHead("المفضلة", "المنتجات التي حفظتِها في سو بيوتي."),
  component: Page,
});

function Page() {
  const { items } = useWishlist();
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">المفضلة</h1>
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">لم تحفظي أي منتج بعد.</p>
            <Link to="/products"><Button>تصفّحي المنتجات</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
