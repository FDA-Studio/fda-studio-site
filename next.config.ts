import type { NextConfig } from "next";

// Export statique servi par Vercel (en-têtes de sécurité dans vercel.json).
// Préfixe d'URL : vide en production ; NEXT_PUBLIC_BASE_PATH reste possible pour un aperçu en sous-dossier.
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
