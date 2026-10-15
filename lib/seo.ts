import { categories, getCategory, type Product } from "./products";
import { store } from "./store-config";

export const siteUrl = "https://kingori.store";

export const seo = {
  title: "King Ori | Suku Cadang Motor, Aksesoris Mobil & Spare Part Original",
  description:
    "Toko King Ori: jual suku cadang motor, suku cadang mobil, aksesoris eksterior & interior, helm, lampu LED, oli, kampas rem, charger, dan perkakas kendaraan original. Kirim ke seluruh Indonesia, checkout via WhatsApp.",
  keywords: [
    "King Ori",
    "suku cadang motor",
    "suku cadang mobil",
    "aksesoris motor",
    "aksesoris mobil",
    "spare part original",
    "helm SNI",
    "kampas rem",
    "oli motor matic",
    "lampu LED motor",
    "toko spare part Jakarta",
    "dropship suku cadang",
  ],
};

export function absUrl(path = "/") {
  const p = path.startsWith("/") ? path : `/${path}`;
  return new URL(p, siteUrl).toString();
}

export function categoryHref(id: string) {
  return `/produk/kategori/${id}/`;
}

export function productHref(slug: string) {
  return `/produk/${slug}/`;
}

export function organizationJsonLd() {
  return {
    "@type": "AutoPartsStore",
    name: store.name,
    alternateName: ["KingOri", "King Ori Otomotif"],
    url: siteUrl,
    image: absUrl("/opengraph-image"),
    description: seo.description,
    telephone: `+${store.whatsapp}`,
    email: store.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: store.address,
      addressLocality: "Jakarta Timur",
      addressRegion: "DKI Jakarta",
      postalCode: "13450",
      addressCountry: "ID",
    },
    openingHours: "Mo-Sa 08:00-20:00",
    priceRange: "$$",
    sameAs: [store.shopeeUrl, store.instagram],
    areaServed: { "@type": "Country", name: "Indonesia" },
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    name: store.name,
    url: siteUrl,
    inLanguage: "id-ID",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/produk/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function productJsonLd(product: Product) {
  const category = getCategory(product.category);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.slug,
    brand: { "@type": "Brand", name: product.brand },
    category: category?.name,
    url: absUrl(productHref(product.slug)),
    image: absUrl("/opengraph-image"),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
    offers: {
      "@type": "Offer",
      url: absUrl(productHref(product.slug)),
      priceCurrency: "IDR",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: store.name },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absUrl(item.path),
    })),
  };
}

export function sitemapEntries() {
  const staticPages = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/produk/", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/dropship/", priority: 0.8, changeFrequency: "monthly" as const },
  ];
  const cats = categories.map((c) => ({
    path: categoryHref(c.id),
    priority: 0.8,
    changeFrequency: "weekly" as const,
  }));
  return { staticPages, cats };
}
