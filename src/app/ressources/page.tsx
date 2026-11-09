import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ArrowIcon } from "@/components/icons";
import { formatDate, getArticles } from "@/lib/articles";
import { pageMeta } from "@/lib/seo";
import { serviceBySlug } from "@/lib/services";

export const metadata: Metadata = pageMeta({
  title: "Ressources : sites, IA et applications pour les entreprises",
  description: "Guides concrets de FDA Studio : prix, méthodes et retours d’expérience sur les sites internet, l’intelligence artificielle, les agents vocaux et les applications.",
  path: "/ressources/",
});

export default function RessourcesPage() {
  const articles = getArticles();
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Ressources", path: "/ressources/" }]}
        lines={["Ressources"]}
        intro="Des réponses concrètes aux questions que se posent les dirigeants avant un projet de site, d’IA ou d’application : prix, délais, méthodes et pièges à éviter."
      />
      <section className="pb-[var(--section-y)]">
        <div className="wrap">
          <ul className="divide-y divide-line border-y border-line">
            {articles.map((a) => (
              <li key={a.slug}>
                <Link href={`/ressources/${a.slug}/`} className="group grid gap-3 py-8 md:grid-cols-12 md:items-baseline md:gap-8">
                  <p className="text-sm text-muted md:col-span-3">
                    <time dateTime={a.date}>{formatDate(a.date)}</time>
                    <span className="block">{serviceBySlug(a.service)?.name}</span>
                  </p>
                  <div className="md:col-span-8">
                    <h2 className="font-display text-2xl leading-tight text-paper transition-colors group-hover:text-accent-bright md:text-3xl">{a.title}</h2>
                    <p className="mt-3 max-w-[62ch] text-muted">{a.description}</p>
                  </div>
                  <span className="hidden justify-self-end text-muted transition-transform group-hover:translate-x-1 md:col-span-1 md:block" aria-hidden>
                    <ArrowIcon />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
