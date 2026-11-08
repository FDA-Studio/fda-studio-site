import { GameVisual } from "@/components/visuals/GameVisual";
import { ExternalIcon } from "@/components/icons";
import { doorKnight as dk } from "@/lib/doorknight";

/** Door Knight : la Chevalière animée, le nom du jeu et un lien vers son site. */
export function DoorKnightSpot() {
  return (
    <section id="doorknight" aria-labelledby="dk-title" className="section relative overflow-hidden bg-night">
      <div className="wrap grid items-center gap-10 md:grid-cols-12">
        <div className="order-2 md:order-1 md:col-span-6 lg:col-span-5">
          <h2 id="dk-title">
            <img src={dk.wordmark} alt="Door Knight" width={1200} height={799} loading="lazy" decoding="async" className="h-auto w-[min(24rem,78%)]" />
          </h2>
          <p className="mt-6 max-w-md text-lg text-[#cfcae3]">
            Notre jeu d’action 3D pour iPhone, iPad et Android, conçu et développé par FDA Studio.
          </p>
          <a href={dk.url} target="_blank" rel="noopener noreferrer" className="btn btn-violet mt-8">
            Voir le site du jeu
            <span className="btn-icon"><ExternalIcon /></span>
            <span className="sr-only">(nouvel onglet)</span>
          </a>
        </div>
        <div className="order-1 md:order-2 md:col-span-6 lg:col-span-7">
          <GameVisual />
        </div>
      </div>
    </section>
  );
}
