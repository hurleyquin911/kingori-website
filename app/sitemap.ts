import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { absUrl, productHref, sitemapEntries } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const { staticPages, cats } = sitemapEntries();
  return [
    ...staticPages.map((p) => ({
      url: absUrl(p.path),
      lastModified: now,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...cats.map((p) => ({
      url: absUrl(p.path),
      lastModified: now,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...products.map((p) => ({
      url: absUrl(productHref(p.slug)),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
