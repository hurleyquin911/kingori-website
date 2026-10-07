import { formatRupiah } from "@/lib/format";
import { store } from "@/lib/store-config";
import { Icon } from "./icon";

const messages = [
  `Gratis ongkir s.d. ${formatRupiah(store.freeShippingMaxDiscount)} untuk belanja min. ${formatRupiah(store.freeShippingMin)}`,
  "100% produk original bergaransi",
  "Bayar via transfer bank atau QRIS",
  "Pesanan sebelum 15.00 WIB dikirim hari ini",
  "Garansi tukar 7 hari jika barang tidak sesuai",
];

export function AnnouncementBar() {
  const row = [...messages, ...messages];
  return (
    <div className="relative overflow-hidden border-b border-line bg-carbon py-2 text-xs font-semibold tracking-wide text-steel">
      <div className="flex w-max animate-marquee gap-10">
        {row.map((m, i) => (
          <span key={i} className="flex items-center gap-2 whitespace-nowrap">
            <Icon name="bolt" className="size-3.5 text-hazard" />
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
