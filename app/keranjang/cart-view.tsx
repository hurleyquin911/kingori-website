"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { ProductArt } from "@/components/product-art";
import { QtyStepper } from "@/components/qty-stepper";
import { removeFromCart, setCartQty, useCart } from "@/lib/cart";
import { formatRupiah } from "@/lib/format";
import { useHydrated } from "@/lib/local-store";
import { variantAccent } from "@/lib/products";
import { store } from "@/lib/store-config";

export function CartView() {
  const hydrated = useHydrated();
  const { lines, count, subtotal, weight } = useCart();

  if (!hydrated) {
    return <div className="card h-80 animate-pulse" />;
  }

  if (lines.length === 0) {
    return <EmptyCart />;
  }

  const remaining = store.freeShippingMin - subtotal;
  const progress = Math.min(100, (subtotal / store.freeShippingMin) * 100);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="card divide-y divide-line">
        <div className="flex items-center justify-between px-5 py-4 sm:px-6">
          <p className="font-display font-bold tracking-wide text-white uppercase">{count} barang</p>
          <Link href="/produk" className="text-sm font-semibold text-ignite hover:underline">
            + Tambah produk lain
          </Link>
        </div>
        {lines.map((l) => (
          <div key={l.key} className="flex gap-4 px-5 py-5 sm:px-6">
            <Link href={`/produk/${l.slug}`} className="grid size-24 shrink-0 place-items-center rounded-xl bg-carbon ring-1 ring-line sm:size-28">
              <ProductArt kind={l.product.art} accent={variantAccent(l.product, l.variant)} className="size-[80%]" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex gap-3">
                <div className="min-w-0 flex-1">
                  <Link href={`/produk/${l.slug}`} className="line-clamp-2 font-semibold text-white hover:text-ignite">
                    {l.product.name}
                  </Link>
                  {l.variant && (
                    <p className="mt-1 inline-flex rounded-md bg-white/5 px-2 py-0.5 text-xs text-steel">
                      {l.product.variantLabel ?? "Varian"}: {l.variant}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Hapus dari keranjang"
                  onClick={() => removeFromCart(l.key)}
                  className="grid size-9 shrink-0 place-items-center rounded-lg text-dim transition hover:bg-red-500/10 hover:text-red-400"
                >
                  <Icon name="trash" className="size-4" />
                </button>
              </div>
              <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
                <QtyStepper value={l.qty} max={l.product.stock} onChange={(n) => setCartQty(l.key, n)} />
                <div className="text-right">
                  <p className="text-xs text-dim">{formatRupiah(l.product.price)} / pcs</p>
                  <p className="font-display text-lg font-bold text-white">{formatRupiah(l.lineTotal)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card overflow-hidden">
          <div className="border-b border-line p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-chrome">
              <Icon name="truck" className="size-4 text-ignite" />
              {remaining > 0 ? (
                <>
                  Tambah <b className="text-hazard">{formatRupiah(remaining)}</b> lagi untuk gratis ongkir
                </>
              ) : (
                <span className="text-turbo">Yeay! Kamu dapat gratis ongkir s.d. {formatRupiah(store.freeShippingMaxDiscount)}</span>
              )}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-carbon">
              <div
                className="h-full rounded-full bg-gradient-to-r from-hazard to-ignite transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="space-y-3 p-5 text-sm">
            <Row label={`Subtotal (${count} barang)`} value={formatRupiah(subtotal)} />
            <Row label="Estimasi berat" value={`${(weight / 1000).toLocaleString("id-ID", { maximumFractionDigits: 2 })} kg`} />
            <Row label="Ongkos kirim" value="Dihitung saat checkout" muted />
            <div className="flex items-end justify-between border-t border-dashed border-line-2 pt-4">
              <span className="font-semibold text-steel">Total sementara</span>
              <span className="font-display text-2xl font-bold text-ignite">{formatRupiah(subtotal)}</span>
            </div>
            <Link href="/checkout" className="btn-ignite mt-2 w-full py-4">
              Lanjut ke Checkout <Icon name="arrowRight" className="size-4" />
            </Link>
            <p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-dim">
              <Icon name="shield" className="size-3.5" /> Bayar via transfer bank atau QRIS
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-steel">{label}</span>
      <span className={muted ? "text-dim" : "font-semibold text-white"}>{value}</span>
    </div>
  );
}

export function EmptyCart() {
  return (
    <div className="card relative grid place-items-center overflow-hidden px-6 py-20 text-center">
      <div className="hazard absolute inset-x-0 top-0 h-1.5 opacity-80" />
      <ProductArt kind="tire" accent="#ff4a1c" className="size-32" />
      <p className="mt-4 font-display text-2xl font-bold text-white uppercase italic">Keranjang masih kosong</p>
      <p className="mt-1 max-w-sm text-steel">Garasimu butuh upgrade? Yuk isi keranjang dengan part & aksesoris original.</p>
      <Link href="/produk" className="btn-ignite mt-6">
        Mulai Belanja <Icon name="arrowRight" className="size-4" />
      </Link>
    </div>
  );
}
