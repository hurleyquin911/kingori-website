"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { ProductArt } from "@/components/product-art";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { useHydrated } from "@/lib/local-store";
import { useOrders } from "@/lib/orders";
import { banks } from "@/lib/store-config";

export function OrderList() {
  const hydrated = useHydrated();
  const orders = useOrders();

  if (!hydrated) return <div className="card h-64 animate-pulse" />;

  if (orders.length === 0) {
    return (
      <div className="card grid place-items-center px-6 py-20 text-center">
        <ProductArt kind="helmet" accent="#ff4a1c" className="size-32" />
        <p className="mt-4 font-display text-2xl font-bold text-white uppercase italic">Belum ada pesanan</p>
        <p className="mt-1 max-w-sm text-steel">Pesanan yang kamu buat akan muncul di sini.</p>
        <Link href="/produk" className="btn-ignite mt-6">
          Mulai Belanja <Icon name="arrowRight" className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {orders.map((o) => {
        const first = o.items[0];
        const confirmed = o.status === "menunggu-verifikasi";
        const method = o.payment.method === "qris" ? "QRIS" : `Transfer ${banks.find((b) => b.id === o.payment.bankId)?.short ?? ""}`;
        return (
          <li key={o.id}>
            <Link href={`/pesanan/${o.id}`} className="card group flex flex-wrap items-center gap-4 p-5 transition hover:border-ignite/50">
              <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-carbon ring-1 ring-line">
                <ProductArt kind={first.art} accent={first.accent} className="size-12" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display font-bold tracking-wider text-white">{o.id}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      confirmed ? "bg-nitro/15 text-nitro" : "bg-hazard/15 text-hazard"
                    }`}
                  >
                    {confirmed ? "Menunggu verifikasi" : "Menunggu pembayaran"}
                  </span>
                  {o.dropship && (
                    <span className="rounded-full border border-hazard/40 px-2.5 py-0.5 text-[11px] font-bold text-hazard">
                      Dropship
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-sm text-chrome">
                  {first.name}
                  {o.items.length > 1 && <span className="text-dim"> +{o.items.length - 1} produk lain</span>}
                </p>
                <p className="mt-0.5 text-xs text-dim">
                  {formatDateTime(o.createdAt)} · {method} · {o.shipping.courier} {o.shipping.service}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-dim">Total</p>
                <p className="font-display text-xl font-bold text-ignite">{formatRupiah(o.total)}</p>
              </div>
              <Icon name="chevronRight" className="size-5 text-dim transition group-hover:translate-x-1 group-hover:text-ignite" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
