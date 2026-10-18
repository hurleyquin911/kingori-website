"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { addToCart } from "@/lib/cart";
import { formatRupiah } from "@/lib/format";
import { hasMultipleVariants, type Product, variantPrice, variantStock } from "@/lib/products";
import { toast } from "@/lib/toast";
import { Icon } from "./icon";

type PanelPos = { left: number; width: number; top?: number; bottom?: number };

export function QuickAdd({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<PanelPos | null>(null);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;

    function place() {
      const el = btnRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const width = Math.min(288, window.innerWidth - 16);
      let left = r.right - width;
      if (left < 8) left = 8;
      if (left + width > window.innerWidth - 8) left = window.innerWidth - width - 8;

      const estimatedHeight = 280;
      const spaceAbove = r.top - 8;
      const spaceBelow = window.innerHeight - r.bottom - 8;
      // Prefer di atas tombol; kalau sempit, buka ke bawah
      if (spaceAbove >= Math.min(estimatedHeight, 160) || spaceAbove >= spaceBelow) {
        setPos({ left, width, bottom: window.innerHeight - r.top + 8 });
      } else {
        setPos({ left, width, top: r.bottom + 8 });
      }
    }

    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  function add(variant: string | null) {
    const stock = variantStock(product, variant);
    if (stock <= 0) {
      toast("Stok habis", variant ? `${variant} sedang kosong` : product.name);
      return;
    }
    addToCart(product.slug, variant, 1);
    toast("Masuk keranjang!", variant ? `${product.name} — ${variant}` : product.name);
    setOpen(false);
  }

  if (!hasMultipleVariants(product)) {
    return (
      <button
        type="button"
        aria-label={`Tambah ${product.name} ke keranjang`}
        onClick={() => add(product.variants?.[0]?.label ?? null)}
        className="grid size-10 shrink-0 place-items-center rounded-xl border border-line-2 bg-panel-2 text-chrome transition hover:border-ignite hover:bg-ignite hover:text-white active:scale-90"
      >
        <Icon name="cart" className="size-[18px]" />
      </button>
    );
  }

  const panel =
    open &&
    mounted &&
    pos &&
    createPortal(
      <>
        <button
          type="button"
          aria-label="Tutup"
          className="fixed inset-0 z-[80] cursor-default bg-black/20"
          onClick={() => setOpen(false)}
        />
        <div
          role="dialog"
          aria-label={`Pilih ${product.variantLabel ?? "varian"}`}
          className="fixed z-[90] overflow-hidden rounded-xl border border-line bg-panel shadow-2xl shadow-black/60"
          style={{
            left: pos.left,
            width: pos.width,
            ...(pos.top != null ? { top: pos.top } : { bottom: pos.bottom }),
          }}
        >
          <p className="border-b border-line px-3 py-2 text-[11px] font-bold tracking-wider text-dim uppercase">
            Pilih {product.variantLabel ?? "varian"}
          </p>
          <ul className="max-h-64 overflow-y-auto overscroll-contain py-1">
            {product.variants!.map((v) => {
              const stock = variantStock(product, v.label);
              const price = variantPrice(product, v.label);
              const empty = stock <= 0;
              return (
                <li key={v.label}>
                  <button
                    type="button"
                    disabled={empty}
                    onClick={() => add(v.label)}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition hover:bg-ignite/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-line bg-carbon">
                      {v.image ? (
                        <img src={v.image} alt="" className="size-full object-cover" />
                      ) : (
                        <span className="grid size-full place-items-center text-[9px] font-bold text-dim">N/A</span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block leading-snug font-semibold break-words text-chrome">{v.label}</span>
                      <span className="mt-0.5 block text-[11px] text-dim">
                        {formatRupiah(price)} · {empty ? "Habis" : `Stok ${stock}`}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <Link
            href={`/produk/${product.slug}`}
            onClick={() => setOpen(false)}
            className="block border-t border-line px-3 py-2.5 text-center text-xs font-semibold text-ignite hover:bg-white/5"
          >
            Lihat detail produk
          </Link>
        </div>
      </>,
      document.body,
    );

  return (
    <div className="relative shrink-0">
      <button
        ref={btnRef}
        type="button"
        aria-label={`Pilih varian ${product.name}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="grid size-10 place-items-center rounded-xl border border-line-2 bg-panel-2 text-chrome transition hover:border-ignite hover:bg-ignite hover:text-white active:scale-90"
      >
        <Icon name="cart" className="size-[18px]" />
      </button>
      {panel}
    </div>
  );
}
