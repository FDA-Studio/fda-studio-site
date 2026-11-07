import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ProjectCover } from "@/components/ProjectCover";
import { DoorPicker } from "@/components/demos/DoorPicker";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { JsonLd } from "@/components/JsonLd";
import { ArrowIcon, ExternalIcon } from "@/components/icons";
import { externalLinks, site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Gaming : Door Knight et nos univers de jeu",
  description: "FDA Studio développe ses propres jeux vidéo. Door Knight 2.0, jeu d'action 3D pour iPhone, iPad et Android, est en développement avec une bêta TestFlight.",
  path: "/gaming/",
  keywords: ["développement jeux vidéo", "jeu mobile 3D", "Door Knight", "studio de jeu indépendant"],
});

const features = [
  ["Mille portes", "Dix mondes, dix zones par monde, dix portes par zone. Chaque zone se termine par un boss, chaque monde par un gardien."],
  ["Quatre classes", "Chevalier, Archer, Mage et Samouraï, chacun avec sa capacité signature, en version masculine ou féminine."],
  ["Butin et forge", "Des objets nommés par rareté, des chances de butin affichées sur chaque porte et une forge jusqu’à +15."],
  ["Un camp qui travaille", "Scierie, carrière et mine de cristal produisent des ressources même lorsque le jeu est fermé."],
  ["Guildes et classement", "Un objectif de guilde chaque semaine et un classement mondial selon la porte la plus haute atteinte."],
  ["Une seule progression", "La sauvegarde est en ligne et suit le joueur d’un appareil à l’autre."],
];

const gameLd = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: "Door Knight 2.0",
  url: externalLinks.doorknight,
  genre: ["Action", "Dungeon"],
  gamePlatform: ["iOS", "iPadOS", "Android"],
  playMode: ["SinglePlayer", "MultiPlayer"],
  author: { "@id": `${site.url}/#organization` },
};

export default function GamingPage() {
  return (
    <div className="bg-night">
      <JsonLd data={gameLd} />
      <PageHeader
        tone="night"
        crumbs={[{ name: "Gaming", path: "/gaming/" }]}
        lines={["Des mondes", "qu’on a envie", "d’explorer."]}
        intro={<p>Le jeu vidéo est notre laboratoire le plus exigeant. Nous concevons, développons et éditons nos propres jeux, à commencer par Door Knight.</p>}
      />

      {/* Door Knight */}
      <section aria-labelledby="dk-title" className="section !pt-0">
        <div className="wrap">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10">
            <ProjectCover variant="doors" className="aspect-[4/3] md:aspect-[21/9]" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night via-night/80 to-transparent p-6 pt-24 md:p-12 md:pt-40">
              <p className="inline-flex items-center gap-2 rounded-full border border-violet/40 bg-night/60 px-3 py-1.5 text-xs text-paper backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-violet" aria-hidden /> En développement, bêta TestFlight
              </p>
              <h2 id="dk-title" className="text-giant mt-5 font-semibold leading-none tracking-[-0.05em]">Door Knight 2.0</h2>
              <p className="mt-4 max-w-xl text-lg text-[#c9c4dc]">Choisis ta porte. Affronte ce qu’il y a derrière. Un jeu d’action 3D pour iPhone, iPad et Android, gratuit avec achats optionnels.</p>
              <a href={externalLinks.doorknight} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-8">
                Visiter doorknight.games <span className="btn-icon"><ExternalIcon /></span><span className="sr-only">(nouvel onglet)</span>
              </a>
            </div>
          </div>

          <dl className="mt-16 grid gap-x-10 gap-y-10 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(([t, d]) => (
              <div key={t}>
                <dt className="text-heading">{t}</dt>
                <dd className="mt-3 text-[#c9c4dc]">{d}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 text-sm text-[#a59fc0]">La date de sortie n’est pas encore annoncée. Elle sera communiquée en priorité sur le Discord du jeu.</p>
        </div>
      </section>

      {/* Mini-expérience */}
      <section aria-labelledby="porte-title" className="section border-t border-white/10">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h2 id="porte-title" className="text-title">Essayez une porte.</h2>
            <p className="mt-6 text-lg text-[#c9c4dc]">Une mini-expérience construite pour ce site, dans l’esprit du jeu. Trois portes, trois destins, tirés au hasard à chaque partie.</p>
          </div>
          <div className="min-w-0 lg:col-span-7 lg:col-start-6"><DoorPicker /></div>
        </div>
      </section>

      {/* Ambition */}
      <section aria-labelledby="ambition-title" className="section border-t border-white/10">
        <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <h2 id="ambition-title" className="text-title">Notre ambition gaming.</h2>
            <div className="mt-8 space-y-6 text-lg text-[#c9c4dc]">
              <p>Construire des univers originaux qui durent : des jeux mobiles soignés, des communautés vivantes et des systèmes de progression qui respectent le temps des joueurs.</p>
              <p>Chaque jeu est aussi une école. Optimisation temps réel, serveurs, économie, direction artistique : ce que nous apprenons ici rend nos sites et nos applications meilleurs.</p>
            </div>
            <Link href="/services/gaming/" className="btn btn-ghost mt-10 !border-[#3b3550] !bg-transparent">
              Notre expertise gaming <ArrowIcon />
            </Link>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <h3 className="font-display text-xl text-paper">Nos univers</h3>
            <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
              <li>
                <a href={externalLinks.doorknight} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-6 py-6">
                  <span>
                    <span className="block font-display text-2xl text-paper transition-colors group-hover:text-violet-bright">Door Knight</span>
                    <span className="text-sm text-[#a59fc0]">doorknight.games</span>
                  </span>
                  <ExternalIcon className="h-4 w-4 text-[#a59fc0]" />
                  <span className="sr-only">(nouvel onglet)</span>
                </a>
              </li>
              <li className="flex items-center justify-between gap-6 py-6">
                <span>
                  <span className="block font-display text-2xl text-paper/40">Prochain univers</span>
                  <span className="text-sm text-[#a59fc0]">En préparation, annoncé le moment venu</span>
                </span>
                <span className="h-2 w-2 rounded-full bg-[#3b3550]" aria-hidden />
              </li>
            </ul>
          </div>
        </div>
      </section>

      <ContactCTA title={["Un monde", "à construire ?"]} text="Jeu, configurateur 3D, expérience interactive pour votre marque : parlons de votre idée." />
    </div>
  );
}
