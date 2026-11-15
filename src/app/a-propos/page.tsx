import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { authorJsonLd, pageMeta } from "@/lib/seo";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

const path = "/a-propos/";

export const metadata: Metadata = pageMeta({
  title: "À propos : agence web et IA à Tours",
  description:
    "FDA Studio, agence web et IA basée à Fondettes, près de Tours : qui nous sommes, ce que nous faisons, nos propres produits et notre façon de travailler.",
  path,
  keywords: ["FDA Studio", "FDA Studio Tours", "agence web Tours", "agence IA Tours", "Antoine Donabella"],
});

/**
 * Page « À propos » : l'identité du studio en un seul endroit. Elle aide les moteurs de recherche
 * et les assistants IA à relier « FDA Studio » à Tours, à son fondateur et à ses services, sans
 * confusion avec d'autres entités portant le sigle FDA. Contenu factuel uniquement.
 */
export default function AboutPage() {
  const c = site.company;
  const aboutLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${site.url}${path}`,
    url: `${site.url}${path}`,
    name: "À propos de FDA Studio",
    inLanguage: "fr-FR",
    mainEntity: { "@id": `${site.url}/#organization` },
  };
  const personLd = { "@context": "https://schema.org", ...authorJsonLd };

  return (
    <>
      <JsonLd data={aboutLd} />
      <JsonLd data={personLd} />
      <PageHeader
        crumbs={[{ name: "À propos", path }]}
        lines={["À propos", "de FDA Studio."]}
        intro={
          <p>
            FDA Studio est une agence web et IA basée à Fondettes, près de Tours. Le studio conçoit et développe des sites internet, des
            applications web et mobiles et des solutions d’intelligence artificielle pour les entreprises, en Touraine et partout en France. Il
            développe aussi ses propres produits, dont le jeu mobile Door Knight.
          </p>
        }
      />

      {/* Ce que fait le studio */}
      <section aria-labelledby="about-services" className="section border-t border-line">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <h2 id="about-services" className="section-title lg:col-span-4">Ce que fait le studio.</h2>
          <ul className="lg:col-span-7 lg:col-start-6">
            {services.map((s) => (
              <li key={s.slug} className="border-t border-line py-6 md:py-8">
                <Link href={`/${s.slug}/`} className="group inline-flex items-center gap-3 text-xl font-semibold tracking-[-0.02em] text-paper">
                  <span className="link-line group-hover:text-accent-bright">{s.name}</span>
                  <span aria-hidden className="text-muted"><ArrowIcon /></span>
                </Link>
                <p className="mt-2 text-soft">{s.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Le fondateur */}
      <section aria-labelledby="about-founder" className="section bg-graphite">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <h2 id="about-founder" className="section-title lg:col-span-4">Le fondateur.</h2>
          <div className="space-y-5 text-lg leading-relaxed text-soft lg:col-span-7 lg:col-start-6">
            <p>
              <strong className="font-semibold text-paper">{site.author.name}</strong> a fondé et dirige FDA Studio. Il signe les articles de la
              rubrique <Link href="/ressources/" className="link-line text-paper">Ressources</Link>.
            </p>
            <p>
              Il dirige aussi le <a href={site.group.url} target="_blank" rel="noopener noreferrer" className="link-line text-paper">{site.group.name}<span className="sr-only"> (nouvel onglet)</span></a>,
              qui réunit FDA Studio, Safetycar (garages sécurisés pour véhicules de prestige au Mans et à Orléans) et le centre de self-stockage
              Homebox d’Orléans Sud.
            </p>
          </div>
        </div>
      </section>

      {/* Nos propres produits */}
      <section aria-labelledby="about-products" className="section">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <h2 id="about-products" className="section-title lg:col-span-4">Nos propres produits.</h2>
          <ul className="lg:col-span-7 lg:col-start-6">
            <li className="border-t border-line py-6 md:py-8">
              <h3 className="text-xl font-semibold tracking-[-0.02em]">Door Knight</h3>
              <p className="mt-2 text-soft">
                Un jeu d’action en 3D pour iPhone, iPad et Android, conçu et développé par le studio.{" "}
                <Link href="/gaming/" className="link-line text-paper">Voir la page Gaming</Link>.
              </p>
            </li>
            <li className="border-t border-line py-6 md:py-8">
              <h3 className="text-xl font-semibold tracking-[-0.02em]">Nos outils internes</h3>
              <p className="mt-2 text-soft">
                Le studio utilise chaque jour ce qu’il propose à ses clients : un CRM sur le web et sur mobile, un agent vocal et un assistant écrit
                branchés sur ce CRM.{" "}
                <Link href="/#creations" className="link-line text-paper">Voir les démonstrations</Link>.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Méthode */}
      <section aria-labelledby="about-method" className="section border-t border-line">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <h2 id="about-method" className="section-title lg:col-span-4">Notre façon de travailler.</h2>
          <ul className="lg:col-span-7 lg:col-start-6">
            {[
              "Un premier échange à Tours ou en visio, pour comprendre votre activité avant de proposer quoi que ce soit.",
              "Des maquettes validées avant la moindre ligne de code.",
              "Des livraisons régulières que vous pouvez essayer, plutôt qu’un effet tunnel.",
              "Pour l’IA, un humain valide les décisions importantes et les erreurs sont suivies.",
              "Un suivi après la mise en ligne : évolutions, corrections et mises à jour.",
            ].map((it) => (
              <li key={it} className="flex gap-4 border-t border-line py-4 text-lg text-soft">
                <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {it}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Fiche d'identité : les mêmes informations que sur la fiche Google et les annuaires */}
      <section aria-labelledby="about-identity" className="section bg-graphite">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <h2 id="about-identity" className="section-title lg:col-span-4">Fiche d’identité.</h2>
          <dl className="grid gap-x-8 lg:col-span-7 lg:col-start-6 sm:grid-cols-[minmax(10rem,auto)_1fr]">
            {[
              ["Nom commercial", site.name],
              ["Société", `${c.name}, ${c.form.toLowerCase()} au capital de ${c.capital}`],
              ["Groupe", site.group.name],
              ["Adresse", c.address],
              ["Immatriculation", c.rcs],
              ["Zone d’intervention", "Tours, Touraine et toute la France"],
            ].map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="border-t border-line pt-4 text-sm text-muted sm:pb-4">{k}</dt>
                <dd className="pb-4 text-paper sm:border-t sm:border-line sm:pt-4">{v}</dd>
              </div>
            ))}
            <div className="contents">
              <dt className="border-t border-line pt-4 text-sm text-muted sm:pb-4">Contact</dt>
              <dd className="pb-4 text-paper sm:border-t sm:border-line sm:pt-4">
                <a href={`mailto:${site.email}`} className="link-line">{site.email}</a>
                {site.phone.display && (
                  <>
                    {" · "}
                    <a href={`tel:${site.phone.e164}`} className="link-line">{site.phone.display}</a>
                  </>
                )}
              </dd>
            </div>
            <div className="contents">
              <dt className="border-t border-line pt-4 text-sm text-muted sm:pb-4">Réseaux</dt>
              <dd className="pb-4 text-paper sm:border-t sm:border-line sm:pt-4">
                {site.socials.map((u, i) => (
                  <span key={u}>
                    {i > 0 && " · "}
                    <a href={u} target="_blank" rel="noopener noreferrer" className="link-line">
                      {u.includes("linkedin") ? "LinkedIn" : "Instagram"}
                      <span className="sr-only"> (nouvel onglet)</span>
                    </a>
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Clôture */}
      <section aria-labelledby="about-cta" className="section">
        <div className="wrap grid gap-8 md:grid-cols-12 md:items-end">
          <h2 id="about-cta" className="section-title md:col-span-7">Parlons de votre projet.</h2>
          <div className="md:col-span-5">
            <p className="text-lg text-soft">Décrivez votre besoin en quelques lignes : nous revenons vers vous avec une première proposition.</p>
            <Link href="/#contact" className="btn btn-primary mt-8">
              Demander un devis
              <span className="btn-icon"><ArrowIcon /></span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
