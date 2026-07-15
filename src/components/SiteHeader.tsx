import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { count } = useCart();
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const nav = [
    { to: "/", label: "الرئيسية" },
    { to: "/products", label: "المنتجات" },
    { to: "/offers", label: "العروض" },
    { to: "/boxes", label: "بوكسات العناية" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="text-2xl font-black text-primary">Moonflower</Link>

        <nav className="hidden md:flex items-center gap-6">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm font-semibold hover:text-primary transition-colors"
              activeProps={{ className: "text-primary" }} activeOptions={{ exact: n.to === "/" }}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative p-2 rounded-full hover:bg-muted">
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1 -left-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">{count}</span>
            )}
          </Link>
          {email ? (
            <>
              <Link to="/account" className="hidden sm:inline-flex">
                <Button variant="ghost" size="sm"><User className="w-4 h-4 ml-1" />حسابي</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={async () => { await supabase.auth.signOut(); window.location.href = "/"; }}>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Link to="/auth"><Button size="sm">تسجيل الدخول</Button></Link>
          )}
          <button className="md:hidden p-2" onClick={() => setOpen((v) => !v)} aria-label="menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-3">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="text-sm font-semibold py-1">{n.label}</Link>
            ))}
            {email && <Link to="/account" onClick={() => setOpen(false)} className="text-sm font-semibold py-1">حسابي</Link>}
            {email && <Link to="/orders" onClick={() => setOpen(false)} className="text-sm font-semibold py-1">طلباتي</Link>}
          </div>
        </nav>
      )}
    </header>
  );
}
