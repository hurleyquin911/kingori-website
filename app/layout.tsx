import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Plus_Jakarta_Sans } from "next/font/google";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/toaster";
import { organizationJsonLd, seo, siteUrl, websiteJsonLd } from "@/lib/seo";
import { store } from "@/lib/store-config";
import "./globals.css";

const chakra = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: seo.title,
    template: `%s | ${store.name}`,
  },
  description: seo.description,
  keywords: seo.keywords,
  applicationName: store.name,
  authors: [{ name: store.name, url: siteUrl }],
  creator: store.name,
  publisher: store.name,
  category: "otomotif",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: store.name,
    title: seo.title,
    description: seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#08090b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" data-scroll-behavior="smooth" className={`${chakra.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <JsonLd data={{ "@context": "https://schema.org", "@graph": [organizationJsonLd(), websiteJsonLd()] }} />
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
