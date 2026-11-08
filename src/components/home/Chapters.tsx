import Link from "next/link";
import { ArrowIcon, ExternalIcon } from "@/components/icons";
import { externalLinks } from "@/lib/site";

/**
 * Les quatre chapitres de l'accueil. Chacun occupe un écran ; derrière le texte,
 * la matière FDA (voir Stage) prend la forme du métier : fenêtres, orbe, téléphones, porte.
 */
const chapters = [
  {
    id: "sites",
    title: "Des sites qui tiennent la promesse de votre marque.",
    text: "Sites vitrines, e-commerce et pages de conversion. Dessinés sur mesure, rapides au chargement, bien référencés et faciles à faire évoluer.",
    href: "/creation-site-internet-tours/",
    cta: "Voir l’offre sites internet",
  },
  {
    id: "ia",
    title: "Une IA qui travaille dans vos outils, pas à côté.",
    text: "Agents vocaux qui décrochent, assistants qui répondent à partir de vos documents, automatisations branchées sur votre CRM et vos e-mails. Un humain garde la main.",
    href: "/agence-ia-tours/",
    cta: "Voir l’offre intelligence artificielle",
  },
  {
    id: "applications",
    title: "Des applications que vos équipes ouvrent chaque matin.",
    text: "Applications web, iOS et Android, SaaS et tableaux de bord. De la maquette à la publication sur les stores, avec la même équipe.",
    href: "/developpement-application-tours/",
    cta: "Voir l’offre applications",
  },
  {
    id: "jeux",
    title: "Et derrière la porte, nos propres univers.",
    text: "Le studio développe aussi ses jeux. Door Knight, un jeu d’action 3D pour iPhone, iPad et Android, est le premier. D’autres mondes sont en préparation.",
    href: "/gaming/",
    cta: "Découvrir Door Knight",
    external: externalLinks.doorknight,
    dark: true,
  },
] as const;

export function Chapters() {
  return (
    <div id="expertises" className="chapters">
      <h2 className="sr-only">Nos expertises</h2>
      {chapters.map((c, i) => (
        <section
          key={c.id}
          id={c.id}
          data-scene={i + 1}
          aria-labelledby={`chapter-${c.id}`}
          className={`chapter-3d${"dark" in c && c.dark ? " chapter-3d--night" : ""}`}
        >
          <div className="wrap grid md:grid-cols-12">
            <div className="chapter-3d__text md:col-span-6 lg:col-span-5">
              <h3 id={`chapter-${c.id}`} data-stage-text className="section-title">{c.title}</h3>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-soft">{c.text}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link href={c.href} className="btn btn-ghost">
                  {c.cta}
                  <span className="btn-icon"><ArrowIcon /></span>
                </Link>
                {"external" in c && (
                  <a href={c.external} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm text-paper">
                    <span className="link-line">doorknight.games</span>
                    <ExternalIcon />
                    <span className="sr-only">(nouvel onglet)</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
