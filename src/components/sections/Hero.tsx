import Link from "next/link";
import { HeroCanvas } from "@/components/hero/HeroCanvas";
import { ArrowIcon } from "@/components/icons";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <HeroCanvas />
        {/* Voiles de lisibilité */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ink/90 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-ink via-ink/80 to-transparent md:h-[55%] md:via-ink/40" />
        <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-ink/70 to-transparent md:block" />
      </div>

      <div className="wrap flex flex-1 flex-col justify-end pb-10 pt-28 md:pb-14">
        <p className="hero-fade mb-10 hidden max-w-xs font-display text-sm text-muted md:block" style={{ ["--i" as string]: 0 }}>
          FDA Studio, le studio technologique du groupe FDA
        </p>

        <h1 id="hero-title" data-shown="true" className="text-mega font-display font-semibold leading-[0.86] tracking-[-0.055em]">
          <span className="reveal-line"><span className="hero-rise metal-text" style={{ ["--i" as string]: 0 }}>We build</span></span>
          <span className="reveal-line"><span className="hero-rise metal-text" style={{ ["--i" as string]: 1 }}>what&rsquo;s next.</span></span>
          <span className="sr-only"> Création digitale, intelligence artificielle et expériences interactives.</span>
        </h1>

        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:items-end">
          <ul className="hero-fade font-display text-lg leading-snug text-paper md:col-span-4 md:text-xl" style={{ ["--i" as string]: 1 }} aria-label="Ce que nous construisons">
            <li>Digital experiences.</li>
            <li>Intelligent systems.</li>
            <li>Interactive worlds.</li>
          </ul>
          <p className="hero-fade max-w-md text-muted md:col-span-4" style={{ ["--i" as string]: 2 }}>
            Sites internet premium, intelligence artificielle intégrée à vos outils, applications et jeux vidéo. De l&rsquo;idée au produit en production.
          </p>
          <div className="hero-fade flex flex-col gap-3 sm:flex-row md:col-span-4 md:justify-end" style={{ ["--i" as string]: 3 }}>
            <Link href="/contact/" className="btn btn-primary">
              Démarrer un projet
              <span className="btn-icon"><ArrowIcon /></span>
            </Link>
            <a href="#expertises" className="btn btn-ghost">Nos expertises</a>
          </div>
        </div>
      </div>
    </section>
  );
}
