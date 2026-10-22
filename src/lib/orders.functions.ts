import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const itemSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().min(1).max(50),
});

const createOrderSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(20),
  shipping_address: z.string().trim().min(5).max(500),
  city: z.string().trim().min(2).max(100),
  notes: z.string().trim().max(500).optional(),
  items: z.array(itemSchema).min(1).max(50),
});

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => createOrderSchema.parse(data))
  .handler(async ({ data, context }) => {
    // Atomic: validates stock, uses DB prices, decrements stock, all-or-nothing.
    const { data: res, error } = await context.supabase.rpc("place_order", {
      _full_name: data.full_name,
      _phone: data.phone,
      _shipping_address: data.shipping_address,
      _city: data.city,
      _notes: data.notes ?? "",
      _items: data.items,
    });
    if (error) throw new Error(error.message);
    const r = res as { order_id: string; total: number };
    return { orderId: r.order_id, total: Number(r.total) };
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select("id, total, status, created_at, order_items(id, product_name, quantity, unit_price)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

const profileSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().max(20).optional().nullable(),
  address: z.string().trim().max(500).optional().nullable(),
  city: z.string().trim().max(100).optional().nullable(),
});

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => profileSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .upsert({ id: context.userId, ...data });
    if (error) throw new Error(error.message);
    return { ok: true };
  });