import Link from "next/link";
import { categories } from "@/lib/products";
import { banks, qris, store } from "@/lib/store-config";
import { Icon } from "./icon";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line bg-carbon">
      <div className="hazard h-1.5 w-full opacity-90" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="space-y-5">
          <Logo />
          <p className="max-w-sm text-sm leading-6 text-steel">
            {store.tagline}. Spare part, aksesoris motor &amp; mobil pilihan dengan harga bersahabat,
            dikirim cepat ke seluruh Indonesia.
          </p>
          <div className="space-y-2 text-sm text-steel">
            <p className="flex gap-2.5">
              <Icon name="pin" className="mt-0.5 size-4 shrink-0 text-ignite" />
              {store.address}
            </p>
            <p className="flex gap-2.5">
              <Icon name="clock" className="mt-0.5 size-4 shrink-0 text-ignite" />
              {store.operationalHours}
            </p>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-bold tracking-widest text-white uppercase">Kategori</h3>
          <ul className="space-y-2.5 text-sm text-steel">
            {categories.slice(0, 7).map((c) => (
              <li key={c.id}>
                <Link href={`/produk?kategori=${c.id}`} className="transition hover:text-ignite">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-bold tracking-widest text-white uppercase">Bantuan</h3>
          <ul className="space-y-2.5 text-sm text-steel">
            <li><Link href="/#cara-belanja" className="transition hover:text-ignite">Cara Belanja</Link></li>
            <li><Link href="/dropship" className="transition hover:text-ignite">Program Dropship</Link></li>
            <li><Link href="/pesanan" className="transition hover:text-ignite">Cek Status Pesanan</Link></li>
            <li><Link href="/keranjang" className="transition hover:text-ignite">Keranjang</Link></li>
            <li>
              <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noreferrer" className="transition hover:text-ignite">
                Chat Admin WhatsApp
              </a>
            </li>
            <li>
              <a href={store.shopeeUrl} target="_blank" rel="noreferrer" className="transition hover:text-ignite">
                Toko Shopee King Ori
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="mb-4 font-display text-sm font-bold tracking-widest text-white uppercase">Pembayaran</h3>
            <div className="flex flex-wrap gap-2">
              {banks.map((b) => (
                <span key={b.id} className="rounded-md bg-white px-2.5 py-1 text-xs font-extrabold italic" style={{ color: b.color }}>
                  {b.short}
                </span>
              ))}
              <span className="rounded-md bg-white px-2.5 py-1 text-xs font-extrabold text-[#e11d48]">QRIS</span>
            </div>
            <p className="mt-2 text-xs text-dim">QRIS bisa dibayar via {qris.supported.slice(0, 4).join(", ")} & lainnya.</p>
          </div>
          <div>
            <h3 className="mb-4 font-display text-sm font-bold tracking-widest text-white uppercase">Ikuti Kami</h3>
            <div className="flex gap-2">
              <a href={store.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid size-10 place-items-center rounded-xl border border-line bg-panel transition hover:border-ignite hover:text-ignite">
                <Icon name="instagram" />
              </a>
              <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid size-10 place-items-center rounded-xl border border-line bg-panel transition hover:border-ignite hover:text-ignite">
                <Icon name="whatsapp" />
              </a>
              <a href={store.shopeeUrl} target="_blank" rel="noreferrer" aria-label="Shopee" className="grid size-10 place-items-center rounded-xl border border-line bg-panel transition hover:border-ignite hover:text-ignite">
                <Icon name="store" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-dim sm:flex-row sm:px-6">
          <p>© {store.name}. Semua hak dilindungi.</p>
          <p className="font-display tracking-widest uppercase">Ride Ori. Ride Proud.</p>
        </div>
      </div>
    </footer>
  );
}
