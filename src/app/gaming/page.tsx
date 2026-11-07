import type { Metadata } from "next";
import Link from "next/link";
import { DoorPicker } from "@/components/demos/DoorPicker";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { JsonLd } from "@/components/JsonLd";
import { RevealTitle } from "@/components/Reveal";
import { ArrowIcon, ExternalIcon } from "@/components/icons";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { doorKnight as dk } from "@/lib/doorknight";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Gaming : Door Knight, notre jeu d'action 3D mobile",
  description: "FDA Studio développe ses propres jeux vidéo. Door Knight 2.0, jeu d'action 3D pour iPhone, iPad et Android : mille portes, dix mondes, quatre classes. Bêta TestFlight disponible.",
  path: "/gaming/",
  keywords: ["développement jeux vidéo", "jeu mobile 3D", "Door Knight", "studio de jeu indépendant", "jeu iPhone Android"],
});

const features = [
  ["Mille portes", "Dix mondes, dix zones par monde, dix portes par zone. Chaque zone se termine par un boss, chaque monde par un gardien."],
  ["Butin et forge", "Des objets nommés par rareté, des chances de butin affichées sur chaque porte et une forge jusqu’à +15."],
  ["Un camp qui travaille", "Scierie, carrière et mine de cristal produisent des ressources même lorsque le jeu est fermé."],
  ["Monstres d’élite", "À partir de la zone 4, des ennemis plus coriaces dotés d’une technique supplémentaire."],
  ["Guildes et classement", "Un objectif de guilde chaque semaine et un classement mondial selon la porte la plus haute atteinte."],
  ["Une seule progression", "La sauvegarde est en ligne et suit le joueur entre iPhone, iPad et Android."],
];

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

const gameLd = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: "Door Knight 2.0",
  url: dk.url,
  image: dk.og,
  genre: ["Action"],
  gamePlatform: ["iOS", "iPadOS", "Android"],
  playMode: ["SinglePlayer", "MultiPlayer"],
  author: { "@id": `${site.url}/#organization` },
  publisher: { "@id": `${site.url}/#organization` },
};

export default function GamingPage() {
  return (
    <div className="bg-night text-paper">
      <JsonLd data={gameLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "Gaming", path: "/gaming/" }])} />

      {/* Hero : la porte de Door Knight */}
      <header className="relative isolate overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="absolute inset-0 -z-10" aria-hidden>
          <img
            src={dk.door}
            alt=""
            width={1640}
            height={2050}
            fetchPriority="high"
            className="absolute right-[-20%] top-0 h-full w-auto max-w-none opacity-60 md:right-0 md:opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-night via-night/85 to-night/10" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />
        </div>
        <div className="wrap">
          <nav aria-label="Fil d’Ariane" className="text-sm text-[#a59fc0]">
            <Link href="/" className="link-line hover:text-paper">Accueil</Link>
            <span aria-hidden className="mx-2">/</span>
            <span aria-current="page" className="text-paper">Gaming</span>
          </nav>
          <div className="mt-10 max-w-2xl">
            <h1 className="sr-only">Door Knight, le jeu d’action 3D de FDA Studio</h1>
            <img src={dk.wordmark} alt="Door Knight" width={1200} height={799} className="hero-fade h-auto w-[min(34rem,90%)]" style={{ ["--i" as string]: 0 }} />
            <p className="hero-fade mt-8 text-2xl font-semibold tracking-[-0.02em] md:text-3xl" style={{ ["--i" as string]: 1 }}>
              Choisis ta porte. Affronte ce qu’il y a derrière.
            </p>
            <p className="hero-fade mt-5 max-w-xl text-lg text-[#c9c4dc]" style={{ ["--i" as string]: 2 }}>
              Le premier jeu de FDA Studio : un jeu d’action 3D pour iPhone, iPad et Android, gratuit avec achats optionnels.
              La version 2.0 est en développement, une version est jouable en bêta via TestFlight.
            </p>
            <div className="hero-fade mt-10 flex flex-col gap-3 sm:flex-row" style={{ ["--i" as string]: 3 }}>
              <a href={dk.url} {...ext} className="btn btn-primary">
                Visiter doorknight.games <span className="btn-icon"><ExternalIcon /></span><span className="sr-only">(nouvel onglet)</span>
              </a>
              <a href={dk.links.discord} {...ext} className="btn btn-ghost !border-[#3b3550] !bg-night/40">
                Rejoindre le Discord <ExternalIcon /><span className="sr-only">(nouvel onglet)</span>
              </a>
            </div>
          </div>
          <dl className="mt-16 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/10 pt-8">
            {[["1 000", "portes"], ["10", "mondes et gardiens"], ["4", "classes jouables"]].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="text-3xl font-semibold tracking-[-0.04em] md:text-5xl">{n}</dd>
                <dd className="mt-1 text-sm text-[#a59fc0]">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* Bande-annonce */}
      <section aria-labelledby="trailer-title" className="section !pt-8">
        <div className="wrap">
          <RevealTitle id="trailer-title" className="text-title max-w-[18ch]" lines={["Vingt-cinq secondes", "dans la Forge Volcanique."]} />
          <div className="mt-12 overflow-hidden rounded-[1.5rem] border border-white/10 bg-black shadow-[0_40px_120px_-40px_rgba(110,75,255,0.45)]">
            <video
              controls
              playsInline
              preload="none"
              poster={dk.shots[3].img}
              className="aspect-video w-full bg-black object-cover"
              aria-label="Bande-annonce de Door Knight 2.0, combat dans la Forge Volcanique"
            >
              <source src={dk.trailer.src} type="video/mp4" />
              <a href={dk.trailer.src}>Voir la bande-annonce</a>
            </video>
          </div>
          <p className="mt-4 text-sm text-[#a59fc0]">Capture réelle de Door Knight 2.0, en cours de développement.</p>
        </div>
      </section>

      {/* Combats */}
      <section aria-labelledby="combat-title" className="section border-t border-white/10">
        <div className="wrap">
          <h2 id="combat-title" className="text-title max-w-[16ch]">Des hordes, des boss, des gardiens.</h2>
          <ul className="mt-14 grid gap-6 md:grid-cols-2">
            {dk.shots.map((s, i) => (
              <li key={s.img} className={i % 2 === 1 ? "md:mt-16" : ""}>
                <figure>
                  <img src={s.img} alt={s.alt} width={800} height={360} loading="lazy" decoding="async" className="aspect-[20/9] w-full rounded-2xl border border-white/10 object-cover" />
                  <figcaption className="mt-3 text-sm text-[#c9c4dc]">{s.alt}.</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Classes */}
      <section aria-labelledby="classes-title" className="section border-t border-white/10">
        <div className="wrap">
          <h2 id="classes-title" className="text-title max-w-[18ch]">Quatre classes. Une héroïne ou un héros pour chacune.</h2>
          <ul className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {dk.classes.map((c) => (
              <li key={c.name} className="group overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_30%,rgba(110,75,255,0.28),transparent_70%)]">
                <div className="grid aspect-[3/4] place-items-end justify-center px-6 pt-8">
                  <img src={c.img} alt={`${c.name}, classe jouable de Door Knight`} width={155} height={240} loading="lazy" decoding="async" className="h-[88%] w-auto object-contain transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105" />
                </div>
                <div className="border-t border-white/10 p-4 md:p-5">
                  <h3 className="text-lg font-semibold tracking-[-0.02em]">{c.name}</h3>
                  <p className="mt-2 text-sm text-[#c9c4dc]">{c.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Mondes */}
      <section aria-labelledby="mondes-title" className="section border-t border-white/10">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h2 id="mondes-title" className="text-title">Dix mondes. Un gardien au bout de chacun.</h2>
            <ol className="mt-10 grid grid-cols-1 gap-y-3 sm:grid-cols-2 lg:grid-cols-1">
              {dk.worlds.map((w, i) => (
                <li key={w} className="flex items-baseline gap-4 border-b border-white/10 pb-3">
                  <span className="w-6 text-sm text-violet-bright">{i + 1}</span>
                  <span>{w}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="grid min-w-0 gap-6 lg:col-span-8">
            {dk.worldArt.map((w, i) => (
              <figure key={w.img} className={i === 0 ? "" : "lg:w-[78%] " + (i === 2 ? "lg:ml-auto" : "")}>
                <img src={w.img} alt={w.label} width={i === 0 ? 1920 : 960} height={i === 0 ? 864 : 432} loading="lazy" decoding="async" className="aspect-[20/9] w-full rounded-2xl border border-white/10 object-cover" />
                <figcaption className="mt-3 text-sm text-[#a59fc0]">{w.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Systèmes */}
      <section aria-labelledby="systemes-title" className="section border-t border-white/10">
        <div className="wrap">
          <h2 id="systemes-title" className="text-title max-w-[16ch]">Un jeu complet, pas une démo.</h2>
          <ul className="mt-14 grid gap-x-6 gap-y-12 md:grid-cols-2">
            {dk.ui.map((u) => (
              <li key={u.img}>
                <img src={u.img} alt={u.alt} width={800} height={360} loading="lazy" decoding="async" className="aspect-[20/9] w-full rounded-2xl border border-white/10 object-cover" />
                <h3 className="text-heading mt-5">{u.title}</h3>
                <p className="mt-2 text-[#c9c4dc]">{u.alt}.</p>
              </li>
            ))}
          </ul>
          <dl className="mt-20 grid gap-x-10 gap-y-10 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(([t, d]) => (
              <div key={t}>
                <dt className="text-xl font-semibold tracking-[-0.02em]">{t}</dt>
                <dd className="mt-3 text-[#c9c4dc]">{d}</dd>
              </div>
            ))}
          </dl>
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

      {/* Communauté et ambition */}
      <section aria-labelledby="communaute-title" className="section border-t border-white/10">
        <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <h2 id="communaute-title" className="text-title">Sois là quand la porte s’ouvre.</h2>
            <p className="mt-8 text-lg text-[#c9c4dc]">
              La date de sortie sera annoncée en priorité sur le Discord du jeu. En attendant, la bêta TestFlight permet déjà de jouer sur iPhone et iPad.
            </p>
            <h3 className="mt-14 text-xl font-semibold">Notre ambition gaming</h3>
            <p className="mt-4 text-[#c9c4dc]">
              Construire des univers originaux qui durent : des jeux mobiles soignés, des communautés vivantes et une progression qui respecte le temps des joueurs.
              Chaque jeu est aussi une école : optimisation temps réel, serveurs, économie et direction artistique nourrissent nos sites et nos applications.
            </p>
            <Link href="/services/gaming/" className="btn btn-ghost mt-10 !border-[#3b3550] !bg-transparent">
              Notre expertise gaming <ArrowIcon />
            </Link>
          </div>
          <ul className="divide-y divide-white/10 self-start border-y border-white/10 lg:col-span-5 lg:col-start-8">
            {[
              ["Site officiel", "doorknight.games", dk.url],
              ["Bêta TestFlight", "Installer la version 1.0", dk.links.beta],
              ["Discord", "Annonces et communauté", dk.links.discord],
              ["Nouveautés", "Le journal de la bêta", dk.links.news],
              ["Instagram", "@doorknight.games", dk.links.instagram],
              ["TikTok", "@doorknight.games", dk.links.tiktok],
              ["YouTube", "@doorknightgames", dk.links.youtube],
            ].map(([label, sub, href]) => (
              <li key={label}>
                <a href={href} {...ext} className="group flex items-center justify-between gap-6 py-5">
                  <span>
                    <span className="block text-xl font-semibold tracking-[-0.02em] transition-colors group-hover:text-violet-bright">{label}</span>
                    <span className="text-sm text-[#a59fc0]">{sub}</span>
                  </span>
                  <ExternalIcon className="h-4 w-4 text-[#a59fc0] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  <span className="sr-only">(nouvel onglet)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactCTA title={["Un monde", "à construire ?"]} text="Jeu, configurateur 3D, expérience interactive pour votre marque : parlons de votre idée." />
    </div>
  );
}
