import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "kingori-website";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? `/${repoName}` : "",
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