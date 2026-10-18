"use client";

import { createLocalStore } from "./local-store";
import { getProduct, variantPrice, variantStock, type Product } from "./products";

export type CartItem = {
  key: string;
  slug: string;
  variant: string | null;
  qty: number;
};

export type CartLine = CartItem & {
  product: Product;
  unitPrice: number;
  lineTotal: number;
  stock: number;
};

const EMPTY: CartItem[] = [];
const cartStore = createLocalStore<CartItem[]>("kingori-cart-v1", EMPTY);

export function addToCart(slug: string, variant: string | null, qty = 1) {
  const product = getProduct(slug);
  if (!product) return;
  const stock = variantStock(product, variant);
  if (stock <= 0) return;
  const key = `${slug}::${variant ?? ""}`;
  cartStore.set((items) => {
    const existing = items.find((i) => i.key === key);
    if (existing) {
      return items.map((i) =>
        i.key === key ? { ...i, qty: Math.min(stock, i.qty + qty) } : i,
      );
    }
    return [...items, { key, slug, variant, qty: Math.min(stock, qty) }];
  });
}

export function setCartQty(key: string, qty: number) {
  cartStore.set((items) =>
    items.map((i) => {
      if (i.key !== key) return i;
      const product = getProduct(i.slug);
      const stock = product ? variantStock(product, i.variant) : 99;
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
    if (!product) continue;
    const unitPrice = variantPrice(product, item.variant);
    const stock = variantStock(product, item.variant);
    lines.push({
      ...item,
      product,
      unitPrice,
      stock,
      lineTotal: unitPrice * item.qty,
    });
  }
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  const weight = lines.reduce((n, l) => n + l.product.weight * l.qty, 0);
  return { lines, count, subtotal, weight };
}
