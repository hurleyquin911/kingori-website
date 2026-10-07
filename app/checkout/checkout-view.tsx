"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { EmptyCart } from "@/app/keranjang/cart-view";
import { CopyButton } from "@/components/copy-button";
import { Icon, type IconName } from "@/components/icon";
import { ProductArt } from "@/components/product-art";
import { QrisCode } from "@/components/qris-code";
import { clearCart, useCart } from "@/lib/cart";
import { formatRupiah } from "@/lib/format";
import { useHydrated } from "@/lib/local-store";
import {
  createOrderMeta,
  saveDropshipper,
  saveLastAddress,
  saveOrder,
  useLastAddress,
  useSavedDropshipper,
  type Dropshipper,
  type Order,
} from "@/lib/orders";
import { variantAccent } from "@/lib/products";
import { getShippingQuotes, provinces, shippingDiscount, totalWeightKg, type ShippingQuote } from "@/lib/shipping";
import { banks, qris, store } from "@/lib/store-config";

type Form = {
  name: string;
  phone: string;
  email: string;
  label: string;
  province: string;
  city: string;
  district: string;
  village: string;
  postalCode: string;
  street: string;
  landmark: string;
};

const EMPTY_FORM: Form = {
  name: "",
  phone: "",
  email: "",
  label: "Rumah",
  province: "",
  city: "",
  district: "",
  village: "",
  postalCode: "",
  street: "",
  landmark: "",
};

type ErrorKey = keyof Form | "shipping" | "bank" | "agree" | "dsName" | "dsPhone";

const FIELD_ORDER: ErrorKey[] = [
  "dsName",
  "dsPhone",
  "name",
  "phone",
  "email",
  "province",
  "city",
  "district",
  "village",
  "postalCode",
  "street",
  "shipping",
  "bank",
  "agree",
];

const labels: { id: string; icon: IconName }[] = [
  { id: "Rumah", icon: "home" },
  { id: "Kantor", icon: "building" },
  { id: "Bengkel", icon: "wrench" },
];

const kindLabel: Record<ShippingQuote["kind"], string> = {
  regular: "Reguler",
  express: "Express",
  cargo: "Kargo",
  instant: "Instan",
  pickup: "Ambil Sendiri",
};

function normalizePhone(v: string) {
  return v.replace(/[\s-]/g, "");
}

const PHONE_RE = /^(\+62|62|0)8\d{7,12}$/;

function validate(
  form: Form,
  ds: Dropshipper | null,
  quote: ShippingQuote | undefined,
  method: "transfer" | "qris",
  bankId: string | null,
  agree: boolean,
) {
  const e: Partial<Record<ErrorKey, string>> = {};
  if (ds) {
    if (ds.name.trim().length < 3) e.dsName = "Nama pengirim minimal 3 huruf";
    if (!PHONE_RE.test(normalizePhone(ds.phone))) e.dsPhone = "Nomor HP pengirim tidak valid";
  }
  if (form.name.trim().length < 3) e.name = "Nama penerima minimal 3 huruf";
  if (!PHONE_RE.test(normalizePhone(form.phone))) e.phone = "Nomor WhatsApp tidak valid (contoh: 0812xxxxxxx)";
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Format email tidak valid";
  if (!form.province) e.province = "Pilih provinsi";
  if (form.city.trim().length < 3) e.city = "Isi kota / kabupaten";
  if (form.district.trim().length < 3) e.district = "Isi kecamatan";
  if (form.village.trim().length < 3) e.village = "Isi kelurahan / desa";
  if (!/^\d{5}$/.test(form.postalCode)) e.postalCode = "Kode pos harus 5 angka";
  if (form.street.trim().length < 10) e.street = "Tulis alamat lengkap: nama jalan, nomor rumah, RT/RW";
  if (!quote) e.shipping = "Pilih jenis pengiriman";
  if (method === "transfer" && !bankId) e.bank = "Pilih bank tujuan transfer";
  if (!agree) e.agree = "Centang konfirmasi terlebih dahulu";
  return e;
}

export function CheckoutView() {
  const router = useRouter();
  const hydrated = useHydrated();
  const { lines, count, subtotal, weight } = useCart();
  const lastAddress = useLastAddress();
  const savedDropshipper = useSavedDropshipper();

  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const [isDropship, setIsDropship] = useState(false);
  const [ds, setDs] = useState<Dropshipper>({ name: "", phone: "", shop: "" });
  const [shippingId, setShippingId] = useState<string | null>(null);
  const [insurance, setInsurance] = useState(false);
  const [method, setMethod] = useState<"transfer" | "qris">("transfer");
  const [bankId, setBankId] = useState<string | null>(banks[0].id);
  const [note, setNote] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!hydrated) return <div className="card h-[600px] animate-pulse" />;
  if (lines.length === 0) return <EmptyCart />;

  const quotes = getShippingQuotes(form.province, weight);
  const quote = quotes.find((q) => q.id === shippingId && q.available);
  const shipCost = quote?.cost ?? 0;
  const shipDiscount = quote ? shippingDiscount(subtotal, quote.cost, quote.kind) : 0;
  const insuranceCost =
    insurance && quote && quote.kind !== "pickup" ? Math.max(2_000, Math.ceil((subtotal * 0.005) / 1_000) * 1_000) : 0;
  const total = subtotal + shipCost - shipDiscount + insuranceCost;
  const bank = banks.find((b) => b.id === bankId);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(form, isDropship ? ds : null, quote, method, bankId, agree);
    setErrors(found);
    const first = FIELD_ORDER.find((k) => found[k]);
    if (first) {
      document.getElementById(`f-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!quote) return;

    setSubmitting(true);
    const meta = createOrderMeta(store.paymentDeadlineHours);
    const order: Order = {
      id: meta.id,
      createdAt: meta.createdAt,
      expiresAt: meta.expiresAt,
      status: "menunggu-pembayaran",
      items: lines.map((l) => ({
        slug: l.slug,
        name: l.product.name,
        variant: l.variant,
        qty: l.qty,
        price: l.product.price,
        art: l.product.art,
        accent: variantAccent(l.product, l.variant),
      })),
      customer: { name: form.name.trim(), phone: normalizePhone(form.phone), email: form.email.trim() },
      address: {
        label: form.label,
        province: form.province,
        city: form.city.trim(),
        district: form.district.trim(),
        village: form.village.trim(),
        postalCode: form.postalCode,
        street: form.street.trim(),
        landmark: form.landmark.trim(),
      },
      shipping: {
        id: quote.id,
        courier: quote.courier,
        service: quote.service,
        eta: quote.etaLabel,
        cost: quote.cost,
        discount: shipDiscount,
        insurance: insuranceCost,
        weightKg: totalWeightKg(weight),
      },
      payment: { method, bankId: method === "transfer" ? bankId : null },
      dropship: isDropship
        ? { name: ds.name.trim(), phone: normalizePhone(ds.phone), shop: ds.shop.trim() }
        : null,
      note: note.trim(),
      subtotal,
      uniqueCode: meta.uniqueCode,
      total: total + meta.uniqueCode,
    };

    saveOrder(order);
    if (order.dropship) {
      saveDropshipper(order.dropship);
      setForm(EMPTY_FORM);
    } else {
      saveLastAddress({ ...order.customer, ...order.address });
    }
    clearCart();
    setAgree(false);
    setNote("");
    setSubmitting(false);
    router.push(`/pesanan/${order.id}`);
  }

  const groups = (["regular", "express", "cargo", "instant", "pickup"] as const)
    .map((k) => ({ kind: k, items: quotes.filter((q) => q.kind === k) }))
    .filter((g) => g.items.length);

  return (
    <form onSubmit={submit} noValidate>
      <Stepper />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          {/* DROPSHIP */}
          <div
            className={`card overflow-hidden transition ${isDropship ? "border-hazard/60 shadow-[0_0_40px_-12px_rgba(255,196,20,0.45)]" : ""}`}
          >
            <label className="flex cursor-pointer items-center gap-4 p-5 sm:px-6">
              <span
                className={`grid size-11 shrink-0 place-items-center rounded-xl ${isDropship ? "bg-hazard text-asphalt" : "bg-hazard/10 text-hazard"}`}
              >
                <Icon name="package" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg font-bold tracking-wide text-white uppercase">
                  Kirim sebagai Dropshipper
                </span>
                <span className="block text-xs text-steel">
                  Paket dikirim atas nama tokomu, tanpa nota & harga King Ori di dalam paket.{" "}
                  <Link href="/dropship" className="font-semibold text-hazard hover:underline">
                    Pelajari program dropship
                  </Link>
                </span>
              </span>
              <input
                type="checkbox"
                className="peer sr-only"
                checked={isDropship}
                onChange={(e) => {
                  const on = e.target.checked;
                  setIsDropship(on);
                  if (on && savedDropshipper && !ds.name) setDs(savedDropshipper);
                  if (!on) setErrors((er) => ({ ...er, dsName: undefined, dsPhone: undefined }));
                }}
              />
              <span
                aria-hidden
                className="relative h-7 w-12 shrink-0 rounded-full bg-line-2 transition peer-checked:bg-hazard peer-focus-visible:ring-4 peer-focus-visible:ring-hazard/30 after:absolute after:top-1 after:left-1 after:size-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5"
              />
            </label>

            {isDropship && (
              <div className="border-t border-line bg-gradient-to-b from-hazard/5 to-transparent p-5 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="dsName" label="Nama pengirim (tampil di label)" error={errors.dsName}>
                    <input
                      id="f-dsName"
                      className="field"
                      placeholder="Nama kamu / nama toko"
                      value={ds.name}
                      aria-invalid={!!errors.dsName}
                      onChange={(e) => {
                        setDs((d) => ({ ...d, name: e.target.value }));
                        setErrors((er) => ({ ...er, dsName: undefined }));
                      }}
                    />
                  </Field>
                  <Field id="dsPhone" label="No. HP pengirim" error={errors.dsPhone}>
                    <input
                      id="f-dsPhone"
                      className="field"
                      type="tel"
                      inputMode="tel"
                      placeholder="0812 xxxx xxxx"
                      value={ds.phone}
                      aria-invalid={!!errors.dsPhone}
                      onChange={(e) => {
                        setDs((d) => ({ ...d, phone: e.target.value }));
                        setErrors((er) => ({ ...er, dsPhone: undefined }));
                      }}
                    />
                  </Field>
                  <Field id="dsShop" label="Nama toko online (opsional)" className="sm:col-span-2">
                    <input
                      id="f-dsShop"
                      className="field"
                      placeholder="Contoh: Garasi Budi Motor (Shopee)"
                      value={ds.shop}
                      onChange={(e) => setDs((d) => ({ ...d, shop: e.target.value }))}
                    />
                  </Field>
                </div>
                <ul className="mt-4 grid gap-2 text-xs text-steel sm:grid-cols-3">
                  {["Nama & HP kamu sebagai pengirim", "Tanpa invoice / harga di paket", "Resi dikirim ke WhatsApp kamu"].map((t) => (
                    <li key={t} className="flex items-center gap-1.5">
                      <Icon name="check" className="size-3.5 shrink-0 text-hazard" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ALAMAT */}
          <Section
            number={1}
            icon="pin"
            title={isDropship ? "Alamat Pembeli (Penerima)" : "Alamat Pengiriman"}
            subtitle={
              isDropship
                ? "Isi data pembeli dari tokomu — paket langsung dikirim ke alamat ini."
                : "Pastikan alamat lengkap agar paket tidak nyasar."
            }
          >
            {lastAddress && !form.name && !isDropship && (
              <button
                type="button"
                onClick={() => {
                  const { name, phone, email, label, province, city, district, village, postalCode, street, landmark } = lastAddress;
                  setForm({ name, phone, email, label, province, city, district, village, postalCode, street, landmark });
                  setErrors({});
                }}
                className="mb-5 flex w-full items-center gap-3 rounded-xl border border-dashed border-ignite/50 bg-ignite/5 p-4 text-left text-sm transition hover:bg-ignite/10"
              >
                <Icon name="pin" className="size-5 shrink-0 text-ignite" />
                <span className="min-w-0 flex-1">
                  <b className="block text-white">Gunakan alamat terakhir</b>
                  <span className="block truncate text-steel">
                    {lastAddress.name} · {lastAddress.street}, {lastAddress.city}
                  </span>
                </span>
                <Icon name="chevronRight" className="size-4 text-ignite" />
              </button>
            )}

            <div className="mb-5 flex flex-wrap gap-2">
              {labels.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => set("label", l.id)}
                  aria-pressed={form.label === l.id}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    form.label === l.id ? "border-ignite bg-ignite/10 text-white" : "border-line-2 text-steel hover:text-white"
                  }`}
                >
                  <Icon name={l.icon} className="size-4" />
                  {l.id}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="name" label="Nama penerima" error={errors.name}>
                <input id="f-name" className="field" autoComplete="name" placeholder="Nama lengkap" value={form.name} aria-invalid={!!errors.name} onChange={(e) => set("name", e.target.value)} />
              </Field>
              <Field id="phone" label="No. WhatsApp" error={errors.phone}>
                <input id="f-phone" className="field" type="tel" inputMode="tel" autoComplete="tel" placeholder="0812 3456 7890" value={form.phone} aria-invalid={!!errors.phone} onChange={(e) => set("phone", e.target.value)} />
              </Field>
              <Field id="email" label="Email (opsional)" error={errors.email} className="sm:col-span-2">
                <input id="f-email" className="field" type="email" autoComplete="email" placeholder="nama@email.com" value={form.email} aria-invalid={!!errors.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
              <Field id="province" label="Provinsi" error={errors.province}>
                <div className="relative">
                  <select
                    id="f-province"
                    className="field cursor-pointer appearance-none pr-10"
                    value={form.province}
                    aria-invalid={!!errors.province}
                    onChange={(e) => {
                      set("province", e.target.value);
                      if (errors.shipping) setErrors((er) => ({ ...er, shipping: undefined }));
                    }}
                  >
                    <option value="">Pilih provinsi</option>
                    {provinces.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <Icon name="chevronDown" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-dim" />
                </div>
              </Field>
              <Field id="city" label="Kota / Kabupaten" error={errors.city}>
                <input id="f-city" className="field" autoComplete="address-level2" placeholder="Contoh: Kota Bekasi" value={form.city} aria-invalid={!!errors.city} onChange={(e) => set("city", e.target.value)} />
              </Field>
              <Field id="district" label="Kecamatan" error={errors.district}>
                <input id="f-district" className="field" placeholder="Contoh: Bekasi Barat" value={form.district} aria-invalid={!!errors.district} onChange={(e) => set("district", e.target.value)} />
              </Field>
              <Field id="village" label="Kelurahan / Desa" error={errors.village}>
                <input id="f-village" className="field" placeholder="Contoh: Kranji" value={form.village} aria-invalid={!!errors.village} onChange={(e) => set("village", e.target.value)} />
              </Field>
              <Field id="postalCode" label="Kode pos" error={errors.postalCode}>
                <input
                  id="f-postalCode"
                  className="field"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={5}
                  placeholder="17135"
                  value={form.postalCode}
                  aria-invalid={!!errors.postalCode}
                  onChange={(e) => set("postalCode", e.target.value.replace(/\D/g, ""))}
                />
              </Field>
              <Field id="landmark" label="Patokan (opsional)">
                <input id="f-landmark" className="field" placeholder="Dekat masjid / pagar hitam" value={form.landmark} onChange={(e) => set("landmark", e.target.value)} />
              </Field>
              <Field id="street" label="Alamat lengkap" error={errors.street} className="sm:col-span-2">
                <textarea
                  id="f-street"
                  rows={3}
                  className="field resize-none"
                  autoComplete="street-address"
                  placeholder="Nama jalan, nomor rumah, blok, RT/RW, nama gedung / perumahan"
                  value={form.street}
                  aria-invalid={!!errors.street}
                  onChange={(e) => set("street", e.target.value)}
                />
              </Field>
            </div>
          </Section>

          {/* PENGIRIMAN */}
          <Section
            number={2}
            icon="truck"
            title="Jenis Pengiriman"
            subtitle={`Berat total ${totalWeightKg(weight)} kg · dikirim dari ${store.originProvince}`}
          >
            <div id="f-shipping" className="scroll-mt-32">
              {!form.province && (
                <p className="mb-4 flex items-center gap-2 rounded-xl border border-hazard/30 bg-hazard/5 p-3 text-sm text-hazard">
                  <Icon name="info" className="size-4 shrink-0" /> Pilih provinsi tujuan dulu untuk melihat ongkos kirim.
                </p>
              )}
              <div className="space-y-5">
                {groups.map((g) => (
                  <div key={g.kind}>
                    <p className="mb-2 text-xs font-bold tracking-widest text-dim uppercase">{kindLabel[g.kind]}</p>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {g.items.map((q) => (
                        <CourierOption
                          key={q.id}
                          quote={q}
                          selected={quote?.id === q.id}
                          discount={shippingDiscount(subtotal, q.cost, q.kind)}
                          onSelect={() => {
                            setShippingId(q.id);
                            setErrors((er) => ({ ...er, shipping: undefined }));
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {errors.shipping && <ErrorText>{errors.shipping}</ErrorText>}

              {quote && quote.kind !== "pickup" && (
                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-carbon p-4">
                  <input type="checkbox" checked={insurance} onChange={(e) => setInsurance(e.target.checked)} className="mt-0.5 size-4 accent-ignite" />
                  <span className="text-sm">
                    <b className="text-white">Tambah asuransi pengiriman</b>
                    <span className="block text-steel">
                      Perlindungan jika paket hilang / rusak. Biaya 0,5% dari harga barang, dibulatkan ke atas (min. Rp2.000).
                    </span>
                  </span>
                </label>
              )}
            </div>
          </Section>

          {/* PEMBAYARAN */}
          <Section number={3} icon="wallet" title="Metode Pembayaran" subtitle="Tanpa payment gateway — bayar langsung ke King Ori.">
            <div className="grid gap-3 sm:grid-cols-2">
              <PayMethod
                active={method === "transfer"}
                onClick={() => setMethod("transfer")}
                icon="bank"
                title="Transfer Bank"
                text="BCA, Mandiri, BRI, BNI · cek manual oleh admin"
              />
              <PayMethod
                active={method === "qris"}
                onClick={() => setMethod("qris")}
                icon="qr"
                title="Scan QRIS"
                text="GoPay, OVO, DANA, ShopeePay, m-Banking"
              />
            </div>

            {method === "transfer" ? (
              <div id="f-bank" className="mt-5 scroll-mt-32">
                <p className="label">Pilih bank tujuan</p>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {banks.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setBankId(b.id);
                        setErrors((er) => ({ ...er, bank: undefined }));
                      }}
                      aria-pressed={bankId === b.id}
                      className={`relative flex h-16 items-center justify-center rounded-xl border-2 bg-white text-lg font-black italic transition ${
                        bankId === b.id ? "border-ignite ring-4 ring-ignite/20" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      style={{ color: b.color }}
                    >
                      {b.short}
                      {bankId === b.id && (
                        <span className="absolute -top-2 -right-2 grid size-5 place-items-center rounded-full bg-ignite text-white">
                          <Icon name="check" className="size-3" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                {errors.bank && <ErrorText>{errors.bank}</ErrorText>}
                {bank && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-carbon p-4">
                    <div>
                      <p className="text-xs text-dim">Rekening {bank.name}</p>
                      <p className="font-display text-xl font-bold tracking-wider text-white">{bank.accountNumber}</p>
                      <p className="text-xs text-steel">a.n. {bank.accountName}</p>
                    </div>
                    <CopyButton value={bank.accountNumber} label="Salin No. Rek" />
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-5 grid items-center gap-5 rounded-xl border border-line bg-carbon p-4 sm:grid-cols-[180px_1fr]">
                <QrisCode seed="preview" className="mx-auto w-44 sm:w-full" />
                <div>
                  <p className="font-semibold text-white">Bayar pakai aplikasi apa saja</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {qris.supported.map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-steel">
                    Kode QRIS lengkap beserta nominal yang harus dibayar akan tampil setelah pesanan dibuat.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-5 flex gap-3 rounded-xl border border-nitro/25 bg-nitro/5 p-4 text-sm text-steel">
              <Icon name="info" className="mt-0.5 size-5 shrink-0 text-nitro" />
              <p>
                Setelah klik <b className="text-white">Buat Pesanan</b>, kamu akan mendapat nomor pesanan, total bayar
                + <b className="text-white">kode unik 3 digit</b> (memudahkan verifikasi), dan batas waktu pembayaran{" "}
                <b className="text-white">{store.paymentDeadlineHours} jam</b>. Lalu kirim bukti bayar ke admin via WhatsApp.
              </p>
            </div>
          </Section>

          <Section number={4} icon="receipt" title="Catatan untuk Penjual" subtitle="Opsional — misal: tipe/tahun motor, warna cadangan.">
            <textarea
              rows={3}
              className="field resize-none"
              placeholder="Contoh: Untuk Vario 150 tahun 2019, kalau warna merah habis boleh diganti hitam."
              value={note}
              maxLength={300}
              onChange={(e) => setNote(e.target.value)}
            />
          </Section>
        </div>

        {/* RINGKASAN */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line bg-panel-2 px-5 py-4">
              <p className="font-display font-bold tracking-wide text-white uppercase">Ringkasan Pesanan</p>
              <Link href="/keranjang" className="text-xs font-semibold text-ignite hover:underline">
                Ubah
              </Link>
            </div>
            {isDropship && (
              <p className="flex items-center gap-2 border-b border-hazard/30 bg-hazard/10 px-5 py-2.5 text-xs font-semibold text-hazard">
                <Icon name="package" className="size-4" />
                Dropship · dikirim atas nama {ds.name.trim() || "tokomu"}
              </p>
            )}
            <ul className="max-h-72 divide-y divide-line overflow-y-auto">
              {lines.map((l) => (
                <li key={l.key} className="flex gap-3 px-5 py-3">
                  <span className="relative grid size-14 shrink-0 place-items-center rounded-lg bg-carbon ring-1 ring-line">
                    <ProductArt kind={l.product.art} accent={variantAccent(l.product, l.variant)} className="size-11" />
                    <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-steel text-[10px] font-bold text-asphalt">
                      {l.qty}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="line-clamp-1 font-semibold text-chrome">{l.product.name}</span>
                    {l.variant && <span className="block text-xs text-dim">{l.variant}</span>}
                  </span>
                  <span className="text-sm font-semibold text-white">{formatRupiah(l.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-2.5 border-t border-line p-5 text-sm">
              <SumRow label={`Subtotal (${count} barang)`} value={formatRupiah(subtotal)} />
              <SumRow
                label={quote ? `Ongkir ${quote.courier} ${quote.service}` : "Ongkos kirim"}
                value={quote ? (quote.cost ? formatRupiah(quote.cost) : "Gratis") : "—"}
              />
              {shipDiscount > 0 && <SumRow label="Diskon ongkir" value={`-${formatRupiah(shipDiscount)}`} accent />}
              {insuranceCost > 0 && <SumRow label="Asuransi" value={formatRupiah(insuranceCost)} />}
              <SumRow label="Kode unik" value="+3 digit" muted />
              <div className="flex items-end justify-between border-t border-dashed border-line-2 pt-4">
                <span className="font-semibold text-steel">Total bayar</span>
                <span className="font-display text-3xl font-bold text-ignite">{formatRupiah(total)}</span>
              </div>
              <p className="text-right text-[11px] text-dim">*belum termasuk kode unik (Rp101–Rp499)</p>
            </div>
            <div className="space-y-4 border-t border-line p-5">
              <label id="f-agree" className="flex cursor-pointer items-start gap-3 text-sm text-steel">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => {
                    setAgree(e.target.checked);
                    setErrors((er) => ({ ...er, agree: undefined }));
                  }}
                  className="mt-0.5 size-4 accent-ignite"
                />
                Saya sudah memastikan alamat & pesanan benar, dan akan membayar sebelum batas waktu.
              </label>
              {errors.agree && <ErrorText>{errors.agree}</ErrorText>}
              <button type="submit" disabled={submitting} className="btn-ignite w-full py-4 text-base">
                <Icon name="bolt" className="size-5" />
                {submitting ? "Memproses…" : "Buat Pesanan"}
              </button>
              <p className="flex items-center justify-center gap-1.5 text-xs text-dim">
                <Icon name="shield" className="size-3.5" /> Data kamu hanya dipakai untuk pengiriman
              </p>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}

function Stepper() {
  const steps = ["Keranjang", "Checkout", "Pembayaran", "Dikirim"];
  return (
    <ol className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
      {steps.map((s, i) => {
        const done = i < 1;
        const active = i === 1;
        return (
          <li key={s} className="flex shrink-0 items-center gap-2">
            <span
              className={`grid size-8 place-items-center rounded-full font-display text-sm font-bold ${
                done ? "bg-turbo text-asphalt" : active ? "bg-ignite text-white shadow-[0_0_20px_rgba(255,74,28,0.6)]" : "bg-panel-2 text-dim"
              }`}
            >
              {done ? <Icon name="check" className="size-4" /> : i + 1}
            </span>
            <span className={`font-display text-sm font-semibold tracking-wider uppercase ${active ? "text-white" : "text-dim"}`}>{s}</span>
            {i < steps.length - 1 && <span className={`mx-1 h-0.5 w-8 sm:w-16 ${done ? "bg-turbo" : "bg-line-2"}`} />}
          </li>
        );
      })}
    </ol>
  );
}

function Section({
  number,
  icon,
  title,
  subtitle,
  children,
}: {
  number: number;
  icon: IconName;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="card overflow-hidden">
      <header className="flex items-center gap-4 border-b border-line bg-gradient-to-r from-ignite/10 to-transparent px-5 py-4 sm:px-6">
        <span className="relative grid size-11 place-items-center rounded-xl bg-ignite/15 text-ignite">
          <Icon name={icon} />
          <span className="absolute -top-1.5 -left-1.5 grid size-5 place-items-center rounded-full bg-hazard font-display text-[11px] font-bold text-asphalt">
            {number}
          </span>
        </span>
        <div>
          <h2 className="font-display text-lg font-bold tracking-wide text-white uppercase">{title}</h2>
          <p className="text-xs text-steel">{subtitle}</p>
        </div>
      </header>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Field({ id, label, error, className = "", children }: { id: string; label: string; error?: string; className?: string; children: ReactNode }) {
  return (
    <div className={`scroll-mt-32 ${className}`}>
      <label htmlFor={`f-${id}`} className="label">
        {label}
      </label>
      {children}
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-400">
      <Icon name="info" className="size-3.5" /> {children}
    </p>
  );
}

function CourierOption({
  quote,
  selected,
  discount,
  onSelect,
}: {
  quote: ShippingQuote;
  selected: boolean;
  discount: number;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      disabled={!quote.available}
      onClick={onSelect}
      aria-pressed={selected}
      className={`group relative flex items-center gap-3 rounded-xl border-2 p-3.5 text-left transition ${
        selected
          ? "border-ignite bg-ignite/10"
          : quote.available
            ? "border-line bg-carbon hover:border-line-2"
            : "cursor-not-allowed border-line/60 bg-carbon/40 opacity-50"
      }`}
    >
      <span
        className="grid h-11 w-14 shrink-0 place-items-center rounded-lg text-center text-[11px] leading-tight font-black text-white"
        style={{ background: quote.color, color: quote.kind === "pickup" ? "#0b0c0f" : undefined }}
      >
        {quote.kind === "pickup" ? <Icon name="store" className="size-5" /> : quote.courier}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-white">
          {quote.courier} <span className="text-steel">· {quote.service}</span>
        </span>
        <span className="block truncate text-xs text-dim">{quote.available ? quote.description : quote.reason}</span>
        {quote.available && (
          <span className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-nitro">
            <Icon name="clock" className="size-3" /> {quote.etaLabel}
          </span>
        )}
      </span>
      {quote.available && (
        <span className="text-right">
          {discount > 0 && <span className="block text-[11px] text-dim line-through">{formatRupiah(quote.cost)}</span>}
          <span className={`block font-display font-bold ${quote.cost - discount === 0 ? "text-turbo" : "text-white"}`}>
            {quote.cost - discount === 0 ? "GRATIS" : formatRupiah(quote.cost - discount)}
          </span>
        </span>
      )}
      <span
        className={`absolute top-2 right-2 size-2 rounded-full ${selected ? "bg-ignite shadow-[0_0_10px_#ff4a1c]" : "bg-transparent"}`}
      />
    </button>
  );
}

function PayMethod({
  active,
  onClick,
  icon,
  title,
  text,
}: {
  active: boolean;
  onClick: () => void;
  icon: IconName;
  title: string;
  text: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition ${
        active ? "border-ignite bg-ignite/10" : "border-line bg-carbon hover:border-line-2"
      }`}
    >
      <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${active ? "bg-ignite text-white" : "bg-panel-2 text-steel"}`}>
        <Icon name={icon} className="size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display font-bold tracking-wide text-white uppercase">{title}</span>
        <span className="block text-xs text-steel">{text}</span>
      </span>
      <span className={`grid size-5 place-items-center rounded-full border-2 ${active ? "border-ignite" : "border-line-2"}`}>
        {active && <span className="size-2.5 rounded-full bg-ignite" />}
      </span>
    </button>
  );
}

function SumRow({ label, value, accent, muted }: { label: string; value: string; accent?: boolean; muted?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-steel">{label}</span>
      <span className={accent ? "font-semibold text-turbo" : muted ? "text-dim" : "font-semibold text-white"}>{value}</span>
    </div>
  );
}
