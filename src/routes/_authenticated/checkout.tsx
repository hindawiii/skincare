import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useCart } from "@/hooks/useCart";
import { createOrder, getMyProfile } from "@/lib/orders.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/checkout")({
  head: () => ({ meta: [{ title: "إتمام الشراء — Moonflower" }] }),
  component: Checkout,
});

function Checkout() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const submit = useServerFn(createOrder);
  const loadProfile = useServerFn(getMyProfile);
  const [form, setForm] = useState({ full_name: "", phone: "", shipping_address: "", city: "", notes: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile().then((p) => {
      if (p) setForm((f) => ({ ...f, full_name: p.full_name ?? "", phone: p.phone ?? "", shipping_address: p.address ?? "", city: p.city ?? "" }));
    }).catch(() => {});
  }, [loadProfile]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) { toast.error("السلة فارغة"); return; }
    setLoading(true);
    try {
      await submit({ data: { ...form, items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })) } });
      clear();
      toast.success("تم إنشاء الطلب بنجاح");
      navigate({ to: "/orders" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطأ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">إتمام الشراء</h1>
        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div><Label>الاسم الكامل</Label><Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
            <div><Label>رقم الهاتف</Label><Input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div><Label>المدينة</Label><Input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div><Label>عنوان الشحن</Label><Textarea required value={form.shipping_address} onChange={(e) => setForm({ ...form, shipping_address: e.target.value })} /></div>
            <div><Label>ملاحظات (اختياري)</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          </div>
          <div className="p-6 border rounded-xl h-fit">
            <h2 className="font-bold mb-4">ملخص الطلب</h2>
            {items.map((i) => (
              <div key={i.id} className="flex justify-between text-sm py-1">
                <span>{i.name} × {i.quantity}</span><span>{(i.price * i.quantity).toFixed(2)} ج.م</span>
              </div>
            ))}
            <div className="border-t mt-3 pt-3 flex justify-between font-bold"><span>الإجمالي</span><span>{total.toFixed(2)} ج.م</span></div>
            <Button type="submit" className="w-full mt-4" disabled={loading || items.length === 0}>{loading ? "..." : "تأكيد الطلب"}</Button>
          </div>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}