import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart } from "lucide-react";
import { resolveProductImage } from "@/lib/product-images";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { formatPrice } from "@/lib/store-info";
import { toast } from "sonner";

export interface ProductCardProduct {
  id: string;
  name: string;
  price: number | string;
  original_price?: number | string | null;
  image_url: string | null;
  stock?: number;
}

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const { add } = useCart();
  const wish = useWishlist();
  const price = Number(product.price);
  const original = product.original_price != null ? Number(product.original_price) : null;
  const stock = product.stock ?? 99;
  const out = stock <= 0;
  const liked = wish.has(product.id);

  return (
    <article className="group bg-card rounded-2xl overflow-hidden border hover:shadow-lg transition-shadow flex flex-col">
      <div className="relative">
        <Link to="/products/$id" params={{ id: product.id }} className="block aspect-square bg-muted overflow-hidden">
          <img src={resolveProductImage(product.image_url)} alt={product.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform ${out ? "opacity-60" : ""}`} loading="lazy" />
        </Link>
        {original && original > price && !out && (
          <span className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
            خصم {Math.round(((original - price) / original) * 100)}%
          </span>
        )}
        {out && (
          <span className="absolute top-2 right-2 bg-foreground text-background text-xs font-bold px-2 py-1 rounded">نفد المخزون</span>
        )}
        <button
          onClick={() => {
            const now = wish.toggle({ id: product.id, name: product.name, price, original_price: original, image_url: product.image_url });
            toast.success(now ? "أُضيف إلى المفضلة" : "أُزيل من المفضلة");
          }}
          aria-label={liked ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
          aria-pressed={liked}
          className="absolute top-2 left-2 w-9 h-9 rounded-full bg-background/90 flex items-center justify-center shadow hover:scale-105 transition"
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-primary text-primary" : ""}`} />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <Link to="/products/$id" params={{ id: product.id }}>
          <h3 className="font-bold text-sm mb-1 line-clamp-2 hover:text-primary">{product.name}</h3>
        </Link>
        {!out && stock <= 5 && <p className="text-xs text-destructive mb-1">متبقي {stock} فقط</p>}
        <div className="flex items-center justify-between gap-2 mt-auto pt-2">
          <div className="min-w-0">
            <span className="text-primary font-bold text-sm">{formatPrice(price)}</span>
            {original && original > price && (
              <span className="block text-xs text-muted-foreground line-through">{formatPrice(original)}</span>
            )}
          </div>
          <button
            disabled={out}
            onClick={() => {
              add({ id: product.id, name: product.name, price, image_url: product.image_url });
              toast.success("أُضيف إلى السلة");
            }}
            className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            aria-label="أضف إلى السلة"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
