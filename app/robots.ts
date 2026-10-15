import type { MetadataRoute } from "next";
import { absUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/keranjang/", "/checkout/"],
    },
    sitemap: absUrl("/sitemap.xml"),
  };
}
