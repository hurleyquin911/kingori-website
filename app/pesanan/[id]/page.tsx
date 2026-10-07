import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { OrderView } from "./order-view";

export const metadata: Metadata = { title: "Instruksi Pembayaran" };

export default function OrderPage({ params }: PageProps<"/pesanan/[id]">) {
  return (
    <>
      <PageHeader
        eyebrow="Pembayaran"
        title="Instruksi Pembayaran"
        crumbs={[{ label: "Pesanan Saya", href: "/pesanan" }, { label: "Detail" }]}
      />
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <Suspense fallback={<div className="card h-[600px] animate-pulse" />}>
          <OrderView params={params} />
        </Suspense>
      </div>
    </>
  );
}
