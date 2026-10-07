import type { Metadata } from "next";
import Link from "next/link";
import { Icon, type IconName } from "@/components/icon";
import { ProductArt } from "@/components/product-art";
import { store } from "@/lib/store-config";
import { ProfitCalculator } from "./profit-calculator";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Program Dropship",
  description:
    "Mulai bisnis spare part & aksesoris kendaraan tanpa stok barang. Jadi dropshipper King Ori: paket dikirim atas nama tokomu, tanpa nota harga.",
};

const benefits: { icon: IconName; title: string; text: string }[] = [
  { icon: "wallet", title: "Tanpa Modal Stok", text: "Jual dulu, baru belanja ke King Ori. Tidak perlu nyetok & sewa gudang." },
  { icon: "package", title: "Atas Nama Tokomu", text: "Nama & nomor HP kamu tampil sebagai pengirim di label paket." },
  { icon: "receipt", title: "Tanpa Nota Harga", text: "Tidak ada invoice atau harga King Ori di dalam paket. Rahasia dagang aman." },
  { icon: "download", title: "Bebas Pakai Foto & Deskripsi", text: "Pakai katalog, foto & deskripsi produk untuk jualan di marketplace." },
  { icon: "truck", title: "Kirim Hari Ini", text: "Order & bayar sebelum 15.00 WIB langsung dikirim di hari yang sama." },
  { icon: "headset", title: "Admin Siap Bantu", text: "Cek stok, kecocokan part & resi cukup lewat WhatsApp admin." },
];

const steps = [
  { title: "Daftar Gratis", text: "Isi form di bawah, admin akan mengirim info & katalog dropship." },
  { title: "Jualan di Tokomu", text: "Pasang produk King Ori di Shopee, TikTok Shop, IG, atau WhatsApp." },
  { title: "Order Mode Dropship", text: "Ada pembeli? Checkout di website ini & aktifkan “Kirim sebagai Dropshipper”." },
  { title: "Transfer / QRIS", text: "Bayar harga modal + ongkir ke rekening atau QRIS King Ori." },
  { title: "Kami Kirim", text: "Paket dikirim atas nama tokomu, nomor resi dikirim via WhatsApp." },
];

const faqs = [
  {
    q: "Apakah ada biaya pendaftaran?",
    a: "Tidak ada. Daftar dropship King Ori gratis dan tanpa minimal order. Kamu cukup membayar harga produk + ongkir setiap ada pesanan.",
  },
  {
    q: "Bagaimana cara order sebagai dropshipper?",
    a: "Masukkan produk ke keranjang seperti biasa, lalu di halaman checkout aktifkan “Kirim sebagai Dropshipper”. Isi nama & HP kamu sebagai pengirim, lalu isi alamat pembelimu sebagai penerima.",
  },
  {
    q: "Apakah di dalam paket ada nota atau harga dari King Ori?",
    a: "Tidak. Untuk pesanan dropship, kami tidak menyertakan nota, brosur, atau label harga King Ori. Label pengiriman memakai nama pengirim yang kamu isi.",
  },
  {
    q: "Bisa kirim dengan resi dari marketplace (Shopee/TikTok)?",
    a: "Bisa. Kirim file/foto label resi marketplace ke WhatsApp admin setelah membayar, dan tulis di catatan pesanan bahwa kamu memakai resi marketplace.",
  },
  {
    q: "Bagaimana jika barang rusak atau tidak sesuai?",
    a: "Garansi tukar 7 hari tetap berlaku untuk dropshipper. Hubungi admin dengan nomor pesanan & video unboxing dari pembelimu.",
  },
];

export default function DropshipPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-line">
        <div className="carbon absolute inset-0 -z-20" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_30%,rgba(255,196,20,0.22),transparent_55%),radial-gradient(ellipse_at_0%_100%,rgba(255,74,28,0.2),transparent_50%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div>
            <span className="chip border-hazard/40 bg-hazard/10 text-hazard">
              <Icon name="package" className="size-3.5" /> Program Dropship {store.name}
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[0.95] font-bold tracking-tight uppercase italic sm:text-6xl">
              <span className="text-chrome">Bisnis Otomotif</span>
              <br />
              <span className="text-gradient-ignite">Tanpa Stok Barang.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-steel">
              Jual spare part & aksesoris original King Ori di tokomu sendiri. Kamu fokus jualan — kami yang packing &
              kirim atas nama tokomu, tanpa nota harga.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#daftar" className="btn-ignite">
                Daftar Gratis <Icon name="arrowRight" className="size-4" />
              </Link>
              <Link href="#kalkulator" className="btn-ghost">
                Hitung Keuntungan
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-steel">
              {["Gratis daftar", "Tanpa minimal order", "Nama tokomu di paket"].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <span className="grid size-5 place-items-center rounded-full bg-hazard text-asphalt">
                    <Icon name="check" className="size-3" strokeWidth={3} />
                  </span>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <ShippingLabel />
        </div>
      </section>

      {/* KEUNTUNGAN */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <Heading eyebrow="Kenapa dropship di King Ori" title="Semua Beres, Kamu Tinggal Jualan" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="group card corner-cut relative overflow-hidden p-6 transition hover:border-hazard/50">
              <div className="absolute -right-6 -bottom-6 text-white/[0.03] transition group-hover:text-hazard/10">
                <Icon name={b.icon} className="size-32" />
              </div>
              <span className="grid size-12 place-items-center rounded-xl bg-hazard/10 text-hazard">
                <Icon name={b.icon} className="size-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold tracking-wide text-white uppercase">{b.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-steel">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CARA KERJA */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <Heading eyebrow="Cara kerja" title="5 Langkah Mulai Dropship" />
        <ol className="mt-8 grid gap-4 md:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.title} className="card relative overflow-hidden p-5">
              <span className="font-display text-5xl leading-none font-bold text-white/5 italic">0{i + 1}</span>
              <span className="absolute top-5 right-5 grid size-8 place-items-center rounded-full bg-hazard font-display text-sm font-bold text-asphalt">
                {i + 1}
              </span>
              <h3 className="mt-2 font-display text-lg font-bold tracking-wide text-white uppercase">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-steel">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* KALKULATOR */}
      <section id="kalkulator" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-20 sm:px-6">
        <Heading eyebrow="Simulasi" title="Hitung Potensi Keuntunganmu" />
        <div className="mt-8">
          <ProfitCalculator />
        </div>
      </section>

      {/* DAFTAR + FAQ */}
      <section id="daftar" className="mx-auto grid max-w-7xl scroll-mt-24 gap-6 px-4 pt-20 sm:px-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="card p-6 sm:p-8">
          <p className="font-display text-sm font-semibold tracking-[0.3em] text-hazard uppercase">Gabung sekarang</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-wide text-white uppercase italic">Daftar Dropshipper</h2>
          <p className="mt-2 mb-6 text-sm text-steel">
            Data akan dikirim ke WhatsApp admin King Ori. Setelah terdaftar, kamu bisa langsung order dengan mode dropship.
          </p>
          <RegisterForm />
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold tracking-wide text-white uppercase italic">Pertanyaan Umum</h2>
          <div className="mt-5 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group card overflow-hidden open:border-hazard/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-white [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Icon name="chevronDown" className="size-4 shrink-0 text-hazard transition group-open:rotate-180" />
                </summary>
                <p className="-mt-1 px-5 pb-5 text-sm leading-6 text-steel">{f.a}</p>
              </details>
            ))}
          </div>
          <Link href="/produk" className="btn-ghost mt-6 w-full">
            Lihat Katalog Produk <Icon name="arrowRight" className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="flex items-center gap-2 font-display text-sm font-semibold tracking-[0.3em] text-hazard uppercase">
        <span className="h-0.5 w-6 bg-hazard" />
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-wide text-white uppercase italic sm:text-4xl">{title}</h2>
    </div>
  );
}

function ShippingLabel() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 -z-10 rounded-full bg-hazard/20 blur-3xl" />
      <div className="relative rotate-[-3deg] rounded-2xl bg-[#c9a36b] p-4 shadow-2xl shadow-black/60">
        <div className="hazard absolute inset-x-0 top-10 h-3 opacity-70" />
        <div className="relative rounded-lg bg-white p-5 text-asphalt shadow-lg">
          <div className="flex items-center justify-between border-b-2 border-dashed border-zinc-300 pb-3">
            <span className="text-lg font-black tracking-tight">JNE · REG</span>
            <span className="rounded bg-asphalt px-2 py-0.5 text-[10px] font-bold text-white">DROPSHIP</span>
          </div>
          <div className="grid grid-cols-2 gap-4 py-4 text-xs">
            <div>
              <p className="font-bold text-zinc-400 uppercase">Pengirim</p>
              <p className="mt-1 text-sm font-extrabold">Garasi Budi Motor</p>
              <p className="text-zinc-600">0812-xxxx-1234</p>
              <p className="mt-1 inline-block rounded bg-hazard px-1.5 py-0.5 text-[10px] font-bold">← nama tokomu</p>
            </div>
            <div>
              <p className="font-bold text-zinc-400 uppercase">Penerima</p>
              <p className="mt-1 text-sm font-extrabold">Pembeli Kamu</p>
              <p className="text-zinc-600">Jl. Mawar No. 12, Bekasi</p>
            </div>
          </div>
          <div className="flex items-end justify-between border-t-2 border-dashed border-zinc-300 pt-3">
            <div className="flex h-10 items-end gap-[2px]">
              {[3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 3, 2, 1, 3].map((w, i) => (
                <span key={i} className="h-full bg-asphalt" style={{ width: w }} />
              ))}
            </div>
            <p className="text-right text-[10px] font-bold text-zinc-500">
              Tanpa nota
              <br />& harga
            </p>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-12 rotate-[10deg]">
          <ProductArt kind="helmet" accent="#ff4a1c" className="size-36 drop-shadow-2xl" />
        </div>
      </div>
    </div>
  );
}
