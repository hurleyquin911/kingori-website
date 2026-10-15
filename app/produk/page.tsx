import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { CatalogView } from "./catalog-view";

export const metadata: Metadata = {
  title: "Katalog Suku Cadang Motor & Aksesoris Mobil Original",
  description:
    "Katalog lengkap King Ori: suku cadang motor, suku cadang mobil, aksesoris eksterior & interior, helm, lampu LED, oli, kampas rem, charger, dan perkakas kendaraan original.",
  alternates: { canonical: "/produk/" },
};

export default function CatalogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Katalog"
        title="Katalog Suku Cadang & Aksesoris"
        description="Filter suku cadang motor, suku cadang mobil, aksesoris kendaraan, atau cari langsung tipe motor/mobilmu."
        crumbs={[{ label: "Katalog" }]}
      />
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogView />
        </Suspense>
      </div>
    </>
  );
}

function CatalogSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <div className="card hidden h-[560px] animate-pulse lg:block" />
      <div>
        <div className="h-12 animate-pulse rounded-lg bg-panel" />
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="card aspect-[3/4.3] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
