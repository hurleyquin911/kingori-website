import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Domain sendiri (kingori.store via CNAME) di root, jadi basePath harus kosong.
  // Kalau basePath "/kingori-website", CSS/JS 404 dan halaman tampil tanpa gaya.
  trailingSlash: true,
  images: {
    unoptimized: true, // Wajib agar komponen <Image /> dari Next.js berfungsi di GitHub Pages
  },
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
