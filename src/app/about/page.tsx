import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { FinalCTA } from "@/components/home/FinalCTA";
import { processSteps } from "@/lib/process";
import { RevealTitle } from "@/components/Reveal";
import { ArrowIcon, ExternalIcon } from "@/components/icons";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Le studio : créativité, développement et intelligence artificielle",
  description: "FDA Studio est le studio technologique du groupe FDA. Un studio à taille humaine qui réunit design, développement, intelligence artificielle et jeu vidéo.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Studio", path: "/about/" }]}
        lines={["Un studio", "technologique,", "pas une agence."]}
        intro={
          <p>
            FDA Studio est la branche technologique et créative du groupe FDA. Un studio à taille humaine qui conçoit des sites, des systèmes
            intelligents, des applications et des jeux, de l’idée jusqu’au produit en production.
          </p>
        }
      />

      <section aria-labelledby="manifeste-title" className="section bg-graphite">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
          <RevealTitle id="manifeste-title" className="text-title lg:col-span-6" lines={["Nous construisons", "des produits,", "pas des plaquettes."]} />
          <div className="space-y-6 text-lg text-muted lg:col-span-5 lg:col-start-8">
            <p>
              Une agence livre des maquettes et des pages. Un studio technologique livre des outils qui fonctionnent : un site qui génère des demandes,
              un agent qui traite des messages, une application que des équipes utilisent chaque jour, un jeu auquel on revient.
            </p>
            <p>
              Parce que nous développons nos propres produits, nous connaissons la réalité d’un projet après sa mise en ligne : la maintenance,
              les coûts, les retours des utilisateurs. C’est cette expérience que nous mettons au service de nos clients.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="methode-title" className="section bg-graphite">
        <div className="wrap">
          <h2 id="methode-title" className="text-title">Notre méthode, en cinq étapes.</h2>
          <ol className="mt-16 grid gap-px overflow-hidden rounded-[1.25rem] border border-line bg-line md:grid-cols-5">
            {processSteps.map((s, i) => (
              <li key={s.title} className="bg-graphite p-6 md:p-7">
                <span className="font-display text-sm text-accent-bright">{i + 1}</span>
                <h3 className="mt-6 font-display text-xl font-semibold tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-3 text-sm text-muted">{s.out}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="groupe-title" className="section">
        <div className="wrap grid gap-16 lg:grid-cols-2 lg:gap-10">
          <div>
            <h2 id="groupe-title" className="text-heading">Le groupe FDA</h2>
            <p className="mt-5 max-w-lg text-muted">
              FDA Studio fait partie du groupe FDA, qui réunit plusieurs activités. Cette structure nous donne la stabilité d’un groupe et
              l’agilité d’un studio.
            </p>
            <a href={site.group.url} target="_blank" rel="noopener noreferrer" className="link-line mt-6 inline-flex items-center gap-2 text-paper">
              Découvrir le groupe <ExternalIcon /><span className="sr-only">(nouvel onglet)</span>
            </a>
          </div>
          <div>
            <h2 className="text-heading">Talents et partenaires</h2>
            <p className="mt-5 max-w-lg text-muted">
              Développeurs, designers, spécialistes de l’IA ou du jeu vidéo, partenaires technologiques : si nos projets vous parlent, écrivez-nous
              en présentant votre parcours ou votre proposition.
            </p>
            <a href={`mailto:${site.email}?subject=${encodeURIComponent("Candidature / partenariat FDA Studio")}`} className="link-line mt-6 inline-flex items-center gap-2 text-paper">
              Nous écrire <ArrowIcon />
            </a>
          </div>
        </div>
        <div className="wrap mt-20">
          <Link href="/work/" className="btn btn-ghost">Voir nos réalisations <ArrowIcon /></Link>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
