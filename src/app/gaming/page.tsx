import type { Metadata } from "next";
import Link from "next/link";
import { GameVisual } from "@/components/visuals/GameVisual";
import { ArrowIcon, ExternalIcon } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { doorKnight as dk } from "@/lib/doorknight";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Gaming : Door Knight et nos jeux mobiles",
  description:
    "FDA Studio conçoit et développe ses propres jeux mobiles en 3D. Découvrez Door Knight, notre jeu d’action pour iPhone, iPad et Android.",
  path: "/gaming/",
  keywords: ["développement jeux vidéo", "jeu mobile 3D", "Door Knight", "studio de jeu vidéo Tours"],
});

/** Page Gaming : les jeux du studio, Door Knight en tête. */
export default function GamingPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "Gaming", path: "/gaming/" }])} />

      {/* Ouverture : Door Knight, la Chevalière et les liens */}
      <section aria-labelledby="gaming-title" className="relative overflow-hidden bg-night pb-[var(--section-y)] pt-28 md:pt-36">
        <div className="wrap">
          <nav aria-label="Fil d’Ariane" className="text-sm text-muted">
            <Link href="/" className="link-line hover:text-paper">Accueil</Link>
            <span aria-hidden className="mx-2 text-line-strong">/</span>
            <span aria-current="page" className="text-paper">Gaming</span>
          </nav>

          <div className="mt-10 grid items-center gap-10 md:grid-cols-12">
            <div className="order-2 md:order-1 md:col-span-6 lg:col-span-5">
              <h1 id="gaming-title" className="section-title">Nos jeux mobiles.</h1>
              <p className="mt-5 max-w-md text-lg text-[#cfcae3]">
                FDA Studio conçoit et développe ses propres jeux en 3D. Le premier s’appelle Door Knight ; d’autres univers sont en préparation.
              </p>
              <img src={dk.wordmark} alt="Door Knight" width={1200} height={799} loading="eager" decoding="async" className="mt-10 h-auto w-[min(22rem,72%)]" />
              <p className="mt-5 max-w-md text-[#cfcae3]">
                Un jeu d’action 3D pour iPhone, iPad et Android : franchissez les portes, affrontez les gardiens, gagnez votre butin.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={dk.url} target="_blank" rel="noopener noreferrer" className="btn btn-violet">
                  Voir le site du jeu
                  <span className="btn-icon"><ExternalIcon /></span>
                  <span className="sr-only">(nouvel onglet)</span>
                </a>
                <a href={dk.links.discord} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  Rejoindre le Discord
                  <span className="sr-only">(nouvel onglet)</span>
                </a>
              </div>
            </div>
            <div className="order-1 md:order-2 md:col-span-6 lg:col-span-7">
              <GameVisual />
            </div>
          </div>
        </div>
      </section>

      {/* Clôture : renvoi vers le formulaire de contact */}
      <section aria-labelledby="gaming-cta" className="section border-t border-line">
        <div className="wrap grid gap-8 md:grid-cols-12 md:items-end">
          <h2 id="gaming-cta" className="section-title md:col-span-7">Votre jeu ou votre expérience interactive.</h2>
          <div className="md:col-span-5">
            <p className="text-lg text-soft">Jeu mobile, application ludique ou expérience 3D pour votre marque : nous la concevons et la développons.</p>
            <Link href="/#contact" className="btn btn-primary mt-8">
              Démarrer un projet
              <span className="btn-icon"><ArrowIcon /></span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
