"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/icon";
import { ProductStage } from "@/components/product-stage";
import { addToCart } from "@/lib/cart";
import { discountPercent, formatCompact, formatRupiah } from "@/lib/format";
import { variantAccent, type Product } from "@/lib/products";
import { store } from "@/lib/store-config";
import { toast } from "@/lib/toast";

export function ProductShowcase({ product, categoryName }: { product: Product; categoryName: string }) {
  const router = useRouter();
  const [variant, setVariant] = useState<string | null>(product.variants?.[0]?.label ?? null);
  const [qty, setQty] = useState(1);
  const [view, setView] = useState(0);
  const accent = variantAccent(product, variant);
  const discount = discountPercent(product.price, product.originalPrice);
  const views = ["", "scale-125 -rotate-12", "scale-95 rotate-[24deg]"];

  function add() {
    addToCart(product.slug, variant, qty);
    toast("Masuk keranjang!", `${qty}× ${product.name}${variant ? ` — ${variant}` : ""}`);
  }

  function buyNow() {
    addToCart(product.slug, variant, qty);
    router.push("/checkout");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative overflow-hidden rounded-3xl border border-line">
          <ProductStage
            kind={product.art}
            accent={accent}
            className="aspect-square"
            artClassName={`size-[70%] transition duration-500 ${views[view]}`}
          />
          {discount > 0 && (
            <span className="skew-cut absolute top-5 left-0 bg-ignite py-1.5 pr-5 pl-4 font-display text-sm font-bold text-white">
              HEMAT {discount}%
            </span>
          )}
          <span className="absolute right-5 bottom-5 flex items-center gap-1.5 rounded-full border border-turbo/30 bg-asphalt/70 px-3 py-1.5 text-xs font-bold text-turbo backdrop-blur">
            <Icon name="shield" className="size-4" /> Original
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {views.map((v, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Tampilan ${i + 1}`}
              onClick={() => setView(i)}
              className={`overflow-hidden rounded-2xl border-2 transition ${view === i ? "border-ignite" : "border-line hover:border-line-2"}`}
            >
              <ProductStage kind={product.art} accent={accent} watermark={false} className="aspect-[4/3]" artClassName={`size-[62%] ${v}`} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-display text-sm font-semibold tracking-[0.25em] text-ignite uppercase">
          {categoryName} · {product.brand}
        </p>
        <h1 className="mt-2 font-display text-3xl leading-tight font-bold text-white sm:text-4xl">{product.name}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="flex items-center gap-1 text-hazard">
            {Array.from({ length: 5 }, (_, i) => (
              <Icon key={i} name="star" className={`size-4 ${i < Math.round(product.rating) ? "" : "opacity-25"}`} />
            ))}
            <b className="ml-1">{product.rating.toFixed(1)}</b>
          </span>
          <span className="text-steel">{product.reviews.toLocaleString("id-ID")} ulasan</span>
          <span className="text-steel">{formatCompact(product.sold)} terjual</span>
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-gradient-to-r from-ignite/15 via-panel to-panel p-5">
          <div className="flex flex-wrap items-end gap-3">
            <p className="font-display text-4xl font-bold text-ignite">{formatRupiah(product.price)}</p>
            {product.originalPrice && (
              <>
                <p className="pb-1 text-lg text-dim line-through">{formatRupiah(product.originalPrice)}</p>
                <span className="mb-1.5 rounded-md bg-ignite/20 px-2 py-0.5 text-xs font-bold text-ignite">-{discount}%</span>
              </>
            )}
          </div>
          {product.originalPrice && (
            <p className="mt-1 text-sm text-steel">
              Kamu hemat <b className="text-turbo">{formatRupiah(product.originalPrice - product.price)}</b>
            </p>
          )}
        </div>

        <dl className="mt-6 grid gap-3 text-sm">
          <div className="flex gap-3">
            <dt className="w-28 shrink-0 text-dim">Cocok untuk</dt>
            <dd className="font-medium text-chrome">{product.compatibility}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-28 shrink-0 text-dim">Pengiriman</dt>
            <dd className="font-medium text-chrome">
              Dari {store.originProvince} · Berat {product.weight >= 1000 ? `${product.weight / 1000} kg` : `${product.weight} g`}
            </dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-28 shrink-0 text-dim">Promo</dt>
            <dd className="font-medium text-turbo">
              Gratis ongkir s.d. {formatRupiah(store.freeShippingMaxDiscount)} min. belanja {formatRupiah(store.freeShippingMin)}
            </dd>
          </div>
        </dl>

        {product.variants && (
          <div className="mt-7">
            <p className="label">
              {product.variantLabel ?? "Varian"}: <span className="text-white normal-case">{variant}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.label}
                  type="button"
                  onClick={() => setVariant(v.label)}
                  aria-pressed={variant === v.label}
                  className={`flex items-center gap-2 rounded-xl border-2 px-3.5 py-2 text-sm font-semibold transition ${
                    variant === v.label
                      ? "border-ignite bg-ignite/10 text-white"
                      : "border-line-2 text-steel hover:border-steel hover:text-white"
                  }`}
                >
                  {v.accent && (
                    <span className="size-4 rounded-full ring-2 ring-white/20" style={{ background: v.accent }} />
                  )}
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-7">
          <p className="label">Jumlah</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-xl border border-line-2 bg-carbon">
              <button
                type="button"
                aria-label="Kurangi"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid size-11 place-items-center text-steel hover:text-white disabled:opacity-30"
                disabled={qty <= 1}
              >
                <Icon name="minus" className="size-4" />
              </button>
              <input
                aria-label="Jumlah"
                inputMode="numeric"
                value={qty}
                onChange={(e) => {
                  const n = Number(e.target.value.replace(/\D/g, ""));
                  setQty(Math.max(1, Math.min(product.stock, n || 1)));
                }}
                className="w-12 bg-transparent text-center font-display text-lg font-bold outline-none"
              />
              <button
                type="button"
                aria-label="Tambah"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="grid size-11 place-items-center text-steel hover:text-white disabled:opacity-30"
                disabled={qty >= product.stock}
              >
                <Icon name="plus" className="size-4" />
              </button>
            </div>
            <p className="text-sm text-steel">
              Stok <b className={product.stock < 30 ? "text-hazard" : "text-white"}>{product.stock}</b>
              {product.stock < 30 && " · segera habis!"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={add} className="btn-ghost w-full py-4">
            <Icon name="cart" className="size-4" /> Tambah ke Keranjang
          </button>
          <button type="button" onClick={buyNow} className="btn-ignite w-full py-4">
            <Icon name="bolt" className="size-4" /> Beli Sekarang
          </button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-steel">
          {[
            ["shield", "100% Original"],
            ["wrench", "Garansi Tukar 7 Hari"],
            ["truck", "Kirim Hari Ini*"],
          ].map(([icon, label]) => (
            <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl border border-line bg-panel px-2 py-3">
              <Icon name={icon as "shield"} className="size-5 text-ignite" />
              {label}
            </div>
          ))}
        </div>

        <a
          href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(`Halo King Ori, saya mau tanya produk: ${product.name}${variant ? ` (${variant})` : ""}`)}`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex items-center gap-3 rounded-xl border border-line bg-panel p-3 text-sm transition hover:border-turbo/50"
        >
          <span className="grid size-10 place-items-center rounded-lg bg-turbo/15 text-turbo">
            <Icon name="whatsapp" />
          </span>
          <span className="flex-1">
            <b className="block text-white">Tanya stok / kecocokan part</b>
            <span className="text-steel">Chat admin King Ori via WhatsApp</span>
          </span>
          <Icon name="chevronRight" className="size-4 text-dim" />
        </a>
      </div>
    </div>
  );
}
