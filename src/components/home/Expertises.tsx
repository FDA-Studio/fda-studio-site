import { WebVisual } from "@/components/visuals/WebVisual";
import { AIVisual } from "@/components/visuals/AIVisual";
import { AppVisual } from "@/components/visuals/AppVisual";
import { Live, PauseButton } from "@/components/motion/Live";

const items = [
  {
    title: "Sites internet",
    line: "Sites vitrines, e-commerce et pages de conversion. Rapides, bien référencés, faciles à faire évoluer.",
    Visual: WebVisual,
    wide: true,
  },
  {
    title: "Intelligence artificielle",
    line: "Agents vocaux, assistants et automatisations branchés sur votre CRM et vos e-mails. Un humain valide.",
    Visual: AIVisual,
    wide: false,
  },
  {
    title: "Applications",
    line: "Applications web, iOS et Android, SaaS et tableaux de bord, de la maquette à la publication.",
    Visual: AppVisual,
    wide: false,
  },
] as const;

/** Les trois métiers du studio, chacun montré par une interface vivante plutôt qu'une icône. */
export function Expertises() {
  return (
    <section id="expertises" aria-labelledby="expertises-title" className="section">
      <div className="wrap">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <h2 id="expertises-title" className="section-title md:col-span-7">
            Trois métiers, une seule équipe.
          </h2>
          <div className="md:col-span-5">
            <p className="text-lg text-soft">
              Le même studio dessine l’interface, écrit le code et branche l’IA. Un seul interlocuteur, de la maquette à la mise en ligne.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2 md:gap-5">
          {items.map(({ title, line, Visual, wide }) => (
            <article
              key={title}
              className={`tile grid overflow-hidden ${wide ? "md:col-span-2 md:grid-cols-12 md:items-center" : ""}`}
            >
              <div className={`p-6 md:p-10 ${wide ? "md:col-span-5" : ""}`}>
                <h3 className="tile-title">{title}</h3>
                <p className="mt-3 max-w-md text-soft">{line}</p>
              </div>
              <Live className={`relative min-w-0 px-6 pb-8 md:px-10 md:pb-10 ${wide ? "md:col-span-7 md:py-10" : ""}`}>
                <Visual />
              </Live>
            </article>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <PauseButton />
        </div>
      </div>
    </section>
  );
}
