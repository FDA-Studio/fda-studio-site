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

      {/* Les quatre classes, telles que les présente doorknight.games */}
      <section aria-labelledby="classes-title" className="section bg-ink">
        <div className="wrap">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <h2 id="classes-title" className="section-title md:col-span-7">Quatre classes de héros.</h2>
            <p className="text-lg text-soft md:col-span-5">Chacune a son style de combat et sa capacité signature.</p>
          </div>
          <ul className="mt-14 grid grid-cols-2 gap-4 md:mt-20 lg:grid-cols-4 lg:gap-5">
            {dk.classes.map((c) => (
              <li key={c.name} className="tile overflow-hidden">
                <div className="aspect-[4/5] bg-[radial-gradient(closest-side,rgba(110,75,255,0.28),transparent)]">
                  <img src={c.img} alt={`${c.name}, classe de Door Knight`} loading="lazy" decoding="async" className="h-full w-full object-contain p-4" />
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="tile-title">{c.name}</h3>
                  <p className="mt-2 text-sm text-soft md:text-base">{c.text}</p>
                </div>
              </li>
            ))}
          </ul>
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
