import type { NextConfig } from "next";

// Export statique : le site est hébergé sur GitHub Pages (standard FDA Studio pour les sites du groupe).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
