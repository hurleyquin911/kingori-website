"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { use, useState, type ReactNode } from "react";
import { CopyButton } from "@/components/copy-button";
import { Icon, type IconName } from "@/components/icon";
import { ProductArt } from "@/components/product-art";
import { QrisCode } from "@/components/qris-code";
import { formatDateTime, formatRupiah } from "@/lib/format";
import { useHydrated } from "@/lib/local-store";
import { markOrderConfirmed, useOrders, type Order } from "@/lib/orders";
import { banks, qris, store } from "@/lib/store-config";
import { pad2, splitDuration, useNow } from "@/lib/use-now";

export function OrderView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const hydrated = useHydrated();
  const orders = useOrders();
  const order = orders.find((o) => o.id === id);

  if (!hydrated) return <div className="card h-[600px] animate-pulse" />;
  if (!order) return <NotFound id={id} />;
  return <OrderDetail order={order} />;
}

function OrderDetail({ order }: { order: Order }) {
  const now = useNow();
  const [proof, setProof] = useState<{ url: string; name: string } | null>(null);
  const bank = banks.find((b) => b.id === order.payment.bankId);
  const isQris = order.payment.method === "qris";
  const remaining = now ? new Date(order.expiresAt).getTime() - now : null;
  const expired = remaining !== null && remaining <= 0;
  const confirmed = order.status === "menunggu-verifikasi";
  const totalText = formatRupiah(order.total);
  const codeDigits = String(order.uniqueCode);
  const mainPart = totalText.slice(0, totalText.length - codeDigits.length);

  const waMessage = [
    `Halo admin ${store.name}, saya mau konfirmasi pembayaran.`,
    "",
    `No. Pesanan: ${order.id}`,
    `Nama: ${order.customer.name}`,
    `Metode: ${isQris ? "QRIS" : `Transfer ${bank?.short ?? ""}`}`,
    `Total dibayar: ${totalText}`,
    "",
    "Pesanan:",
    ...order.items.map((i) => `- ${i.qty}x ${i.name}${i.variant ? ` (${i.variant})` : ""} = ${formatRupiah(i.price * i.qty)}`),
    `Pengiriman: ${order.shipping.courier} ${order.shipping.service}`,
    ...(order.dropship
      ? [
          "",
          "*PESANAN DROPSHIP* (tanpa nota/harga di paket)",
          `Pengirim: ${order.dropship.name} (${order.dropship.phone})`,
          order.dropship.shop ? `Toko: ${order.dropship.shop}` : "",
        ]
      : []),
    "",
    order.dropship ? "Alamat penerima:" : "Alamat:",
    `${order.customer.name} (${order.customer.phone})`,
    `${order.address.street}, ${order.address.village}, ${order.address.district}, ${order.address.city}, ${order.address.province} ${order.address.postalCode}`,
    order.address.landmark ? `Patokan: ${order.address.landmark}` : "",
    order.note ? `Catatan: ${order.note}` : "",
    "",
    "Bukti pembayaran saya lampirkan di chat ini. Terima kasih!",
  ]
    .filter((l, i, arr) => l !== "" || arr[i - 1] !== "")
    .join("\n");

  const timeline: { label: string; icon: IconName; state: "done" | "active" | "todo" }[] = [
    { label: "Pesanan dibuat", icon: "receipt", state: "done" },
    { label: "Pembayaran", icon: "wallet", state: confirmed ? "done" : "active" },
    { label: "Verifikasi admin", icon: "shield", state: confirmed ? "active" : "todo" },
    { label: "Dikemas", icon: "package", state: "todo" },
    { label: "Dikirim", icon: "truck", state: "todo" },
  ];

  const { hours, minutes, seconds } = splitDuration(remaining ?? 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <div className="space-y-6">
        {/* BANNER */}
        <div className="relative overflow-hidden rounded-3xl border border-turbo/30 bg-gradient-to-br from-turbo/15 via-panel to-panel p-6 sm:p-8">
          <div className="absolute -top-16 -right-16 size-56 rounded-full bg-turbo/10 blur-3xl" />
          <div className="relative flex flex-wrap items-start gap-5">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-turbo text-asphalt shadow-[0_0_40px_rgba(34,197,94,0.45)]">
              <Icon name="check" className="size-9" strokeWidth={2.6} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl font-bold tracking-wide text-white uppercase italic sm:text-3xl">
                {confirmed ? "Konfirmasi Terkirim!" : "Pesanan Berhasil Dibuat!"}
              </h2>
              <p className="mt-1 text-steel">
                {confirmed
                  ? "Admin akan memverifikasi pembayaranmu dan segera memproses pengiriman."
                  : "Selesaikan pembayaran sesuai instruksi di bawah agar pesanan segera diproses."}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-lg border border-line-2 bg-asphalt/60 px-3 py-1.5 font-display font-bold tracking-wider text-white">
                  {order.id}
                </span>
                <CopyButton value={order.id} label="Salin No. Pesanan" />
              </div>
            </div>
          </div>

          <ol className="relative mt-8 grid grid-cols-5 gap-1">
            {timeline.map((t, i) => (
              <li key={t.label} className="relative flex flex-col items-center text-center">
                {i > 0 && (
                  <span className={`absolute top-5 right-1/2 h-0.5 w-full ${t.state === "todo" ? "bg-line-2" : "bg-turbo"}`} />
                )}
                <span
                  className={`relative grid size-10 place-items-center rounded-full border-2 ${
                    t.state === "done"
                      ? "border-turbo bg-turbo text-asphalt"
                      : t.state === "active"
                        ? "border-hazard bg-hazard/15 text-hazard shadow-[0_0_20px_rgba(255,196,20,0.4)]"
                        : "border-line-2 bg-panel text-dim"
                  }`}
                >
                  <Icon name={t.state === "done" ? "check" : t.icon} className="size-4" />
                </span>
                <span className={`mt-2 text-[11px] leading-tight font-semibold sm:text-xs ${t.state === "todo" ? "text-dim" : "text-chrome"}`}>
                  {t.label}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* COUNTDOWN + TOTAL */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-steel">
              <Icon name="clock" className="size-4 text-hazard" />
              {expired ? "Batas waktu pembayaran telah lewat" : "Selesaikan pembayaran dalam"}
            </p>
            <div className="mt-3 flex items-center gap-2">
              {[hours, minutes, seconds].map((v, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className={`grid h-14 w-16 place-items-center rounded-xl bg-carbon font-display text-3xl font-bold tabular-nums ring-1 ${expired ? "text-dim ring-line" : "text-hazard ring-hazard/30"}`}>
                    {remaining === null ? "--" : pad2(v)}
                  </span>
                  {i < 2 && <span className="font-display text-2xl font-bold text-hazard">:</span>}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-dim">Batas: {formatDateTime(order.expiresAt)} WIB</p>
          </div>

          <div className="card relative overflow-hidden p-6">
            <div className="absolute inset-y-0 right-0 w-1.5 bg-ignite" />
            <p className="text-sm font-semibold text-steel">Total yang harus dibayar</p>
            <p className="mt-2 font-display text-4xl font-bold text-white tabular-nums">
              {mainPart}
              <span className="rounded-md bg-hazard/20 px-1 text-hazard">{codeDigits}</span>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <CopyButton value={String(order.total)} label="Salin Nominal" />
            </div>
            <p className="mt-3 text-xs leading-5 text-dim">
              Transfer <b className="text-hazard">tepat sampai 3 digit terakhir</b> (kode unik {codeDigits}) agar pembayaran
              mudah dicek admin.
            </p>
          </div>
        </div>

        {/* INSTRUKSI */}
        <div className="card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-line bg-gradient-to-r from-ignite/10 to-transparent px-6 py-4">
            <Icon name={isQris ? "qr" : "bank"} className="size-5 text-ignite" />
            <h3 className="font-display text-lg font-bold tracking-wide text-white uppercase">
              {isQris ? "Bayar dengan QRIS" : `Transfer ke ${bank?.name ?? "Rekening King Ori"}`}
            </h3>
          </div>
          <div className="grid gap-8 p-6 md:grid-cols-[1fr_1.1fr]">
            {isQris ? (
              <div className="mx-auto w-full max-w-72">
                <QrisCode seed={order.id} />
                {qris.image && (
                  <a href={qris.image} download={`QRIS-${store.name}.png`} className="btn-ghost mt-4 w-full">
                    <Icon name="download" className="size-4" /> Unduh QRIS
                  </a>
                )}
              </div>
            ) : (
              bank && (
                <div>
                  <div
                    className="relative aspect-[1.586] overflow-hidden rounded-2xl p-5 text-white shadow-2xl shadow-black/50"
                    style={{ background: `linear-gradient(135deg, ${bank.color}, #0b0c0f 120%)` }}
                  >
                    <div className="absolute -top-10 -right-10 size-40 rounded-full bg-white/10" />
                    <div className="absolute -right-4 -bottom-16 size-48 rounded-full bg-white/5" />
                    <div className="relative flex h-full flex-col">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black italic">{bank.short}</span>
                        <Icon name="bank" className="size-6 opacity-80" />
                      </div>
                      <span className="mt-4 h-8 w-11 rounded-md bg-gradient-to-br from-[#f5d77a] to-[#b8902f]" />
                      <p className="mt-auto font-display text-2xl font-bold tracking-[0.15em] sm:text-[1.7rem]">
                        {bank.accountNumber.replace(/(\d{4})(?=\d)/g, "$1 ")}
                      </p>
                      <p className="mt-1 text-xs font-semibold tracking-widest uppercase opacity-80">{bank.accountName}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <CopyButton value={bank.accountNumber} label="Salin No. Rekening" />
                  </div>
                </div>
              )
            )}

            <div>
              <p className="label">Langkah pembayaran</p>
              <ol className="space-y-3">
                {(isQris
                  ? [
                      "Buka aplikasi e-wallet (GoPay, OVO, DANA, ShopeePay) atau m-Banking.",
                      "Pilih menu Scan / Bayar, lalu scan kode QRIS di samping.",
                      `Pastikan nama merchant ${qris.merchantName}.`,
                      `Masukkan nominal tepat ${totalText}, lalu konfirmasi.`,
                      "Screenshot bukti pembayaran, lalu kirim konfirmasi di bawah.",
                    ]
                  : [
                      `Buka m-Banking / ATM / internet banking ${bank?.short ?? ""}.`,
                      `Pilih Transfer, masukkan no. rekening ${bank?.accountNumber ?? ""}.`,
                      `Pastikan nama penerima ${bank?.accountName ?? ""}.`,
                      `Masukkan nominal tepat ${totalText} (termasuk kode unik).`,
                      "Simpan / screenshot bukti transfer, lalu kirim konfirmasi di bawah.",
                    ]
                ).map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-6 text-chrome">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-ignite/15 font-display text-xs font-bold text-ignite">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
              {!isQris && (
                <p className="mt-4 rounded-xl border border-line bg-carbon p-3 text-xs leading-5 text-steel">
                  Transfer dari bank berbeda? Bisa! Gunakan menu transfer antar bank / BI-FAST di aplikasi bank kamu.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* KONFIRMASI */}
        <div className="card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-line bg-gradient-to-r from-turbo/10 to-transparent px-6 py-4">
            <Icon name="upload" className="size-5 text-turbo" />
            <h3 className="font-display text-lg font-bold tracking-wide text-white uppercase">Konfirmasi Pembayaran</h3>
          </div>
          <div className="grid gap-6 p-6 md:grid-cols-[220px_1fr]">
            <label className="group relative grid aspect-[3/4] cursor-pointer place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-line-2 bg-carbon text-center transition hover:border-turbo">
              {proof ? (
                <img src={proof.url} alt="Bukti pembayaran" className="absolute inset-0 size-full object-cover" />
              ) : (
                <span className="px-4">
                  <Icon name="upload" className="mx-auto size-8 text-dim group-hover:text-turbo" />
                  <span className="mt-2 block text-sm font-semibold text-chrome">Unggah bukti bayar</span>
                  <span className="mt-1 block text-xs text-dim">JPG / PNG, screenshot m-Banking atau e-wallet</span>
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (proof) URL.revokeObjectURL(proof.url);
                  setProof({ url: URL.createObjectURL(file), name: file.name });
                }}
              />
            </label>
            <div className="flex flex-col">
              <p className="leading-7 text-steel">
                Sudah bayar? Kirim konfirmasi ke admin King Ori via WhatsApp. Detail pesanan akan terisi otomatis —
                {proof ? (
                  <b className="text-white"> jangan lupa lampirkan foto bukti ({proof.name}) di chat WhatsApp.</b>
                ) : (
                  <b className="text-white"> lampirkan foto bukti pembayaran di chat WhatsApp.</b>
                )}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-steel">
                <li className="flex gap-2">
                  <Icon name="check" className="size-4 shrink-0 text-turbo" /> Verifikasi maksimal 1×24 jam (jam kerja lebih cepat)
                </li>
                <li className="flex gap-2">
                  <Icon name="check" className="size-4 shrink-0 text-turbo" /> Nomor resi dikirim via WhatsApp setelah paket dikirim
                </li>
              </ul>
              <div className="mt-auto flex flex-wrap gap-3 pt-6">
                <a
                  href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(waMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => markOrderConfirmed(order.id)}
                  className="btn-ignite flex-1 bg-turbo py-4 hover:bg-[#2fe06e]"
                >
                  <Icon name="whatsapp" className="size-5" /> Konfirmasi via WhatsApp
                </a>
                <Link href="/produk" className="btn-ghost">
                  Belanja Lagi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL PESANAN */}
      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div className="card overflow-hidden">
          <div className="border-b border-line bg-panel-2 px-5 py-4">
            <p className="font-display font-bold tracking-wide text-white uppercase">Detail Pesanan</p>
            <p className="text-xs text-dim">Dibuat {formatDateTime(order.createdAt)} WIB</p>
          </div>
          <ul className="divide-y divide-line">
            {order.items.map((i) => (
              <li key={`${i.slug}-${i.variant}`} className="flex gap-3 px-5 py-3">
                <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-carbon ring-1 ring-line">
                  <ProductArt kind={i.art} accent={i.accent} className="size-11" />
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  <span className="line-clamp-2 font-semibold text-chrome">{i.name}</span>
                  <span className="block text-xs text-dim">
                    {i.qty} × {formatRupiah(i.price)}
                    {i.variant && ` · ${i.variant}`}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <div className="space-y-2 border-t border-line p-5 text-sm">
            <Sum label="Subtotal" value={formatRupiah(order.subtotal)} />
            <Sum label={`Ongkir (${order.shipping.weightKg} kg)`} value={order.shipping.cost ? formatRupiah(order.shipping.cost) : "Gratis"} />
            {order.shipping.discount > 0 && <Sum label="Diskon ongkir" value={`-${formatRupiah(order.shipping.discount)}`} green />}
            {order.shipping.insurance > 0 && <Sum label="Asuransi" value={formatRupiah(order.shipping.insurance)} />}
            <Sum label="Kode unik" value={`+${formatRupiah(order.uniqueCode)}`} />
            <div className="flex justify-between border-t border-dashed border-line-2 pt-3">
              <span className="font-semibold text-steel">Total</span>
              <span className="font-display text-xl font-bold text-ignite">{totalText}</span>
            </div>
          </div>
        </div>

        <InfoCard icon="truck" title="Pengiriman">
          <p className="font-semibold text-white">
            {order.shipping.courier} · {order.shipping.service}
          </p>
          <p className="text-steel">Estimasi {order.shipping.eta}</p>
        </InfoCard>

        {order.dropship && (
          <div className="card border-hazard/40 bg-gradient-to-br from-hazard/10 to-panel p-5 text-sm">
            <p className="mb-3 flex items-center gap-2 text-xs font-bold tracking-widest text-hazard uppercase">
              <Icon name="package" className="size-4" /> Dropship · Pengirim
            </p>
            <p className="font-semibold text-white">{order.dropship.name}</p>
            <p className="text-steel">{order.dropship.phone}</p>
            {order.dropship.shop && <p className="text-steel">{order.dropship.shop}</p>}
            <p className="mt-2 text-xs text-dim">Paket dikirim tanpa nota & harga King Ori.</p>
          </div>
        )}

        <InfoCard icon="pin" title={order.dropship ? "Alamat Penerima" : `Alamat · ${order.address.label}`}>
          <p className="font-semibold text-white">{order.customer.name}</p>
          <p className="text-steel">{order.customer.phone}</p>
          <p className="mt-2 leading-6 text-steel">
            {order.address.street}, {order.address.village}, {order.address.district}, {order.address.city},{" "}
            {order.address.province} {order.address.postalCode}
          </p>
          {order.address.landmark && <p className="mt-1 text-xs text-dim">Patokan: {order.address.landmark}</p>}
        </InfoCard>

        {order.note && (
          <InfoCard icon="receipt" title="Catatan">
            <p className="text-steel">{order.note}</p>
          </InfoCard>
        )}
      </aside>
    </div>
  );
}

function Sum({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-steel">{label}</span>
      <span className={green ? "font-semibold text-turbo" : "font-semibold text-white"}>{value}</span>
    </div>
  );
}

function InfoCard({ icon, title, children }: { icon: IconName; title: string; children: ReactNode }) {
  return (
    <div className="card p-5 text-sm">
      <p className="mb-3 flex items-center gap-2 text-xs font-bold tracking-widest text-dim uppercase">
        <Icon name={icon} className="size-4 text-ignite" /> {title}
      </p>
      {children}
    </div>
  );
}

function NotFound({ id }: { id: string }) {
  return (
    <div className="card grid place-items-center px-6 py-20 text-center">
      <ProductArt kind="cover" accent="#ff4a1c" className="size-32" />
      <p className="mt-4 font-display text-2xl font-bold text-white uppercase italic">Pesanan tidak ditemukan</p>
      <p className="mt-1 max-w-md text-steel">
        Pesanan <b className="text-white">{id}</b> tidak tersimpan di perangkat ini. Hubungi admin dengan menyebutkan nomor
        pesanan untuk cek status.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a
          href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(`Halo admin King Ori, saya mau cek status pesanan ${id}`)}`}
          target="_blank"
          rel="noreferrer"
          className="btn-ignite"
        >
          <Icon name="whatsapp" className="size-4" /> Tanya Admin
        </a>
        <Link href="/pesanan" className="btn-ghost">
          Pesanan Saya
        </Link>
      </div>
    </div>
  );
}
