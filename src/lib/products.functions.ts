import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function serverClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
  });
}

type Category = Database["public"]["Enums"]["product_category"];

const listSchema = z
  .object({
    category: z.string().max(30).optional(),
    discounted: z.boolean().optional(),
    excludeId: z.string().uuid().optional(),
    limit: z.number().int().min(1).max(100).optional(),
  })
  .optional();

export const listProducts = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => listSchema.parse(data) ?? {})
  .handler(async ({ data }) => {
    const sb = serverClient();
    let q = sb.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false });
    if (data.category) q = q.eq("category", data.category as Category);
    if (data.excludeId) q = q.neq("id", data.excludeId);
    if (data.limit) q = q.limit(data.limit);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    let out = rows ?? [];
    if (data.discounted) {
      out = out.filter((p) => p.category === "offer" || (p.original_price != null && Number(p.original_price) > Number(p.price)));
    }
    return out;
  });

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const sb = serverClient();
    const { data: row, error } = await sb.from("products").select("*").eq("id", data.id).eq("is_active", true).maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const listReviews = createServerFn({ method: "GET" })
  .inputValidator((data: { productId: string }) => z.object({ productId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const sb = serverClient();
    const { data: rows, error } = await sb
      .from("reviews")
      .select("id, author_name, rating, comment, created_at")
      .eq("product_id", data.productId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

const reviewSchema = z.object({
  productId: z.string().uuid(),
  author_name: z.string().trim().min(1).max(60),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});

export const addReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => reviewSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("reviews").upsert(
      {
        product_id: data.productId,
        user_id: context.userId,
        author_name: data.author_name,
        rating: data.rating,
        comment: data.comment || null,
      },
      { onConflict: "product_id,user_id" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });
