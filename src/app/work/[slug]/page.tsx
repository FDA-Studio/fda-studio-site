import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { ProjectVisual } from "@/components/ProjectVisual";
import { ProjectCard } from "@/components/ProjectCard";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { ArrowIcon, ExternalIcon } from "@/components/icons";
import { categoryLabels, getProject, natureLabels, projects } from "@/lib/projects";
import { pageMeta } from "@/lib/seo";
import { doorKnight } from "@/lib/doorknight";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return pageMeta({ title: `${p.title} — ${p.owner}`, description: p.summary, path: `/work/${p.slug}/` });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const external = p.link?.href.startsWith("http");
  const idx = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <>
      <PageHeader
        tone={p.cover === "doors" || p.cover === "browser" ? "night" : "ink"}
        crumbs={[{ name: "Réalisations", path: "/work/" }, { name: p.title, path: `/work/${p.slug}/` }]}
        lines={[p.title]}
        intro={<p>{p.summary}</p>}
      />

      <section aria-label="Visuel du projet" className="pb-16">
        <div className="wrap">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-line md:aspect-[21/9]">
            <ProjectVisual project={p} className="absolute inset-0" eager />
          </div>
          {p.nature === "concept" && (
            <p className="mt-4 text-sm text-muted">Démonstrateur ou concept interne FDA Studio : ce n’est pas une réalisation client.</p>
          )}
        </div>
      </section>

      <section aria-labelledby="projet-title" className="section !pt-8">
        <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-10">
          <aside className="lg:col-span-4">
            <dl className="divide-y divide-line border-y border-line">
              {[
                ["Projet", p.owner],
                ["Statut", p.status],
                ["Nature", natureLabels[p.nature]],
                ["Domaines", p.categories.map((c) => categoryLabels[c]).join(", ")],
                ["Année", p.year],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-4 text-sm">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right text-paper">{v}</dd>
                </div>
              ))}
            </dl>
            {p.link && (
              external ? (
                <a href={p.link.href} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-8 w-full">
                  {p.link.label} <span className="btn-icon"><ExternalIcon /></span><span className="sr-only">(nouvel onglet)</span>
                </a>
              ) : (
                <Link href={p.link.href} className="btn btn-primary mt-8 w-full">
                  {p.link.label} <span className="btn-icon"><ArrowIcon /></span>
                </Link>
              )
            )}
          </aside>
          <div className="lg:col-span-7 lg:col-start-6">
            <h2 id="projet-title" className="text-heading">Contexte</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">{p.context}</p>
            <h2 className="text-heading mt-16">Ce que nous avons fait</h2>
            <ul className="mt-6 space-y-4">
              {p.work.map((w) => (
                <li key={w} className="flex gap-4 border-b border-line pb-4 text-paper/90">
                  <span className="mt-3 h-px w-4 shrink-0 bg-accent" aria-hidden />
                  {w}
                </li>
              ))}
            </ul>
            <ul className="mt-10 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <li key={t} className="rounded-full border border-line-strong px-3 py-1.5 text-sm text-muted">{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {(p.slug === "door-knight" || p.slug === "doorknight-games") && (
        <section aria-labelledby="galerie-title" className="border-t border-line py-20">
          <div className="wrap">
            <div className="flex items-end justify-between gap-6">
              <h2 id="galerie-title" className="text-heading">Captures du jeu</h2>
              <Link href="/gaming/" className="link-line text-muted hover:text-paper">Tout l’univers Door Knight</Link>
            </div>
            <ul className="mt-10 grid gap-6 md:grid-cols-2">
              {[...doorKnight.shots, ...doorKnight.ui.slice(0, 2)].map((s) => (
                <li key={s.img}>
                  <img src={s.img} alt={s.alt} width={800} height={360} loading="lazy" decoding="async" className="aspect-[20/9] w-full rounded-2xl border border-line object-cover" />
                  <p className="mt-3 text-sm text-muted">{s.alt}.</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section aria-label="Projet suivant" className="border-t border-line py-20">
        <div className="wrap">
          <p className="mb-8 font-display text-sm text-muted">Projet suivant</p>
          <div className="max-w-2xl">
            <ProjectCard project={next} />
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
