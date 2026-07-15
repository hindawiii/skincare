import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function serverClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
  });
}

export const listProducts = createServerFn({ method: "GET" })
  .inputValidator((data: { category?: string } | undefined) => data ?? {})
  .handler(async ({ data }) => {
    const sb = serverClient();
    let q = sb.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false });
    if (data?.category) q = q.eq("category", data.category as never);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const sb = serverClient();
    const { data: row, error } = await sb.from("products").select("*").eq("id", data.id).eq("is_active", true).maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });