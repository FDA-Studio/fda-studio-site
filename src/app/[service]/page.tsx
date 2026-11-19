import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ArrowIcon } from "@/components/icons";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { formatDate, getArticles } from "@/lib/articles";
import { localBySlug, localPages } from "@/lib/local-pages";
import { serviceBySlug, services } from "@/lib/services";
import { asset, site } from "@/lib/site";
import { ServiceDemo, type ServiceDemoKind } from "@/components/ServiceDemo";

export const dynamicParams = false;

export function generateStaticParams() {
  return [...services, ...localPages].map((s) => ({ service: s.slug }));
}

type Props = { params: Promise<{ service: string }> };

/** Une page de service, ou une page locale (ville ou métier) construite sur le même gabarit. */
const pageBySlug = (slug: string) => serviceBySlug(slug) ?? localBySlug(slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = pageBySlug((await params).service);
  if (!s) return {};
  return {
    ...pageMeta({ title: s.title, description: s.description, path: `/${s.slug}/`, keywords: s.keywords }),
    title: { absolute: s.title },
  };
}

/**
 * Chaque page reprend la scène du film qui correspond à son service : la même pièce que celle d'où
 * vient le visiteur. 1 = sites, 2 = IA, 3 = applications. Les pages IA et applications montrent
 * aussi la démo animée du service.
 */
function visualFor(slug: string): { scene: 1 | 2 | 3; demo?: { kind: ServiceDemoKind; title: string; text: string } } {
  if (/(^|-)ia(-|$)|agent-vocal/.test(slug)) {
    return { scene: 2, demo: { kind: "voice", title: "Écoutez-le décrocher.", text: "L’agent vocal répond, comprend la demande, déplace le rendez-vous et note tout dans le CRM. Démo rejouée avec des données fictives." } };
  }
  if (slug.includes("application") || slug.includes("crm")) {
    return { scene: 3, demo: { kind: "crm", title: "Une application en vrai.", text: "Notre propre CRM, conçu par le studio pour le web et l’iPhone : de la demande au devis signé. Démo rejouée avec des données fictives." } };
  }
  return { scene: 1 };
}

/** Page de service : offre, méthode, zone d'intervention, questions fréquentes. */
export default async function ServicePage({ params }: Props) {
  const s = pageBySlug((await params).service);
  if (!s) notFound();
  const url = `${site.url}/${s.slug}/`;
  const visual = visualFor(s.slug);
  const others = services.filter((o) => o.slug !== s.slug);
  // Maillage interne : les articles du même service, les plus récents d'abord. Une page locale
  // reprend les articles du service qui lui correspond ; une page de ville, les plus récents.
  const relatedService = services.some((o) => o.slug === s.slug)
    ? s.slug
    : /^agence-web-/.test(s.slug)
      ? null
      : visual.scene === 2
        ? "agence-ia-tours"
        : visual.scene === 3
          ? "developpement-application-tours"
          : "creation-site-internet-tours";
  const related = getArticles()
    .filter((a) => relatedService === null || a.service === relatedService)
    .slice(0, 4);

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.h1.join(" "),
    serviceType: s.serviceType,
    description: s.description,
    url,
    provider: { "@id": `${site.url}/#organization` },
    areaServed: s.areaServed
      ? [...s.areaServed.map((name) => ({ "@type": "Place", name })), { "@type": "Country", name: "France" }]
      : [
          { "@type": "City", name: "Tours" },
          { "@type": "AdministrativeArea", name: "Indre-et-Loire" },
          { "@type": "AdministrativeArea", name: "Centre-Val de Loire" },
          { "@type": "Country", name: "France" },
        ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: s.name,
      itemListElement: s.offers.map((o) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: o.title, description: o.text } })),
    },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: s.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: s.name, path: `/${s.slug}/` }])} />
      <JsonLd data={serviceLd} />
      <JsonLd data={faqLd} />

      {/* Ouverture : la scène du film derrière le titre */}
      <section aria-labelledby="service-title" className="service-hero">
        <picture aria-hidden>
          <source media="(max-width: 860px)" srcSet={asset(`/world/frames/n${visual.scene}/130.webp`)} />
          <img src={asset(`/world/frames/d${visual.scene}/130.webp`)} alt="" width={1920} height={1080} fetchPriority="high" decoding="async" className="service-hero__img" />
        </picture>
        <div className="service-hero__shade" aria-hidden />
        <div className="wrap relative">
          <nav aria-label="Fil d’Ariane" className="text-sm text-soft">
            <Link href="/" className="link-line hover:text-paper">Accueil</Link>
            <span aria-hidden className="mx-2 text-muted">/</span>
            <span aria-current="page" className="text-paper">{s.name}</span>
          </nav>
          <h1 id="service-title" className="hero-title mt-8 max-w-[18ch]">
            <span className="reveal-line"><span className="hero-rise" style={{ ["--i" as string]: 0 }}>{s.h1[0]}</span>{" "}</span>
            <span className="reveal-line"><span className="hero-rise text-soft" style={{ ["--i" as string]: 1 }}>{s.h1[1]}</span></span>
          </h1>
          <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-end">
            <p className="hero-fade text-lg leading-relaxed text-soft md:col-span-7 md:text-xl" style={{ ["--i" as string]: 0 }}>{s.intro}</p>
            <div className="hero-fade flex flex-col gap-3 sm:flex-row md:col-span-5 md:justify-end" style={{ ["--i" as string]: 1 }}>
              <Link href="/#contact" className="btn btn-primary">
                Demander un devis
                <span className="btn-icon"><ArrowIcon /></span>
              </Link>
              {s.demo && <Link href={s.demo.href} className="btn btn-ghost">{s.demo.label}</Link>}
            </div>
          </div>
        </div>
      </section>

      {/* Démo du service : on le voit fonctionner avant de lire */}
      {visual.demo && (
        <section aria-labelledby="demo-title" className="section bg-graphite">
          <div className="wrap grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <h2 id="demo-title" className="section-title">{visual.demo.title}</h2>
              <p className="mt-6 max-w-md text-lg text-soft">{visual.demo.text}</p>
            </div>
            <div className="lg:col-span-7">
              <ServiceDemo kind={visual.demo.kind} />
            </div>
          </div>
        </section>
      )}

      {/* Offre */}
      <section aria-labelledby="offers-title" className="section border-t border-line">
        <div className="wrap">
          <h2 id="offers-title" className="section-title max-w-[16ch]">{s.headings.offers}</h2>
          <ul className={`mt-14 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line md:mt-20 md:grid-cols-2 ${s.offers.length % 3 === 0 ? "lg:grid-cols-3" : ""}`}>
            {s.offers.map((o, i) => (
              <li key={o.title} className="offer-card bg-ink p-6 md:p-8">
                <span className="tabular text-sm text-accent-bright" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                <h3 className="tile-title mt-4">{o.title}</h3>
                <p className="mt-3 text-soft">{o.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pour qui */}
      <section aria-labelledby="for-title" className="section border-t border-line">
        <div className="wrap">
          <h2 id="for-title" className="section-title max-w-[18ch]">{s.headings.forWhom}</h2>
          <ul className={`mt-14 grid gap-10 md:mt-20 md:gap-x-16 ${s.forWhom.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {s.forWhom.map((f) => (
              <li key={f.title} className="border-t border-line pt-6">
                <h3 className="text-xl font-semibold tracking-[-0.02em]">{f.title}</h3>
                <p className="mt-3 text-soft">{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Méthode : une vraie séquence, d'où la numérotation */}
      <section aria-labelledby="steps-title" className="section bg-graphite">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <h2 id="steps-title" className="section-title lg:col-span-4">{s.headings.steps}</h2>
          <ol className="lg:col-span-7 lg:col-start-6">
            {s.steps.map((st, i) => (
              <li key={st.title} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-line py-6 md:py-8">
                <span className="tabular pt-1 text-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.02em]">{st.title}</h3>
                  <p className="mt-2 text-soft">{st.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Ce que comprend chaque projet */}
      <section aria-labelledby="included-title" className="section">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <h2 id="included-title" className="section-title lg:col-span-4">{s.headings.included}</h2>
          <ul className="lg:col-span-7 lg:col-start-6">
            {s.included.map((it) => (
              <li key={it} className="flex gap-4 border-t border-line py-4 text-lg text-soft">
                <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {it}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Zone d'intervention */}
      <section aria-labelledby="local-title" className="section">
        <div className="wrap grid gap-8 md:grid-cols-12 md:items-start">
          <h2 id="local-title" className="section-title md:col-span-6">{s.headings.local}</h2>
          <p className="text-lg leading-relaxed text-soft md:col-span-6">{s.local}</p>
        </div>
      </section>

      {/* Questions fréquentes : toutes ouvertes, rien ne se replie */}
      <section aria-labelledby="faq-title" className="section border-t border-line">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <h2 id="faq-title" className="section-title lg:col-span-4">{s.headings.faq}</h2>
          <dl className="lg:col-span-7 lg:col-start-6">
            {s.faq.map((f) => (
              <div key={f.q} className="border-t border-line py-6 md:py-8">
                <dt className="text-xl font-semibold tracking-[-0.02em]">{f.q}</dt>
                <dd className="mt-3 text-soft">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Articles du même service : réponses détaillées aux questions des prospects */}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="section border-t border-line">
          <div className="wrap">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 id="related-title" className="section-title max-w-[18ch]">Pour aller plus loin.</h2>
              <Link href="/ressources/" className="link-line text-soft hover:text-paper">Toutes les ressources</Link>
            </div>
            <ul className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line md:grid-cols-2">
              {related.map((a) => (
                <li key={a.slug} className="bg-ink">
                  <Link href={`/ressources/${a.slug}/`} className="group flex h-full flex-col gap-3 p-6 md:p-8">
                    <span className="text-sm text-muted">{formatDate(a.date)} · {a.readingMinutes} min de lecture</span>
                    <span className="text-xl font-semibold tracking-[-0.02em] text-paper transition-colors duration-150 group-hover:text-accent-bright">{a.title}</span>
                    <span className="text-soft">{a.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Clôture et maillage interne */}
      <section aria-labelledby="cta-title" className="section bg-graphite">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 id="cta-title" className="section-title">Parlons de votre projet.</h2>
            <p className="mt-6 max-w-lg text-lg text-soft">Décrivez votre besoin en quelques lignes : nous revenons vers vous avec une première proposition.</p>
            <Link href="/#contact" className="btn btn-primary mt-8">
              Demander un devis
              <span className="btn-icon"><ArrowIcon /></span>
            </Link>
          </div>
          <nav aria-label="Nos autres services" className="lg:col-span-4 lg:col-start-9">
            <p className="text-sm text-muted">Nos autres services</p>
            <ul className="mt-3">
              {others.map((o) => (
                <li key={o.slug} className="border-t border-line">
                  <Link href={`/${o.slug}/`} className="flex min-h-14 items-center justify-between gap-4 py-3 text-lg text-paper transition-colors duration-150 hover:text-accent-bright">
                    {o.name} à Tours <ArrowIcon />
                  </Link>
                </li>
              ))}
              <li className="border-t border-line">
                <Link href="/gaming/" className="flex min-h-14 items-center justify-between gap-4 py-3 text-lg text-paper transition-colors duration-150 hover:text-accent-bright">
                  Jeux vidéo et gaming <ArrowIcon />
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}
