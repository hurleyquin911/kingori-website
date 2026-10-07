"use client";

import { createLocalStore } from "./local-store";
import { getProduct, type Product } from "./products";

export type CartItem = {
  key: string;
  slug: string;
  variant: string | null;
  qty: number;
};

export type CartLine = CartItem & { product: Product; lineTotal: number };

const EMPTY: CartItem[] = [];
const cartStore = createLocalStore<CartItem[]>("kingori-cart-v1", EMPTY);

export function addToCart(slug: string, variant: string | null, qty = 1) {
  const product = getProduct(slug);
  if (!product) return;
  const key = `${slug}::${variant ?? ""}`;
  cartStore.set((items) => {
    const existing = items.find((i) => i.key === key);
    if (existing) {
      return items.map((i) =>
        i.key === key ? { ...i, qty: Math.min(product.stock, i.qty + qty) } : i,
      );
    }
    return [...items, { key, slug, variant, qty: Math.min(product.stock, qty) }];
  });
}

export function setCartQty(key: string, qty: number) {
  cartStore.set((items) =>
    items.map((i) => {
      if (i.key !== key) return i;
      const stock = getProduct(i.slug)?.stock ?? 99;
      return { ...i, qty: Math.max(1, Math.min(stock, qty)) };
    }),
  );
}

export function removeFromCart(key: string) {
  cartStore.set((items) => items.filter((i) => i.key !== key));
}

export function clearCart() {
  cartStore.set(EMPTY);
}

export function useCart() {
  const items = cartStore.useValue();
  const lines: CartLine[] = [];
  for (const item of items) {
    const product = getProduct(item.slug);
    if (product) lines.push({ ...item, product, lineTotal: product.price * item.qty });
  }
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  const weight = lines.reduce((n, l) => n + l.product.weight * l.qty, 0);
  return { lines, count, subtotal, weight };
}
