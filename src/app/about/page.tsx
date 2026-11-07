import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ContactCTA } from "@/components/sections/ContactCTA";
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

const beliefs = [
  { t: "Montrer plutôt que promettre", d: "Nous préférons un prototype à une présentation. Un produit qu’on peut toucher tranche plus vite qu’un long document." },
  { t: "La technique au service du métier", d: "Une technologie n’a de valeur que si elle sert un objectif : gagner du temps, vendre mieux, mieux servir vos clients." },
  { t: "L’honnêteté comme méthode", d: "Délais réalistes, coûts récurrents annoncés, limites de l’IA expliquées. Vous décidez en connaissance de cause." },
  { t: "La sécurité par défaut", d: "Clés côté serveur, règles d’accès vérifiées, données minimisées et hébergées en Europe quand c’est nécessaire." },
];

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

      <section aria-labelledby="convictions-title" className="section">
        <div className="wrap">
          <h2 id="convictions-title" className="text-title max-w-[14ch]">Ce en quoi nous croyons.</h2>
          <dl className="mt-16 border-t border-line">
            {beliefs.map((b) => (
              <div key={b.t} className="grid gap-4 border-b border-line py-10 md:grid-cols-12 md:gap-8">
                <dt className="font-display text-[clamp(1.5rem,3vw,2.5rem)] font-semibold leading-tight tracking-[-0.04em] text-paper md:col-span-6">{b.t}</dt>
                <dd className="text-lg text-muted md:col-span-5 md:col-start-8">{b.d}</dd>
              </div>
            ))}
          </dl>
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

      <ContactCTA />
    </>
  );
}
