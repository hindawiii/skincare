import { useCallback, useEffect, useSyncExternalStore } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
}

export const MAX_QTY = 50;
const KEY = "sobeauty_cart_v1";
let items: CartItem[] = [];
const listeners = new Set<() => void>();
let hydrated = false;

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage full or blocked — keep in memory */
  }
  emit();
}

function isItem(x: unknown): x is CartItem {
  const o = x as CartItem;
  return !!o && typeof o.id === "string" && typeof o.name === "string" && typeof o.price === "number" && typeof o.quantity === "number";
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    items = Array.isArray(parsed)
      ? parsed.filter(isItem).map((i) => ({ ...i, quantity: clampQty(i.quantity) }))
      : [];
  } catch {
    items = [];
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  load();
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) { load(); emit(); }
  });
}

export function clampQty(q: number) {
  return Math.min(MAX_QTY, Math.max(1, Math.floor(q) || 1));
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
const getSnapshot = () => items;
const getServerSnapshot = (): CartItem[] => [];

export function useCart() {
  useEffect(() => { hydrate(); emit(); }, []);
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const add = useCallback((p: Omit<CartItem, "quantity">, qty = 1) => {
    hydrate();
    const exists = items.some((i) => i.id === p.id);
    items = exists
      ? items.map((i) => (i.id === p.id ? { ...i, ...p, quantity: clampQty(i.quantity + qty) } : i))
      : [...items, { ...p, quantity: clampQty(qty) }];
    persist();
  }, []);

  const remove = useCallback((id: string) => {
    items = items.filter((i) => i.id !== id);
    persist();
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    items = items.map((i) => (i.id === id ? { ...i, quantity: clampQty(qty) } : i));
    persist();
  }, []);

  const clear = useCallback(() => { items = []; persist(); }, []);

  const count = current.reduce((s, i) => s + i.quantity, 0);
  const total = current.reduce((s, i) => s + i.quantity * i.price, 0);
  return { items: current, add, remove, setQty, clear, count, total };
}
