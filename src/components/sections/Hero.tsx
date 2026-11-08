import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { SoundHint } from "@/components/SoundHint";

/**
 * Premier écran : ce que fait le studio, pour qui, et un fait vérifiable.
 * Entrée unique au chargement (≈ 1,1 s) : le titre monte ligne par ligne, puis le reste.
 * Le monogramme en éclats de titane est rendu par la toile fixe Stage (data-scene 0).
 */
export function Hero() {
  return (
    <section id="hero" data-scene="0" aria-labelledby="hero-title" className="relative flex flex-col overflow-hidden md:min-h-[100svh]">
      {/* Voiles de lisibilité au-dessus de la matière 3D (voir Stage) */}
      <div className="pointer-events-none absolute inset-0 -z-[1]">
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-ink via-ink/85 to-transparent md:h-[60%] md:via-ink/50" />
        <div className="absolute inset-y-0 left-0 hidden w-[55%] bg-gradient-to-r from-ink/80 to-transparent md:block" />
      </div>

      <div className="wrap flex flex-1 flex-col justify-end pb-10 pt-[40svh] md:pb-16 md:pt-32">
        <h1 id="hero-title" data-stage-text className="hero-title max-w-[14ch]">
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
              <SoundHint />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
