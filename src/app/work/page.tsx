import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { WorkGrid } from "@/components/WorkGrid";
import { FinalCTA } from "@/components/home/FinalCTA";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Réalisations : sites, applications, IA et jeux vidéo",
  description: "Les projets de FDA Studio : jeu mobile Door Knight, sites internet, démonstrateurs d'intelligence artificielle et concepts d'applications. Chaque projet indique son statut.",
  path: "/work/",
});

export default function WorkPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Réalisations", path: "/work/" }]}
        lines={["Nos produits,", "nos sites,", "nos prototypes."]}
        intro={
          <p>
            Nous montrons ce que nous avons réellement construit. Chaque projet affiche son statut : en ligne, en développement ou démonstrateur interne.
            Aucune référence n’est inventée.
          </p>
        }
      />
      <section aria-label="Projets" className="pb-[var(--section-y)]">
        <div className="wrap">
          <WorkGrid />
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
