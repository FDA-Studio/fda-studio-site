import Link from "next/link";
import { HeroCanvas } from "@/components/hero/HeroCanvas";
import { ArrowIcon } from "@/components/icons";
import { SoundHint } from "@/components/SoundHint";

/**
 * Premier écran : ce que fait le studio, pour qui, et un fait vérifiable.
 * Entrée unique au chargement (≈ 1,1 s) : le titre monte ligne par ligne, puis le reste.
 */
export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <HeroCanvas />
        {/* Voiles de lisibilité */}
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-ink via-ink/85 to-transparent md:h-[60%] md:via-ink/50" />
        <div className="absolute inset-y-0 left-0 hidden w-[55%] bg-gradient-to-r from-ink/80 to-transparent md:block" />
      </div>

      <div className="wrap flex flex-1 flex-col justify-end pb-10 pt-32 md:pb-16">
        <h1 id="hero-title" className="hero-title max-w-[14ch]">
          <span className="reveal-line"><span className="hero-rise" style={{ ["--i" as string]: 0 }}>Sites, applications</span></span>
          <span className="reveal-line"><span className="hero-rise" style={{ ["--i" as string]: 1 }}>et agents IA</span></span>
          <span className="reveal-line"><span className="hero-rise text-muted" style={{ ["--i" as string]: 2 }}>pour les entreprises.</span></span>
        </h1>

        <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6 lg:col-span-5">
            <p className="hero-fade text-lg leading-relaxed text-soft md:text-xl" style={{ ["--i" as string]: 0 }}>
              FDA Studio conçoit, développe et met en ligne vos sites, vos applications web et mobiles, et des assistants IA branchés sur vos outils.
            </p>
            <p className="hero-fade mt-4 text-sm text-muted" style={{ ["--i" as string]: 1 }}>
              Studio du groupe FDA, à Fondettes près de Tours. Créateur du jeu mobile <Link href="/gaming/" className="link-line text-soft hover:text-paper">Door Knight</Link>.
            </p>
          </div>
          <div className="hero-fade flex flex-col gap-5 md:col-span-6 md:items-end lg:col-span-7" style={{ ["--i" as string]: 2 }}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#contact" className="btn btn-primary">
                Démarrer un projet
                <span className="btn-icon"><ArrowIcon /></span>
              </a>
              <a href="#creations" className="btn btn-ghost">Voir les démos IA</a>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 md:justify-end">
              <a href="/experience/" className="inline-flex min-h-11 items-center gap-2 text-sm text-paper">
                <span className="link-line">Entrer dans le studio en 3D</span>
              </a>
              <SoundHint />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
