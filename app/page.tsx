import Link from "next/link";
import { FlashCountdown } from "@/components/home/flash-countdown";
import { Speedometer } from "@/components/home/speedometer";
import { Icon, type IconName } from "@/components/icon";
import { ProductArt } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { formatRupiah } from "@/lib/format";
import { categories, getProduct, products } from "@/lib/products";
import { courierServices } from "@/lib/shipping";
import { banks, store } from "@/lib/store-config";

const steps: { icon: IconName; title: string; text: string }[] = [
  { icon: "search", title: "Pilih Produk", text: "Cari spare part & aksesoris, pilih varian lalu masukkan ke keranjang." },
  { icon: "pin", title: "Isi Alamat Lengkap", text: "Lengkapi nama penerima, nomor WhatsApp dan alamat pengiriman." },
  { icon: "truck", title: "Pilih Pengiriman", text: "JNE, J&T, SiCepat, AnterAja, kurir instan, atau ambil di toko." },
  { icon: "wallet", title: "Transfer / Scan QRIS", text: "Bayar ke rekening resmi King Ori atau scan QRIS dari e-wallet." },
  { icon: "package", title: "Konfirmasi & Dikirim", text: "Kirim bukti bayar, pesanan diverifikasi lalu langsung dikirim." },
];

const perks: { icon: IconName; title: string; text: string }[] = [
  { icon: "shield", title: "100% Original", text: "Semua produk dijamin ori. Tidak ori? Uang kembali 2x lipat." },
  { icon: "wrench", title: "Garansi Tukar 7 Hari", text: "Barang tidak sesuai atau cacat produksi bisa langsung ditukar." },
  { icon: "package", title: "Packing Super Aman", text: "Bubble wrap tebal + kardus, gratis packing kayu untuk barang besar." },
  { icon: "headset", title: "Admin Fast Respon", text: "Bingung cari part yang cocok? Konsultasi gratis via WhatsApp." },
];

const testimonials = [
  {
    name: "Rizky A.",
    city: "Bekasi",
    ride: "Honda Vario 160",
    text: "Lampu LED projector-nya terang banget dan cut-off rapi. Packing aman, transfer dikonfirmasi cepat. Mantap King Ori!",
  },
  {
    name: "Dimas P.",
    city: "Yogyakarta",
    ride: "Yamaha NMax",
    text: "Beli shockbreaker tabung, ori dan bergaransi. Bayar pakai QRIS tinggal scan, besoknya sudah dikirim.",
  },
  {
    name: "Sari W.",
    city: "Surabaya",
    ride: "Honda Scoopy",
    text: "Helmnya cakep, warna sesuai foto. Adminnya ramah, dibantu pilih ukuran yang pas. Recommended seller!",
  },
];

export default function Home() {
  const flash = products.filter((p) => p.flashSale);
  const bestSellers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 8);
  const heroPicks = [
    getProduct("helm-full-face-kingrider-r1")!,
    getProduct("lampu-led-projector-h4-35w")!,
    getProduct("piringan-cakram-floating-220mm")!,
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-line">
        <div className="carbon absolute inset-0 -z-20" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_40%,rgba(255,74,28,0.28),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(47,211,255,0.12),transparent_50%)]" />
        <div className="absolute inset-0 -z-10 bg-[repeating-linear-gradient(115deg,transparent_0_60px,rgba(255,255,255,0.025)_60px_62px)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20 lg:pb-28">
          <div>
            <span className="chip border-ignite/40 bg-ignite/10 text-ignite">
              <Icon name="bolt" className="size-3.5" />
              Spare Part &amp; Aksesoris Original
            </span>
            <h1 className="mt-6 font-display text-5xl leading-[0.95] font-bold tracking-tight uppercase italic sm:text-6xl xl:text-7xl">
              <span className="text-chrome">Upgrade</span>
              <br />
              <span className="text-chrome">Tunggangan,</span>
              <br />
              <span className="text-gradient-ignite">Gas Pol Tampil Ori.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-steel sm:text-lg">
              Dari helm, lampu LED, oli, kampas rem sampai shockbreaker — semua original, bergaransi,
              dan siap kirim ke seluruh Indonesia. Bayar mudah via transfer bank atau scan QRIS.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/produk" className="btn-ignite">
                Belanja Sekarang
                <Icon name="arrowRight" className="size-4" />
              </Link>
              <Link href="#kategori" className="btn-ghost">
                Lihat Kategori
              </Link>
            </div>

            <dl className="mt-12 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
              {[
                ["4.9", "Rating toko"],
                ["50rb+", "Produk terjual"],
                ["100%", "Original"],
                ["1–3 hr", "Pengiriman"],
              ].map(([v, l]) => (
                <div key={l} className="bg-panel/90 px-4 py-4 backdrop-blur">
                  <dt className="text-[11px] font-semibold tracking-wider text-dim uppercase">{l}</dt>
                  <dd className="mt-1 font-display text-2xl font-bold text-white">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-[540px]">
            <div className="absolute inset-8 -z-10 rounded-full bg-ignite/25 blur-3xl" />
            <Speedometer className="w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]" />

            {heroPicks.map((p, i) => (
              <Link
                key={p.slug}
                href={`/produk/${p.slug}`}
                className={`absolute flex animate-float items-center gap-3 rounded-2xl border border-line-2 bg-panel/85 p-2 pr-4 shadow-2xl shadow-black/50 backdrop-blur-md transition hover:border-ignite ${
                  ["-top-2 -left-2 sm:-left-8", "top-[42%] -right-2 sm:-right-10", "-bottom-4 left-[8%]"][i]
                }`}
                style={{ animationDelay: `${i * -2}s`, ["--tilt" as string]: `${[-4, 3, -2][i]}deg` }}
              >
                <span className="grid size-14 place-items-center rounded-xl bg-carbon">
                  <ProductArt kind={p.art} accent={p.accent} className="size-12" />
                </span>
                <span className="leading-tight">
                  <span className="block max-w-32 truncate text-xs font-semibold text-steel">{p.name}</span>
                  <span className="block font-display text-sm font-bold text-ignite">{formatRupiah(p.price)}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* KATEGORI */}
      <section id="kategori" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-20 sm:px-6">
        <SectionHeading eyebrow="Garasi King Ori" title="Belanja per Kategori" href="/produk" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => {
            const count = products.filter((p) => p.category === c.id).length;
            return (
              <Link
                key={c.id}
                href={`/produk?kategori=${c.id}`}
                className="group relative overflow-hidden rounded-2xl border border-line bg-panel p-4 transition hover:-translate-y-0.5 hover:border-ignite/60"
              >
                <div className="absolute -top-10 -right-10 size-28 rounded-full bg-ignite/0 blur-2xl transition group-hover:bg-ignite/25" />
                <ProductArt kind={c.art} accent="#ff4a1c" className="size-16 transition duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]" />
                <p className="mt-3 font-display font-bold tracking-wide text-white uppercase">{c.name}</p>
                <p className="mt-0.5 text-xs text-dim">{c.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-steel group-hover:text-ignite">
                  {count} produk <Icon name="arrowRight" className="size-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FLASH SALE */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-hazard/25 bg-gradient-to-br from-[#1d1608] via-panel to-panel p-5 sm:p-8">
          <div className="hazard absolute inset-x-0 top-0 h-1.5" />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-xl bg-hazard text-asphalt shadow-[0_0_30px_rgba(255,196,20,0.45)]">
                <Icon name="bolt" className="size-6" />
              </span>
              <div>
                <h2 className="font-display text-2xl font-bold tracking-wide text-white uppercase italic sm:text-3xl">
                  Promo Ngebut
                </h2>
                <p className="text-sm text-steel">Harga spesial, stok terbatas — berakhir dalam</p>
              </div>
            </div>
            <FlashCountdown />
          </div>
          <div className="no-scrollbar -mx-5 mt-6 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8">
            {flash.map((p) => (
              <div key={p.slug} className="w-56 shrink-0 snap-start sm:w-60">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TERLARIS */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <SectionHeading eyebrow="Paling banyak dicari" title="Produk Terlaris" href="/produk" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* BANNER */}
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pt-20 sm:px-6 md:grid-cols-2">
        <PromoBanner
          eyebrow="Paket Servis Hemat"
          title="Rawat Mesin, Tarikan Makin Enteng"
          text="Oli full synthetic, busi iridium & kampas rem ceramic. Servis rutin jadi lebih hemat."
          href="/produk?kategori=perawatan"
          arts={[
            ["oil", "#ff4a1c"],
            ["sparkplug", "#2fd3ff"],
          ]}
          tone="from-ignite/25"
        />
        <PromoBanner
          eyebrow="Touring Ready"
          title="Siap Jalan Jauh, Tetap Aman & Nyaman"
          text="Helm SNI, sarung tangan rider & holder HP anti getar untuk perjalanan tanpa drama."
          href="/produk?kategori=helm"
          arts={[
            ["helmet", "#2fd3ff"],
            ["gloves", "#ffc414"],
          ]}
          tone="from-nitro/20"
        />
      </section>

      {/* CARA BELANJA */}
      <section id="cara-belanja" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-24 sm:px-6">
        <div className="text-center">
          <p className="font-display text-sm font-semibold tracking-[0.3em] text-ignite uppercase">Cara Belanja</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-wide text-white uppercase italic sm:text-4xl">
            5 Langkah, Barang Langsung Meluncur
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-steel">
            Tanpa ribet payment gateway. Cukup checkout, isi alamat, pilih kurir lalu transfer ke rekening
            resmi atau scan QRIS King Ori.
          </p>
        </div>
        <div className="relative mt-12">
          <div className="absolute top-8 right-[10%] left-[10%] hidden h-1 rounded-full bg-[repeating-linear-gradient(90deg,#343a47_0_18px,transparent_18px_30px)] lg:block" />
          <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => (
              <li key={s.title} className="card relative p-5 pt-6 text-center lg:border-0 lg:bg-transparent">
                <span className="relative mx-auto grid size-16 place-items-center rounded-2xl border border-ignite/40 bg-panel-2 text-ignite shadow-[0_0_30px_-6px_rgba(255,74,28,0.6)]">
                  <Icon name={s.icon} className="size-7" />
                  <span className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-hazard font-display text-xs font-bold text-asphalt">
                    {i + 1}
                  </span>
                </span>
                <h3 className="mt-4 font-display text-lg font-bold tracking-wide text-white uppercase">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-steel">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <div className="card p-6">
            <p className="flex items-center gap-2 font-display text-sm font-bold tracking-widest text-steel uppercase">
              <Icon name="wallet" className="size-4 text-ignite" /> Metode Pembayaran
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {banks.map((b) => (
                <span key={b.id} className="flex h-11 items-center rounded-lg bg-white px-4 text-sm font-extrabold italic" style={{ color: b.color }}>
                  {b.short}
                </span>
              ))}
              <span className="flex h-11 items-center gap-1.5 rounded-lg bg-white px-4 text-sm font-extrabold text-[#e11d48]">
                <Icon name="qr" className="size-4" /> QRIS
              </span>
            </div>
          </div>
          <div className="card p-6">
            <p className="flex items-center gap-2 font-display text-sm font-bold tracking-widest text-steel uppercase">
              <Icon name="truck" className="size-4 text-ignite" /> Jasa Pengiriman
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[...new Set(courierServices.map((c) => c.courier))].map((c) => (
                <span key={c} className="flex h-11 items-center rounded-lg border border-line-2 bg-panel-2 px-4 text-sm font-bold text-chrome">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* KEUNGGULAN */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p) => (
            <div key={p.title} className="group card corner-cut relative overflow-hidden p-6 transition hover:border-ignite/50">
              <div className="absolute -right-6 -bottom-6 text-white/[0.03] transition group-hover:text-ignite/10">
                <Icon name={p.icon} className="size-32" />
              </div>
              <span className="grid size-12 place-items-center rounded-xl bg-ignite/10 text-ignite">
                <Icon name={p.icon} className="size-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold tracking-wide text-white uppercase">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-steel">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONI */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <SectionHeading eyebrow="Kata para rider" title="Ulasan Pembeli" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="card flex flex-col p-6">
              <div className="flex gap-0.5 text-hazard">
                {Array.from({ length: 5 }, (_, i) => (
                  <Icon key={i} name="star" className="size-4" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 leading-7 text-chrome">“{t.text}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-hazard to-ignite font-display font-bold text-asphalt">
                  {t.name[0]}
                </span>
                <span>
                  <span className="block font-semibold text-white">{t.name}</span>
                  <span className="block text-xs text-dim">
                    {t.city} · {t.ride}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* DROPSHIP */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <Link
          href="/dropship"
          className="group relative isolate grid items-center gap-8 overflow-hidden rounded-3xl border border-hazard/30 bg-gradient-to-br from-[#1f1806] via-panel to-panel p-7 transition hover:border-hazard/60 sm:p-10 md:grid-cols-[1fr_auto]"
        >
          <div className="hazard absolute inset-x-0 top-0 h-1.5" />
          <div className="grid-lines absolute inset-0 -z-10 opacity-40" />
          <div>
            <span className="chip border-hazard/40 bg-hazard/10 text-hazard">
              <Icon name="package" className="size-3.5" /> Program Dropship
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-wide text-white uppercase italic sm:text-4xl">
              Mau Bisnis Spare Part <span className="text-hazard">Tanpa Stok?</span>
            </h2>
            <p className="mt-3 max-w-xl text-steel">
              Jadi dropshipper King Ori — gratis daftar, paket dikirim atas nama tokomu dan tanpa nota harga. Kamu
              cukup jualan, kami yang packing & kirim.
            </p>
            <span className="btn-ignite mt-6 bg-hazard text-asphalt hover:bg-[#ffd24d]">
              Gabung Dropship <Icon name="arrowRight" className="size-4 transition group-hover:translate-x-1" />
            </span>
          </div>
          <div className="relative hidden h-56 w-80 md:block">
            <ProductArt kind="cover" accent="#ffc414" className="absolute right-20 bottom-0 size-52 transition duration-500 group-hover:-translate-y-2" />
            <ProductArt kind="shock" accent="#ffc414" className="absolute right-0 bottom-2 size-40 rotate-12 transition duration-500 group-hover:-translate-y-3" />
          </div>
        </Link>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <div className="relative isolate overflow-hidden rounded-3xl border border-ignite/30 px-6 py-12 sm:px-12">
          <div className="carbon absolute inset-0 -z-20" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ignite/30 via-ignite/5 to-transparent" />
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-wide text-white uppercase italic sm:text-4xl">
                Bingung part mana yang cocok?
              </h2>
              <p className="mt-3 max-w-xl text-steel">
                Kirim tipe & tahun motor/mobilmu, admin King Ori bantu carikan part yang pas. King Ori juga
                tersedia di Shopee.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noreferrer" className="btn-ignite">
                <Icon name="whatsapp" className="size-4" /> Chat Admin
              </a>
              <a href={store.shopeeUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                <Icon name="store" className="size-4" /> Shopee King Ori
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ eyebrow, title, href }: { eyebrow: string; title: string; href?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="flex items-center gap-2 font-display text-sm font-semibold tracking-[0.3em] text-ignite uppercase">
          <span className="h-0.5 w-6 bg-ignite" />
          {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-wide text-white uppercase italic sm:text-4xl">
          {title}
        </h2>
      </div>
      {href && (
        <Link href={href} className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-steel transition hover:text-ignite sm:flex">
          Lihat semua <Icon name="arrowRight" className="size-4" />
        </Link>
      )}
    </div>
  );
}

function PromoBanner({
  eyebrow,
  title,
  text,
  href,
  arts,
  tone,
}: {
  eyebrow: string;
  title: string;
  text: string;
  href: string;
  arts: [Parameters<typeof ProductArt>[0]["kind"], string][];
  tone: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative isolate flex min-h-64 overflow-hidden rounded-3xl border border-line bg-gradient-to-br ${tone} to-panel p-7 transition hover:border-ignite/50`}
    >
      <div className="grid-lines absolute inset-0 -z-10 opacity-50" />
      <div className="relative z-10 max-w-[58%]">
        <p className="font-display text-xs font-semibold tracking-[0.3em] text-hazard uppercase">{eyebrow}</p>
        <h3 className="mt-2 font-display text-2xl leading-tight font-bold text-white uppercase italic">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-steel">{text}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-ignite">
          Belanja paket <Icon name="arrowRight" className="size-4 transition group-hover:translate-x-1" />
        </span>
      </div>
      <div className="absolute -right-4 bottom-0 flex items-end">
        <ProductArt kind={arts[0][0]} accent={arts[0][1]} className="size-44 transition duration-500 group-hover:-translate-y-2 sm:size-52" />
        <ProductArt kind={arts[1][0]} accent={arts[1][1]} className="-ml-16 size-32 transition duration-500 group-hover:-translate-y-3 sm:size-36" />
      </div>
    </Link>
  );
}
