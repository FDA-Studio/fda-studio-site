import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { EmmaChat } from "@/components/chat/EmmaChat";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { SoundEvents } from "@/components/SoundEvents";
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
 * CSP en balise meta : GitHub Pages ne permet pas d'en-têtes HTTP personnalisés.
 * 'unsafe-inline' sur script-src est requis par l'hydratation de l'export statique Next.js.
 */
const csp = [
  "default-src 'self'",
  // blob: — modules audio (AudioWorklet) de la démo vocale « Parler à Emma »
  "script-src 'self' 'unsafe-inline' blob:",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://doorknight.games",
  // blob: — le moteur du monde 3D charge chaque segment vidéo en mémoire pour un défilement image à image
  "media-src 'self' blob: https://doorknight.games",
  "font-src 'self'",
  // app.fdastudio.fr : demandes de devis et sessions de démo vocale ; ElevenLabs : conversation avec Emma
  `connect-src 'self' https://app.fdastudio.fr https://api.elevenlabs.io wss://api.elevenlabs.io`,
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
