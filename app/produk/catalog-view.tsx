"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/icon";
import { ProductArt } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/lib/products";

const priceRanges = [
  { id: "", label: "Semua harga", min: 0, max: Infinity },
  { id: "lt100", label: "< Rp100rb", min: 0, max: 99_999 },
  { id: "100-300", label: "Rp100rb – 300rb", min: 100_000, max: 300_000 },
  { id: "gt300", label: "> Rp300rb", min: 300_001, max: Infinity },
];

const sorts = [
  { id: "terlaris", label: "Terlaris" },
  { id: "rating", label: "Rating tertinggi" },
  { id: "termurah", label: "Harga termurah" },
  { id: "termahal", label: "Harga termahal" },
  { id: "diskon", label: "Diskon terbesar" },
];

export function CatalogView() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [showFilter, setShowFilter] = useState(false);

  const q = params.get("q") ?? "";
  const kategori = params.get("kategori") ?? "";
  const harga = params.get("harga") ?? "";
  const sort = params.get("urut") ?? "terlaris";

  function update(next: Record<string, string>) {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const range = priceRanges.find((r) => r.id === harga) ?? priceRanges[0];
  const needle = q.toLowerCase();
  const list = products
    .filter((p) => !kategori || p.category === kategori)
    .filter((p) => p.price >= range.min && p.price <= range.max)
    .filter(
      (p) =>
        !needle ||
        p.name.toLowerCase().includes(needle) ||
        p.compatibility.toLowerCase().includes(needle) ||
        p.brand.toLowerCase().includes(needle),
    )
    .sort((a, b) => {
      switch (sort) {
        case "rating":
          return b.rating - a.rating;
        case "termurah":
          return a.price - b.price;
        case "termahal":
          return b.price - a.price;
        case "diskon":
          return (b.originalPrice ? 1 - b.price / b.originalPrice : 0) - (a.originalPrice ? 1 - a.price / a.originalPrice : 0);
        default:
          return b.sold - a.sold;
      }
    });

  const activeCategory = categories.find((c) => c.id === kategori);

  const filters = (
    <div className="space-y-8">
      <div>
        <p className="label">Kategori</p>
        <div className="grid gap-1">
          <button
            type="button"
            onClick={() => update({ kategori: "" })}
            className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${
              !kategori ? "bg-ignite/10 text-ignite" : "text-steel hover:bg-white/5 hover:text-white"
            }`}
          >
            Semua Produk <span className="text-xs opacity-70">{products.length}</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => update({ kategori: c.id })}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                kategori === c.id ? "bg-ignite/10 text-ignite" : "text-steel hover:bg-white/5 hover:text-white"
              }`}
            >
              <ProductArt kind={c.art} accent="#ff4a1c" className="size-7 shrink-0" />
              <span className="flex-1">{c.name}</span>
              <span className="text-xs opacity-70">{products.filter((p) => p.category === c.id).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="label">Rentang Harga</p>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => update({ harga: r.id })}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                harga === r.id ? "border-ignite bg-ignite text-white" : "border-line-2 text-steel hover:border-steel hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">
        <div className="card sticky top-24 p-5">{filters}</div>
      </aside>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative min-w-0 flex-1 basis-64">
            <span className="sr-only">Cari di katalog</span>
            <Icon name="search" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-dim" />
            <input
              key={q}
              defaultValue={q}
              placeholder="Cari nama produk, merek atau tipe motor…"
              onKeyDown={(e) => {
                if (e.key === "Enter") update({ q: e.currentTarget.value.trim() });
              }}
              onBlur={(e) => {
                if (e.currentTarget.value.trim() !== q) update({ q: e.currentTarget.value.trim() });
              }}
              className="field pl-10"
            />
          </label>
          <button
            type="button"
            onClick={() => setShowFilter((s) => !s)}
            className="flex h-[46px] items-center gap-2 rounded-lg border border-line bg-carbon px-4 text-sm font-semibold lg:hidden"
          >
            <Icon name="filter" className="size-4" /> Filter
          </button>
          <label className="relative">
            <span className="sr-only">Urutkan</span>
            <select
              value={sort}
              onChange={(e) => update({ urut: e.target.value === "terlaris" ? "" : e.target.value })}
              className="field h-[46px] cursor-pointer appearance-none pr-10"
            >
              {sorts.map((s) => (
                <option key={s.id} value={s.id}>
                  Urutkan: {s.label}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-dim" />
          </label>
        </div>

        {showFilter && <div className="card mt-4 p-5 lg:hidden">{filters}</div>}

        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-steel">
          <span>
            Menampilkan <b className="text-white">{list.length}</b> produk
          </span>
          {activeCategory && (
            <button type="button" onClick={() => update({ kategori: "" })} className="chip hover:border-ignite hover:text-ignite">
              {activeCategory.name} <Icon name="close" className="size-3" />
            </button>
          )}
          {q && (
            <button type="button" onClick={() => update({ q: "" })} className="chip hover:border-ignite hover:text-ignite">
              “{q}” <Icon name="close" className="size-3" />
            </button>
          )}
          {range.id && (
            <button type="button" onClick={() => update({ harga: "" })} className="chip hover:border-ignite hover:text-ignite">
              {range.label} <Icon name="close" className="size-3" />
            </button>
          )}
        </div>

        {list.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <div className="card mt-5 grid place-items-center px-6 py-20 text-center">
            <ProductArt kind="tire" accent="#6b7280" className="size-28 opacity-70" />
            <p className="mt-4 font-display text-xl font-bold text-white uppercase">Produk tidak ditemukan</p>
            <p className="mt-1 max-w-sm text-sm text-steel">
              Coba kata kunci lain atau hapus filter. Bisa juga tanya admin, siapa tahu stoknya ada.
            </p>
            <button type="button" onClick={() => router.replace(pathname)} className="btn-ghost mt-6">
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
