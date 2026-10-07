"use client";

import { addToCart } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { toast } from "@/lib/toast";
import { Icon } from "./icon";

export function QuickAdd({ product }: { product: Product }) {
  return (
    <button
      type="button"
      aria-label={`Tambah ${product.name} ke keranjang`}
      onClick={() => {
        const variant = product.variants?.[0]?.label ?? null;
        addToCart(product.slug, variant, 1);
        toast("Masuk keranjang!", variant ? `${product.name} — ${variant}` : product.name);
      }}
      className="grid size-10 shrink-0 place-items-center rounded-xl border border-line-2 bg-panel-2 text-chrome transition hover:border-ignite hover:bg-ignite hover:text-white active:scale-90"
    >
      <Icon name="cart" className="size-[18px]" />
    </button>
  );
}
