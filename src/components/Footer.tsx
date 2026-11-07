import Link from "next/link";
import { Logo } from "./brand/Logo";
import { externalLinks, site } from "@/lib/site";
import { services } from "@/lib/services";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink">
      <div className="wrap pb-10 pt-20 md:pt-28">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo variant="horizontal" className="h-9 w-auto text-white" studioColor="var(--color-muted)" />
            <p className="mt-6 max-w-sm text-muted">
              Sites internet, intelligence artificielle, applications et jeux vidéo. Le studio technologique du groupe FDA.
            </p>
            <a href={`mailto:${site.email}`} className="link-line mt-8 inline-block font-display text-xl text-paper md:text-2xl">
              {site.email}
            </a>
          </div>

          <nav aria-label="Expertises" className="md:col-span-3">
            <p className="font-display text-sm text-muted">Expertises</p>
            <ul className="mt-5 space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}/`} className="link-line text-paper/90 hover:text-paper">{s.shortName}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Studio" className="md:col-span-2">
            <p className="font-display text-sm text-muted">Studio</p>
            <ul className="mt-5 space-y-3">
              <li><Link href="/work/" className="link-line text-paper/90">Réalisations</Link></li>
              <li><Link href="/gaming/" className="link-line text-paper/90">Gaming</Link></li>
              <li><Link href="/about/" className="link-line text-paper/90">À propos</Link></li>
              <li><Link href="/contact/" className="link-line text-paper/90">Contact</Link></li>
            </ul>
          </nav>

          <nav aria-label="Univers" className="md:col-span-2">
            <p className="font-display text-sm text-muted">Univers FDA</p>
            <ul className="mt-5 space-y-3">
              <li><a href={externalLinks.doorknight} target="_blank" rel="noopener noreferrer" className="link-line text-paper/90">Door Knight<span className="sr-only"> (nouvel onglet)</span></a></li>
              <li><a href={site.group.url} target="_blank" rel="noopener noreferrer" className="link-line text-paper/90">Groupe FDA<span className="sr-only"> (nouvel onglet)</span></a></li>
            </ul>
          </nav>
        </div>

        {/* Signature monumentale */}
        <p aria-hidden className="outline-text pointer-events-none mt-20 select-none whitespace-nowrap font-display text-[min(18vw,19rem)] font-semibold leading-[0.8] tracking-[-0.06em] md:mt-28">
          FDA Studio
        </p>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} FDA Studio, marque de la société {site.company.name} ({site.group.name}).</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li><Link href="/mentions-legales/" className="link-line hover:text-paper">Mentions légales</Link></li>
            <li><Link href="/confidentialite/" className="link-line hover:text-paper">Confidentialité</Link></li>
            <li>Aucun cookie, aucun traceur</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
