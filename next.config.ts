import type { NextConfig } from "next";

// Export statique : le site est hébergé sur GitHub Pages (standard FDA Studio pour les sites du groupe).
// Préfixe d'URL : vide sur le domaine définitif, "/fda-studio-site" sur l'adresse provisoire github.io
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
