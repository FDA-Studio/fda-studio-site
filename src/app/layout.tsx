import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { EmmaChat } from "@/components/chat/EmmaChat";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { SoundEvents } from "@/components/SoundEvents";
import cspConfig from "@/lib/csp.json";
import { organizationJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "FDA Studio — Agence web et IA à Tours : sites, applications, IA",
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
 * CSP en balise meta, tirée de la source unique src/lib/csp.json (raisons de chaque source dedans).
 * Sur Vercel, l'en-tête HTTP de vercel.json porte la même règle ; la balise reste pour le secours
 * GitHub Pages, qui n'envoie pas d'en-têtes. Les directives ignorées en meta (frame-ancestors)
 * ne sont posées que par l'en-tête. scripts/check-csp.mjs bloque le build si les deux divergent.
 */
const csp = Object.entries(cspConfig.directives)
  .filter(([name]) => !cspConfig.headerOnly.includes(name))
  .map(([name, sources]) => [name, ...sources].join(" "))
  .join("; ");

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
        <SoundEvents />
        <JsonLd data={organizationJsonLd} />
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
        <EmmaChat />
      </body>
    </html>
  );
}
