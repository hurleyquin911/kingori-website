import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { categories, getCategory, products } from "@/lib/products";
import { absUrl, breadcrumbJsonLd, categoryHref } from "@/lib/seo";
import { CatalogView } from "../../catalog-view";

export function generateStaticParams() {
  return categories.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/produk/kategori/[id]">): Promise<Metadata> {
  const { id } = await params;
  const category = getCategory(id);
  if (!category) return { title: "Kategori tidak ditemukan" };
  const count = products.filter((p) => p.category === id).length;
  const title = `${category.name} Original`;
  const description = `Jual ${category.name.toLowerCase()} original di King Ori. ${category.blurb}. ${count} produk siap kirim ke seluruh Indonesia, checkout via WhatsApp.`;
  return {
    title,
    description,
    keywords: [category.name, "King Ori", "original", category.blurb],
    alternates: { canonical: categoryHref(id) },
    openGraph: {
      title: `${title} | King Ori`,
      description,
      url: absUrl(categoryHref(id)),
    },
  };
}

export default async function CategoryPage({ params }: PageProps<"/produk/kategori/[id]">) {
  const { id } = await params;
  const category = getCategory(id);
  if (!category) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Beranda", path: "/" },
          { name: "Katalog", path: "/produk/" },
          { name: category.name, path: categoryHref(id) },
        ])}
      />
      <PageHeader
        eyebrow="Kategori"
        title={category.name}
        description={`Katalog ${category.name.toLowerCase()} original King Ori. ${category.blurb}. Filter harga, cari tipe kendaraan, lalu checkout via WhatsApp.`}
        crumbs={[{ label: "Katalog", href: "/produk" }, { label: category.name }]}
      />
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <Suspense fallback={<div className="card h-[480px] animate-pulse" />}>
          <CatalogView />
        </Suspense>
      </div>
    </>
  );
}
