import { GameVisual } from "@/components/visuals/GameVisual";
import { ExternalIcon } from "@/components/icons";
import { doorKnight as dk } from "@/lib/doorknight";

/** Door Knight : la Chevalière animée et un lien vers le site du jeu. Rien de plus. */
export function DoorKnightSpot() {
  return (
    <section id="doorknight" aria-labelledby="dk-title" className="relative overflow-hidden bg-night py-[var(--section-y)]">
      <div className="wrap grid items-center gap-10 md:grid-cols-2">
        <div className="order-2 text-center md:order-1 md:text-left">
          <h2 id="dk-title" className="sr-only">Door Knight, le jeu de FDA Studio</h2>
          <img src={dk.wordmark} alt="Door Knight" width={1200} height={799} loading="lazy" decoding="async" className="mx-auto h-auto w-[min(26rem,80%)] md:mx-0" />
          <p className="mx-auto mt-6 max-w-sm text-lg text-[#c9c4dc] md:mx-0">Notre jeu d’action 3D pour iPhone, iPad et Android.</p>
          <a href={dk.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-8" data-cursor="Jouer">
            doorknight.games <span className="btn-icon"><ExternalIcon /></span>
            <span className="sr-only">(nouvel onglet)</span>
          </a>
        </div>
        <div className="order-1 md:order-2">
          <GameVisual />
        </div>
      </div>
    </section>
  );
}
