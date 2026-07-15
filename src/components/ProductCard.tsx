import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { resolveProductImage } from "@/lib/product-images";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

export interface ProductCardProduct {
  id: string;
  name: string;
  price: number | string;
  original_price?: number | string | null;
  image_url: string | null;
}

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const { add } = useCart();
  const price = Number(product.price);
  const original = product.original_price != null ? Number(product.original_price) : null;

  return (
    <article className="group bg-card rounded-2xl overflow-hidden border hover:shadow-lg transition-shadow">
      <Link to="/products/$id" params={{ id: product.id }} className="block relative aspect-square bg-muted overflow-hidden">
        <img src={resolveProductImage(product.image_url)} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
        {original && original > price && (
          <span className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
            خصم {Math.round(((original - price) / original) * 100)}%
          </span>
        )}
      </Link>
      <div className="p-4">
        <Link to="/products/$id" params={{ id: product.id }}>
          <h3 className="font-bold text-sm mb-2 line-clamp-2 hover:text-primary">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-primary font-bold">{price} ج.م</span>
            {original && original > price && (
              <span className="text-xs text-muted-foreground line-through mr-2">{original} ج.م</span>
            )}
          </div>
          <button
            onClick={() => {
              add({ id: product.id, name: product.name, price, image_url: product.image_url });
              toast.success("أُضيف إلى السلة");
            }}
            className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90"
            aria-label="أضف إلى السلة"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
