import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { CartView } from "./cart-view";

export const metadata: Metadata = { title: "Keranjang" };

export default function CartPage() {
  return (
    <>
      <PageHeader eyebrow="Keranjang" title="Keranjang Belanja" crumbs={[{ label: "Keranjang" }]} />
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <CartView />
      </div>
    </>
  );
}
