import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { LOGO_SYMBOL_PATH } from "@/components/brand/Logo";
import { articleBySlug, getArticles } from "@/lib/articles";
import { serviceBySlug } from "@/lib/services";

/**
 * Image d'aperçu propre à chaque article, servie à /ressources/<slug>/og.png (LinkedIn, messageries, réseaux sociaux).
 * Générée au build (export statique) : titre de l'article, service, marque.
 * Police : Inter (OFL), instances statiques tirées de src/fonts (le moteur d'image ne lit pas le woff2).
 */
export const dynamic = "force-static";
const size = { width: 1200, height: 630 };

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

const font = (file: string) => readFileSync(join(process.cwd(), "src", "fonts", "og", file));

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const a = articleBySlug((await params).slug);
  const title = a?.title ?? "Ressources";
  const service = a ? serviceBySlug(a.service)?.name : undefined;
  // Titres longs : on réduit le corps pour rester sur quatre lignes au plus
  const fontSize = title.length > 80 ? 54 : title.length > 55 ? 62 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#0a0a0b",
          backgroundImage: "radial-gradient(70% 90% at 92% 0%, rgba(47,91,255,0.38) 0%, rgba(10,10,11,0) 60%)",
          color: "#f4f4f2",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="54" height="50" viewBox="0 -2 134 124">
            <path d={LOGO_SYMBOL_PATH} fill="#f4f4f2" fillRule="evenodd" />
          </svg>
          <div style={{ display: "flex", fontSize: 26, color: "#a7abb2" }}>
            {service ? `Ressources · ${service}` : "Ressources"}
          </div>
        </div>

        <div style={{ display: "flex", fontSize, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.035em", maxWidth: 1000 }}>
          {title}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24, color: "#c9cbd0" }}>
          <div style={{ display: "flex" }}>FDA Studio · Agence web et IA à Tours</div>
          <div style={{ display: "flex", color: "#6f8bff" }}>fdastudio.fr</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: font("inter-regular.ttf"), weight: 400, style: "normal" },
        { name: "Inter", data: font("inter-semibold.ttf"), weight: 600, style: "normal" },
      ],
    },
  );
}
