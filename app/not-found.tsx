import Link from "next/link";
import { Icon } from "@/components/icon";
import { ProductArt } from "@/components/product-art";

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-3xl place-items-center px-4 py-24 text-center">
      <ProductArt kind="tire" accent="#ff4a1c" className="size-40" />
      <p className="mt-6 font-display text-7xl font-bold text-gradient-ignite italic">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-white uppercase">Waduh, salah belok!</h1>
      <p className="mt-2 text-steel">Halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
      <Link href="/" className="btn-ignite mt-8">
        <Icon name="home" className="size-4" /> Kembali ke Beranda
      </Link>
    </div>
  );
}
