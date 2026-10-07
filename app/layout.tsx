import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Plus_Jakarta_Sans } from "next/font/google";
import { AnnouncementBar } from "@/components/announcement-bar";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/toaster";
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
  title: {
    default: `${store.name} — ${store.tagline}`,
    template: `%s | ${store.name}`,
  },
  description:
    "King Ori: toko spare part & aksesoris motor dan mobil original. Helm, lampu LED, oli, kampas rem, shockbreaker, holder HP dan banyak lagi. Bayar via transfer bank atau QRIS.",
};

export const viewport: Viewport = {
  themeColor: "#08090b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" data-scroll-behavior="smooth" className={`${chakra.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
