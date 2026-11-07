import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ServiceEmblem } from "@/components/ServiceEmblem";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { ArrowIcon } from "@/components/icons";
import { services } from "@/lib/services";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Expertises : web, intelligence artificielle, applications et jeux vidéo",
  description: "Création de sites internet, intégration de l'intelligence artificielle et automatisation, développement d'applications web et mobiles, jeux vidéo et expériences interactives.",
  path: "/services/",
  keywords: ["développement digital", "création de site internet", "agence IA", "création application mobile", "développement jeux vidéo"],
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Expertises", path: "/services/" }]}
        lines={["Quatre expertises,", "un même niveau", "d’exigence."]}
        intro={<p>Du site internet à l’agent IA, de l’application métier au jeu mobile : une seule équipe, capable de combiner ces savoir-faire dans un même projet.</p>}
      />
      <section aria-label="Liste des expertises" className="pb-[var(--section-y)]">
        <ul className="wrap border-t border-line">
          {services.map((s) => (
            <li key={s.slug} className="border-b border-line">
              <Link href={`/services/${s.slug}/`} className="group grid items-center gap-6 py-10 md:grid-cols-12 md:py-14">
                <span className="text-steel transition-colors duration-500 group-hover:text-paper md:col-span-2">
                  <ServiceEmblem slug={s.slug} className="h-20 w-20 md:h-28 md:w-28" />
                </span>
                <span className="md:col-span-6">
                  <span className="block font-display text-[clamp(1.8rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.045em] text-paper transition-colors group-hover:text-accent-bright">{s.shortName}</span>
                  <span className="mt-2 block text-sm text-muted">{s.name}</span>
                </span>
                <span className="text-muted md:col-span-3">{s.summary}</span>
                <span className="hidden justify-end md:col-span-1 md:flex">
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-line-strong transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                    <ArrowIcon className="h-4 w-4" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <ContactCTA />
    </>
  );
}
