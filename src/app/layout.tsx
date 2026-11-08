import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "FDA Studio — Sites internet, intelligence artificielle, applications et jeux vidéo",
    template: "%s | FDA Studio",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  formatDetection: { telephone: false },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/**
 * CSP en balise meta : GitHub Pages ne permet pas d'en-têtes HTTP personnalisés.
 * 'unsafe-inline' sur script-src est requis par l'hydratation de l'export statique Next.js.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://doorknight.games",
  "media-src 'self' https://doorknight.games",
  "font-src 'self'",
  `connect-src 'self' https://*.supabase.co`,
  "base-uri 'self'",
  "form-action 'self' mailto:",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

/** Rétablit avant le premier affichage la pause des animations choisie pendant la visite. */
const pauseScript = `try{if(sessionStorage.getItem("fda-pause")==="1")document.documentElement.dataset.paused="true"}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={csp} />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <script dangerouslySetInnerHTML={{ __html: pauseScript }} />
        <noscript>
          <style>{`.reveal-line>span{transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <JsonLd data={organizationJsonLd} />
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
