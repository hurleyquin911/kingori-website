import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Icon } from "@/components/icon";
import { PageHeader } from "@/components/page-header";
import { ProductCard } from "@/components/product-card";
import { getCategory, getProduct, products } from "@/lib/products";
import { ProductShowcase } from "./product-showcase";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produk/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Produk tidak ditemukan" };
  return { title: product.name, description: product.description };
}

export default function ProductPage({ params }: PageProps<"/produk/[slug]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <ProductDetail params={params} />
    </Suspense>
  );
}

async function ProductDetail({ params }: Pick<PageProps<"/produk/[slug]">, "params">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = products
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category) || b.sold - a.sold)
    .slice(0, 4);

  return (
    <>
      <PageHeader
        compact
        crumbs={[
          { label: "Katalog", href: "/produk" },
          { label: category?.name ?? "Produk", href: `/produk?kategori=${product.category}` },
          { label: product.brand },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <ProductShowcase product={product} categoryName={category?.name ?? ""} />

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="card p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold tracking-wide text-white uppercase">
              <span className="h-5 w-1 bg-ignite" /> Deskripsi Produk
            </h2>
            <p className="mt-4 leading-7 text-steel">{product.description}</p>
            <ul className="mt-6 grid gap-3">
              {product.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-chrome">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-turbo/15 text-turbo">
                    <Icon name="check" className="size-3.5" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </section>
          <section className="card p-6 sm:p-8">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold tracking-wide text-white uppercase">
              <span className="h-5 w-1 bg-ignite" /> Spesifikasi
            </h2>
            <dl className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line">
              {[["Merek", product.brand], ...product.specs, ["Kompatibel", product.compatibility]].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[120px_1fr] gap-3 bg-carbon/60 px-4 py-3 text-sm">
                  <dt className="text-dim">{k}</dt>
                  <dd className="font-medium text-chrome">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold tracking-wide text-white uppercase italic sm:text-3xl">
            Mungkin Kamu Juga Butuh
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card aspect-square animate-pulse" />
        <div className="space-y-4">
          <div className="h-6 w-1/3 animate-pulse rounded bg-panel" />
          <div className="h-10 w-4/5 animate-pulse rounded bg-panel" />
          <div className="h-28 animate-pulse rounded-2xl bg-panel" />
          <div className="h-40 animate-pulse rounded-2xl bg-panel" />
        </div>
      </div>
    </div>
  );
}
