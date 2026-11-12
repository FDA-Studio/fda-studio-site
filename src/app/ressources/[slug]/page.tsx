import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ArrowIcon } from "@/components/icons";
import { articleBySlug, formatDate, getArticles } from "@/lib/articles";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { serviceBySlug } from "@/lib/services";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = articleBySlug((await params).slug);
  if (!a) return {};
  const meta = pageMeta({ title: a.title, description: a.description, path: `/ressources/${a.slug}/`, keywords: a.keywords });
  return {
    ...meta,
    title: { absolute: `${a.title} | ${site.name}` },
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: a.date,
      modifiedTime: a.updated ?? a.date,
      images: [{ url: `/ressources/${a.slug}/og.png`, width: 1200, height: 630, alt: a.title }],
    },
    twitter: { ...meta.twitter, images: [`/ressources/${a.slug}/og.png`] },
  };
}

/** Article de la rubrique Ressources : texte, sommaire, appel à l'action vers le service concerné. */
export default async function ArticlePage({ params }: Props) {
  const a = articleBySlug((await params).slug);
  if (!a) notFound();
  const service = serviceBySlug(a.service)!;
  const url = `${site.url}/ressources/${a.slug}/`;
  const others = getArticles().filter((o) => o.slug !== a.slug).slice(0, 3);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    dateModified: a.updated ?? a.date,
    inLanguage: "fr-FR",
    mainEntityOfPage: url,
    url,
    image: `${site.url}/og-image.png`,
    keywords: a.keywords.join(", "),
    author: { "@id": `${site.url}/#organization` },
    publisher: { "@id": `${site.url}/#organization` },
    about: { "@type": "Service", name: service.name, url: `${site.url}/${service.slug}/` },
  };

  return (
    <article>
      <JsonLd data={breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "Ressources", path: "/ressources/" }, { name: a.title, path: `/ressources/${a.slug}/` }])} />
      <JsonLd data={articleLd} />

      <header className="relative overflow-hidden pb-14 pt-32 md:pb-20 md:pt-44">
        <div className="glow-accent pointer-events-none absolute -right-48 -top-48 h-[40rem] w-[40rem] opacity-45" aria-hidden />
        <div className="wrap relative">
          <nav aria-label="Fil d’Ariane" className="text-sm text-muted">
            <Link href="/" className="link-line hover:text-paper">Accueil</Link>
            <span aria-hidden className="mx-2 text-line-strong">/</span>
            <Link href="/ressources/" className="link-line hover:text-paper">Ressources</Link>
          </nav>
          <h1 className="mt-10 max-w-[22ch] text-[clamp(2.2rem,5.2vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.04em]">{a.title}</h1>
          <p className="mt-8 max-w-[60ch] text-lg text-soft md:text-xl">{a.description}</p>
          <p className="mt-8 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
            <span>
              Publié le <time dateTime={a.date}>{formatDate(a.date)}</time>
              {a.updated && a.updated !== a.date ? <> · mis à jour le <time dateTime={a.updated}>{formatDate(a.updated)}</time></> : null}
            </span>
            <span>{a.readingMinutes} min de lecture</span>
          </p>
        </div>
      </header>

      <div className="wrap grid gap-14 pb-[var(--section-y)] lg:grid-cols-12">
        {a.toc.length > 2 && (
          <aside className="lg:col-span-3 lg:col-start-10 lg:row-start-1">
            <nav aria-label="Sommaire" className="lg:sticky lg:top-28">
              <p className="text-sm font-medium text-paper">Sommaire</p>
              <ol className="mt-4 space-y-2.5 border-l border-line pl-4 text-sm text-muted">
                {a.toc.map((h) => (
                  <li key={h.id}><a href={`#${h.id}`} className="link-line hover:text-paper">{h.text}</a></li>
                ))}
              </ol>
            </nav>
          </aside>
        )}

        <div className="lg:col-span-8 lg:row-start-1">
          <div className="article-prose" dangerouslySetInnerHTML={{ __html: a.html }} />

          <aside className="mt-16 rounded-2xl border border-line bg-surface p-8 md:p-10" aria-labelledby="article-cta">
            <h2 id="article-cta" className="font-display text-2xl text-paper md:text-3xl">Un projet en tête ?</h2>
            <p className="mt-3 max-w-[52ch] text-muted">
              FDA Studio accompagne les entreprises de Tours et de toute la France : {service.name.toLowerCase()}, de l’idée à la mise en ligne.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/#contact" className="btn btn-primary">Parler de votre projet <ArrowIcon /></Link>
              <Link href={`/${service.slug}/`} className="btn btn-ghost">{service.name}</Link>
            </div>
          </aside>
        </div>
      </div>

      {others.length > 0 && (
        <section aria-labelledby="more-title" className="border-t border-line pb-[var(--section-y)] pt-16">
          <div className="wrap">
            <h2 id="more-title" className="font-display text-2xl text-paper">À lire aussi</h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/ressources/${o.slug}/`} className="group block">
                    <p className="text-sm text-muted"><time dateTime={o.date}>{formatDate(o.date)}</time></p>
                    <p className="mt-2 text-lg leading-snug text-paper group-hover:text-accent-bright">{o.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
