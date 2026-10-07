import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { OrderList } from "./order-list";

export const metadata: Metadata = { title: "Pesanan Saya" };

export default function OrdersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pesanan"
        title="Pesanan Saya"
        description="Riwayat pesanan yang dibuat dari perangkat ini."
        crumbs={[{ label: "Pesanan Saya" }]}
      />
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        <OrderList />
      </div>
    </>
  );
}
