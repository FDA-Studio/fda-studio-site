import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { ServiceEmblem } from "@/components/ServiceEmblem";
import { JsonLd } from "@/components/JsonLd";
import { ProjectCard } from "@/components/ProjectCard";
import { ResponsiveDemo } from "@/components/demos/ResponsiveDemo";
import { AgentConsole } from "@/components/demos/AgentConsole";
import { ProductDemo } from "@/components/demos/ProductDemo";
import { DoorPicker } from "@/components/demos/DoorPicker";
import { ArrowIcon } from "@/components/icons";
import { getService, services, type ServiceSlug } from "@/lib/services";
import { projects } from "@/lib/projects";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) return {};
  return pageMeta({ title: s.seo.title, description: s.seo.description, path: `/services/${s.slug}/`, keywords: s.seo.keywords });
}

const demoCopy: Record<ServiceSlug, { title: string; text: string }> = {
  web: { title: "Une page, tous les écrans.", text: "Nous concevons mobile d’abord. Chaque mise en page est pensée pour sa taille d’écran, pas réduite à partir de la version ordinateur." },
  ia: { title: "Voyez un agent travailler.", text: "Une demande entre, l’agent extrait l’essentiel, prépare les actions et attend la validation de votre équipe." },
  applications: { title: "Manipulez un produit.", text: "Trois interfaces pour trois rôles, dans une même application. Concept interne, données fictives." },
  gaming: { title: "Choisis ta porte.", text: "Un clin d’œil à Door Knight, notre premier jeu : chaque porte cache une horde, un boss ou un gardien." },
};

function Demo({ slug }: { slug: ServiceSlug }) {
  if (slug === "web") return <ResponsiveDemo />;
  if (slug === "ia") return <AgentConsole />;
  if (slug === "applications") return <ProductDemo />;
  return <DoorPicker />;
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  if (!services.some((s) => s.slug === slug)) notFound();
  const s = getService(slug as ServiceSlug);
  const night = s.slug === "gaming";
  const related = projects.filter((p) => p.categories.includes(s.slug)).slice(0, 2);
  const others = services.filter((x) => x.slug !== s.slug);

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.seo.title,
    serviceType: s.name,
    description: s.seo.description,
    provider: { "@id": `${site.url}/#organization` },
    areaServed: "FR",
    url: `${site.url}/services/${s.slug}/`,
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: s.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <JsonLd data={serviceLd} />
      <JsonLd data={faqLd} />
      <PageHeader
        tone={night ? "night" : "ink"}
        crumbs={[{ name: "Expertises", path: "/services/" }, { name: s.shortName, path: `/services/${s.slug}/` }]}
        lines={s.heroLines}
        intro={<p>{s.intro}</p>}
        aside={
          <div className="hidden text-steel lg:block">
            <ServiceEmblem slug={s.slug} className="ml-auto h-64 w-64" />
            <p className="mt-6 text-right font-display text-sm text-muted">{s.name}</p>
          </div>
        }
      />

      {/* Démonstration propre à l'expertise */}
      <section aria-labelledby="demo-title" className={`section ${night ? "bg-night" : "bg-graphite"}`}>
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h2 id="demo-title" className="text-title">{demoCopy[s.slug].title}</h2>
            <p className="mt-6 text-lg text-muted">{demoCopy[s.slug].text}</p>
          </div>
          <div className="min-w-0 lg:col-span-8">
            <Demo slug={s.slug} />
          </div>
        </div>
      </section>

      {/* Offres */}
      <section aria-labelledby="offres-title" className="section">
        <div className="wrap">
          <h2 id="offres-title" className="text-title max-w-[16ch]">Ce que nous réalisons.</h2>
          <dl className="mt-16 grid border-t border-line md:grid-cols-2">
            {s.offers.map((o, i) => (
              <div key={o.title} className={`border-b border-line py-8 md:py-10 ${i % 2 === 0 ? "md:border-r md:pr-12" : "md:pl-12"}`}>
                <dt className="text-heading">{o.title}</dt>
                <dd className="mt-4 max-w-md text-muted">{o.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Bénéfices et livrables */}
      <section aria-labelledby="benefices-title" className="section bg-graphite">
        <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <h2 id="benefices-title" className="text-title">Ce que vous y gagnez.</h2>
            <div className="mt-12 space-y-10">
              {s.outcomes.map((o) => (
                <div key={o.title} className="border-l border-accent pl-6">
                  <h3 className="text-heading">{o.title}</h3>
                  <p className="mt-3 max-w-md text-muted">{o.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="panel p-7 md:p-9">
              <h3 className="font-display text-xl text-paper">Livrables</h3>
              <ul className="mt-6 space-y-3 text-muted">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex gap-3"><span className="mt-3 h-px w-3 shrink-0 bg-accent" aria-hidden />{d}</li>
                ))}
              </ul>
              <h3 className="mt-10 font-display text-xl text-paper">Technologies</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {s.stack.map((t) => (
                  <li key={t} className="rounded-full border border-line-strong px-3 py-1.5 text-sm text-muted">{t}</li>
                ))}
              </ul>
              <Link href={`/contact/?besoin=${s.slug}`} className="btn btn-primary mt-10 w-full">
                {s.cta} <span className="btn-icon"><ArrowIcon /></span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Projets liés */}
      {related.length > 0 && (
        <section aria-labelledby="lies-title" className="section">
          <div className="wrap">
            <div className="flex items-end justify-between gap-6">
              <h2 id="lies-title" className="text-title">Projets liés.</h2>
              <Link href="/work/" className="link-line hidden text-muted hover:text-paper sm:inline">Toutes les réalisations</Link>
            </div>
            <div className="mt-14 grid gap-12 md:grid-cols-2">
              {related.map((p) => <ProjectCard key={p.slug} project={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="section border-t border-line">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <h2 id="faq-title" className="text-title lg:col-span-4">Questions fréquentes.</h2>
          <div className="lg:col-span-7 lg:col-start-6">
            {s.faq.map((f) => (
              <details key={f.q} className="group border-b border-line py-6 first:border-t">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg text-paper [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-strong text-muted transition-transform duration-500 group-open:rotate-45 group-open:border-accent group-open:text-accent-bright" aria-hidden>+</span>
                </summary>
                <p className="mt-4 max-w-2xl text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Maillage interne */}
      <nav aria-label="Autres expertises" className="border-t border-line">
        <ul className="wrap grid md:grid-cols-3">
          {others.map((o) => (
            <li key={o.slug} className="border-b border-line md:border-b-0 md:border-r md:last:border-r-0">
              <Link href={`/services/${o.slug}/`} className="group flex items-center justify-between gap-4 py-8 md:px-8">
                <span>
                  <span className="block text-sm text-muted">Expertise</span>
                  <span className="mt-1 block font-display text-xl text-paper transition-colors group-hover:text-accent-bright">{o.shortName}</span>
                </span>
                <ArrowIcon className="h-4 w-4 text-muted transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <ContactCTA title={["Votre projet", "commence ici."]} />
    </>
  );
}
