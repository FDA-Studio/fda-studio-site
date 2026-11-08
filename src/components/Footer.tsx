import Link from "next/link";
import { Logo } from "./brand/Logo";
import { externalLinks, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink">
      <div className="wrap pb-10 pt-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Logo variant="horizontal" className="h-9 w-auto text-white" studioColor="var(--color-muted)" />
            <a href={`mailto:${site.email}`} className="link-line mt-6 inline-block text-xl text-paper">{site.email}</a>
          </div>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
            <li><a href={externalLinks.doorknight} target="_blank" rel="noopener noreferrer" className="link-line hover:text-paper">Door Knight<span className="sr-only"> (nouvel onglet)</span></a></li>
            <li><a href={site.group.url} target="_blank" rel="noopener noreferrer" className="link-line hover:text-paper">Groupe FDA<span className="sr-only"> (nouvel onglet)</span></a></li>
            <li><Link href="/mentions-legales/" className="link-line hover:text-paper">Mentions légales</Link></li>
            <li><Link href="/confidentialite/" className="link-line hover:text-paper">Confidentialité</Link></li>
          </ul>
        </div>

        <p aria-hidden className="outline-text pointer-events-none mt-16 select-none whitespace-nowrap text-[min(18vw,19rem)] font-semibold leading-[0.8] tracking-[-0.06em]">
          FDA Studio
        </p>

        <p className="mt-8 border-t border-line pt-6 text-sm text-muted">
          © {new Date().getFullYear()} FDA Studio, marque de la société {site.company.name} ({site.group.name}). Aucun cookie, aucun traceur.
        </p>
      </div>
    </footer>
  );
}
