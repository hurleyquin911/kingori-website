"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { ProductArt } from "@/components/product-art";
import { formatRupiah } from "@/lib/format";
import { products } from "@/lib/products";

export function ProfitCalculator() {
  const [slug, setSlug] = useState(products[0].slug);
  const product = products.find((p) => p.slug === slug) ?? products[0];
  const suggested = Math.ceil((product.price * 1.25) / 1_000) * 1_000;
  const [sellPrice, setSellPrice] = useState<number | null>(null);
  const [perDay, setPerDay] = useState(5);

  const sell = sellPrice ?? suggested;
  const profit = sell - product.price;
  const margin = sell > 0 ? Math.round((profit / sell) * 100) : 0;
  const monthly = profit * perDay * 30;

  return (
    <div className="card relative overflow-hidden">
      <div className="hazard absolute inset-x-0 top-0 h-1.5" />
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-5">
          <div>
            <label htmlFor="calc-product" className="label">
              Produk yang mau kamu jual
            </label>
            <div className="relative">
              <select
                id="calc-product"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSellPrice(null);
                }}
                className="field cursor-pointer appearance-none pr-10"
              >
                {products.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
              <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-dim" />
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-line bg-carbon p-4">
            <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-panel">
              <ProductArt kind={product.art} accent={product.accent} className="size-14" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-dim">Harga modal dari King Ori</p>
              <p className="font-display text-2xl font-bold text-white">{formatRupiah(product.price)}</p>
              {product.originalPrice && (
                <p className="text-xs text-steel">
                  Harga pasaran ± <span className="text-chrome">{formatRupiah(product.originalPrice)}</span>
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="calc-sell" className="label">
              Harga jual di tokomu
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm font-semibold text-dim">Rp</span>
              <input
                id="calc-sell"
                inputMode="numeric"
                className="field pl-11 font-display text-lg font-bold"
                value={sell.toLocaleString("id-ID")}
                onChange={(e) => setSellPrice(Number(e.target.value.replace(/\D/g, "")) || 0)}
              />
            </div>
            <p className="mt-1.5 text-xs text-dim">Saran: {formatRupiah(suggested)} (markup 25%)</p>
          </div>

          <div>
            <label htmlFor="calc-day" className="label">
              Target terjual per hari: <span className="text-white">{perDay} pcs</span>
            </label>
            <input
              id="calc-day"
              type="range"
              min={1}
              max={50}
              value={perDay}
              onChange={(e) => setPerDay(Number(e.target.value))}
              className="w-full accent-hazard"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 rounded-2xl border border-hazard/30 bg-gradient-to-br from-hazard/15 via-panel-2 to-panel p-6">
          <div>
            <p className="text-sm font-semibold text-steel">Untung per produk</p>
            <p className={`font-display text-4xl font-bold ${profit > 0 ? "text-hazard" : "text-red-400"}`}>
              {formatRupiah(profit)}
            </p>
            <p className="text-xs text-dim">Margin {margin}% dari harga jual</p>
          </div>
          <div className="h-px bg-line-2" />
          <div>
            <p className="text-sm font-semibold text-steel">Estimasi untung sebulan</p>
            <p className={`font-display text-5xl leading-tight font-bold ${monthly > 0 ? "text-white" : "text-red-400"}`}>
              {formatRupiah(monthly)}
            </p>
            <p className="text-xs text-dim">
              {perDay} pcs × 30 hari, tanpa stok barang & tanpa biaya gudang
            </p>
          </div>
          <p className="mt-2 flex gap-2 rounded-xl bg-asphalt/50 p-3 text-xs leading-5 text-steel">
            <Icon name="info" className="size-4 shrink-0 text-nitro" />
            Ongkir dibayar oleh pembeli di tokomu, jadi tidak mengurangi keuntungan. Angka ini hanya simulasi.
          </p>
        </div>
      </div>
    </div>
  );
}
