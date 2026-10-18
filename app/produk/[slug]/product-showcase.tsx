"use client";

/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { ProductStage } from "@/components/product-stage";
import { addToCart } from "@/lib/cart";
import { discountPercent, formatCompact, formatRupiah } from "@/lib/format";
import { getVariant, variantPrice, variantStock, type Product } from "@/lib/products";
import { store } from "@/lib/store-config";
import { toast } from "@/lib/toast";

type GalleryItem = { src: string; variantLabel?: string };

function buildGallery(product: Product): GalleryItem[] {
  const items: GalleryItem[] = [];
  const seen = new Set<string>();

  // Foto per-varian dulu — ini yang harus sinkron dengan pilihan
  for (const v of product.variants ?? []) {
    if (!v.image || seen.has(v.image)) continue;
    seen.add(v.image);
    items.push({ src: v.image, variantLabel: v.label });
  }

  for (const src of product.images ?? []) {
    if (!src || seen.has(src)) continue;
    seen.add(src);
    items.push({ src });
  }

  if (product.image && !seen.has(product.image)) {
    items.push({ src: product.image });
  }

  return items;
}

export function ProductShowcase({ product, categoryName }: { product: Product; categoryName: string }) {
  const router = useRouter();
  const [variant, setVariant] = useState<string | null>(product.variants?.[0]?.label ?? null);
  const [qty, setQty] = useState(1);
  /** null = ikuti foto varian; angka = user memilih thumbnail galeri secara manual */
  const [manualView, setManualView] = useState<number | null>(null);

  const unitPrice = variantPrice(product, variant);
  const stock = variantStock(product, variant);
  const discount = discountPercent(unitPrice, product.originalPrice);
  const gallery = useMemo(() => buildGallery(product), [product]);
  const selected = getVariant(product, variant);
  const variantImg = selected?.image ?? null;

  const activeImage = useMemo(() => {
    if (manualView != null) return gallery[manualView]?.src ?? product.image ?? null;
    if (variantImg) return variantImg;
    return gallery[0]?.src ?? product.image ?? null;
  }, [manualView, gallery, variantImg, product.image]);

  const activeThumb = useMemo(() => {
    if (manualView != null) return manualView;
    if (variantImg) {
      const idx = gallery.findIndex((g) => g.src === variantImg);
      if (idx >= 0) return idx;
    }
    return 0;
  }, [manualView, variantImg, gallery]);

  const hasAnyVariantPhoto = (product.variants ?? []).some((v) => Boolean(v.image));

  useEffect(() => {
    setQty((q) => Math.min(Math.max(1, q), Math.max(1, stock)));
  }, [stock, variant]);

  function selectVariant(label: string) {
    setVariant(label);
    setManualView(null);
  }

  function selectGallery(index: number) {
    const item = gallery[index];
    if (!item) return;
    if (item.variantLabel) {
      setVariant(item.variantLabel);
      setManualView(null);
      return;
    }
    setManualView(index);
  }

  function add() {
    if (product.variants?.length && !variant) {
      toast("Pilih varian dulu", `Pilih ${product.variantLabel ?? "varian"} sebelum menambah ke keranjang`);
      return;
    }
    if (stock <= 0) {
      toast("Stok habis", variant ? `${variant} sedang kosong` : product.name);
      return;
    }
    addToCart(product.slug, variant, qty);
    toast("Masuk keranjang!", `${qty}× ${product.name}${variant ? ` — ${variant}` : ""}`);
  }

  function buyNow() {
    if (product.variants?.length && !variant) {
      toast("Pilih varian dulu", `Pilih ${product.variantLabel ?? "varian"} sebelum checkout`);
      return;
    }
    if (stock <= 0) {
      toast("Stok habis", variant ? `${variant} sedang kosong` : product.name);
      return;
    }
    addToCart(product.slug, variant, qty);
    router.push("/checkout");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative overflow-hidden rounded-3xl border border-line">
          <ProductStage
            key={`${variant ?? "none"}:${activeImage ?? "art"}`}
            kind={product.art}
            accent={product.accent}
            image={activeImage}
            className="aspect-square"
            artClassName="size-[70%] transition duration-500"
          />
          {discount > 0 && (
            <span className="skew-cut absolute top-5 left-0 bg-ignite py-1.5 pr-5 pl-4 font-display text-sm font-bold text-white">
              HEMAT {discount}%
            </span>
          )}
          <span className="absolute right-5 bottom-5 flex items-center gap-1.5 rounded-full border border-turbo/30 bg-asphalt/70 px-3 py-1.5 text-xs font-bold text-turbo backdrop-blur">
            <Icon name="shield" className="size-4" /> Original
          </span>
          {variant && variantImg && (
            <span className="absolute top-5 right-5 max-w-[55%] truncate rounded-full border border-ignite/40 bg-asphalt/85 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
              {variant}
            </span>
          )}
          {variant && !variantImg && hasAnyVariantPhoto === false && (product.variants?.length ?? 0) > 1 && (
            <span className="absolute top-5 right-5 max-w-[65%] rounded-full border border-hazard/40 bg-asphalt/85 px-3 py-1 text-[11px] font-semibold text-hazard backdrop-blur">
              Foto per-varian belum ada di data toko
            </span>
          )}
        </div>
        {gallery.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
            {gallery.map((item, i) => (
              <button
                key={`${item.src}-${i}`}
                type="button"
                aria-label={item.variantLabel ? `Varian ${item.variantLabel}` : `Foto produk ${i + 1}`}
                aria-pressed={activeThumb === i}
                title={item.variantLabel ?? `Foto ${i + 1}`}
                onClick={() => selectGallery(i)}
                className={`relative overflow-hidden rounded-xl border-2 transition ${
                  activeThumb === i ? "border-ignite" : "border-line hover:border-line-2"
                }`}
              >
                <ProductStage
                  kind={product.art}
                  accent={product.accent}
                  image={item.src}
                  watermark={false}
                  className="aspect-square"
                  artClassName="size-[62%]"
                  imageClassName="size-full object-cover p-0"
                />
                {item.variantLabel && (
                  <span className="absolute inset-x-0 bottom-0 truncate bg-asphalt/80 px-1 py-0.5 text-center text-[9px] font-semibold text-white">
                    {item.variantLabel}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
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
          {product.reviews > 0 && (
            <span className="text-steel">{product.reviews.toLocaleString("id-ID")} ulasan</span>
          )}
          {product.sold > 0 && <span className="text-steel">{formatCompact(product.sold)} terjual</span>}
          <span className="text-steel">Stok {product.stock}</span>
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-gradient-to-r from-ignite/15 via-panel to-panel p-5">
          <div className="flex flex-wrap items-end gap-3">
            <p className="font-display text-4xl font-bold text-ignite">{formatRupiah(unitPrice)}</p>
            {product.originalPrice && product.originalPrice > unitPrice && (
              <>
                <p className="pb-1 text-lg text-dim line-through">{formatRupiah(product.originalPrice)}</p>
                <span className="mb-1.5 rounded-md bg-ignite/20 px-2 py-0.5 text-xs font-bold text-ignite">-{discount}%</span>
              </>
            )}
          </div>
          {variant && product.variants && product.variants.length > 1 && (
            <p className="mt-1 text-sm text-steel">
              Harga untuk varian <b className="text-white">{variant}</b>
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

        {product.variants && product.variants.length > 0 && (
          <div className="mt-7">
            <p className="label">
              {product.variantLabel ?? "Varian"}
              {variant ? (
                <>
                  : <span className="text-white normal-case">{variant}</span>
                </>
              ) : null}
            </p>
            {!hasAnyVariantPhoto && product.variants.length > 1 && (
              <p className="mb-2 text-xs text-hazard">
                Foto per opsi belum diunggah di Shopee — gambar utama tidak berubah saat ganti varian.
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => {
                const vStock = variantStock(product, v.label);
                const vPrice = variantPrice(product, v.label);
                const empty = vStock <= 0;
                const active = variant === v.label;
                return (
                  <button
                    key={v.label}
                    type="button"
                    disabled={empty}
                    onClick={() => selectVariant(v.label)}
                    aria-pressed={active}
                    className={`flex min-w-[10.5rem] items-center gap-2.5 rounded-xl border-2 p-2 pr-3 text-left text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      active
                        ? "border-ignite bg-ignite/10 text-white"
                        : "border-line-2 text-steel hover:border-steel hover:text-white"
                    }`}
                  >
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-line bg-carbon">
                      {v.image ? (
                        <img src={v.image} alt="" className="size-full object-cover" />
                      ) : (
                        <span className="grid size-full place-items-center text-[10px] font-bold text-dim">N/A</span>
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block leading-snug">{v.label}</span>
                      <span className="mt-0.5 block text-[11px] font-medium text-dim">
                        {formatRupiah(vPrice)} · {empty ? "Habis" : `Stok ${vStock}`}
                      </span>
                    </span>
                  </button>
                );
              })}
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
                  setQty(Math.max(1, Math.min(stock, n || 1)));
                }}
                className="w-12 bg-transparent text-center font-display text-lg font-bold outline-none"
              />
              <button
                type="button"
                aria-label="Tambah"
                onClick={() => setQty((q) => Math.min(stock, q + 1))}
                className="grid size-11 place-items-center text-steel hover:text-white disabled:opacity-30"
                disabled={qty >= stock || stock <= 0}
              >
                <Icon name="plus" className="size-4" />
              </button>
            </div>
            <p className="text-sm text-steel">
              Stok <b className={stock < 30 ? "text-hazard" : "text-white"}>{stock}</b>
              {stock > 0 && stock < 30 && " · segera habis!"}
              {stock <= 0 && <span className="text-red-400"> · habis</span>}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={add} disabled={stock <= 0} className="btn-ghost w-full py-4 disabled:opacity-40">
            <Icon name="cart" className="size-4" /> Tambah ke Keranjang
          </button>
          <button type="button" onClick={buyNow} disabled={stock <= 0} className="btn-ignite w-full py-4 disabled:opacity-40">
            <Icon name="bolt" className="size-4" /> Beli Sekarang
          </button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-steel">
          {[
            ["shield", "100% Original"],
            ["whatsapp", "Checkout via WhatsApp"],
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
