import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "./JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export function PageHeader({
  crumbs,
  lines,
  intro,
  aside,
  tone = "ink",
}: {
  crumbs: { name: string; path: string }[];
  lines: string[];
  intro?: ReactNode;
  aside?: ReactNode;
  tone?: "ink" | "night";
}) {
  const all = [{ name: "Accueil", path: "/" }, ...crumbs];
  return (
    <header className={`relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-48 ${tone === "night" ? "bg-night" : ""}`}>
      <JsonLd data={breadcrumbJsonLd(all)} />
      <div className="glow-accent pointer-events-none absolute -right-48 -top-48 h-[44rem] w-[44rem] opacity-50" aria-hidden />
      <div className="wrap relative">
        <nav aria-label="Fil d’Ariane">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
            {all.map((c, i) => (
              <li key={c.path} className="flex items-center gap-2">
                {i < all.length - 1 ? (
                  <>
                    <Link href={c.path} className="link-line hover:text-paper">{c.name}</Link>
                    <span aria-hidden className="text-line-strong">/</span>
                  </>
                ) : (
                  <span aria-current="page" className="text-paper">{c.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className={aside ? "lg:col-span-8" : "lg:col-span-12"}>
            <h1 data-shown="true" className="text-giant font-semibold leading-[0.95] tracking-[-0.05em]">
              {lines.map((l, i) => (
                <span key={i} className="reveal-line"><span className="hero-rise" style={{ ["--i" as string]: i }}>{l}</span></span>
              ))}
            </h1>
            {intro && <div className="measure mt-10 text-lg text-muted md:text-xl">{intro}</div>}
          </div>
          {aside && <div className="lg:col-span-4">{aside}</div>}
        </div>
      </div>
    </header>
  );
}
