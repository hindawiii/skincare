import { useCallback, useEffect, useSyncExternalStore } from "react";

export interface WishItem {
  id: string;
  name: string;
  price: number;
  original_price?: number | null;
  image_url: string | null;
}

const KEY = "sobeauty_wishlist_v1";
let items: WishItem[] = [];
let hydrated = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    items = Array.isArray(parsed) ? parsed.filter((x) => x && typeof x.id === "string") : [];
  } catch { items = []; }
}
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* ignore */ }
  emit();
}

export function useWishlist() {
  useEffect(() => { hydrate(); emit(); }, []);
  const current = useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => items,
    () => [] as WishItem[],
  );
  const has = useCallback((id: string) => current.some((i) => i.id === id), [current]);
  const toggle = useCallback((p: WishItem) => {
    hydrate();
    items = items.some((i) => i.id === p.id) ? items.filter((i) => i.id !== p.id) : [...items, p];
    persist();
    return items.some((i) => i.id === p.id);
  }, []);
  return { items: current, has, toggle, count: current.length };
}
