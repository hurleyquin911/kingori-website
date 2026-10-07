import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { CheckoutView } from "./checkout-view";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Checkout"
        title="Selesaikan Pesananmu"
        description="Lengkapi alamat, pilih jasa pengiriman dan metode pembayaran. Pembayaran via transfer bank atau QRIS."
        crumbs={[{ label: "Keranjang", href: "/keranjang" }, { label: "Checkout" }]}
      />
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <CheckoutView />
      </div>
    </>
  );
}
