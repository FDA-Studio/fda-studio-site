import Link from "next/link";
import { Logo } from "./brand/Logo";
import { localPages } from "@/lib/local-pages";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink">
      <div className="wrap pb-10 pt-16">
        <div>
          <div>
            <Logo variant="horizontal" className="h-9 w-auto text-white" studioColor="var(--color-muted)" />
            <a href={`mailto:${site.email}`} className="link-line mt-6 inline-block text-xl text-paper">{site.email}</a>
            {site.phone.display && (
              <a href={`tel:${site.phone.e164}`} className="link-line mt-3 block w-fit text-xl text-paper">{site.phone.display}</a>
            )}
          </div>
        </div>

        <p lang="en" className="slogan mt-20 md:mt-28">
          We build<br />what&rsquo;s next.
        </p>

        {/* Liens vers les pages du site : repliés pour alléger le bas de page. Ils restent dans le HTML
            (lisibles par Google) et s'ouvrent d'un toucher. */}
        <details className="foot-more mt-8 border-t border-line pt-4">
          <summary>Toutes les pages</summary>
          <nav aria-label="Toutes les pages" className="pb-2 pt-3">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
              <li><Link href="/creation-site-internet-tours/" className="link-line hover:text-paper">Création de site internet à Tours</Link></li>
              <li><Link href="/agence-ia-tours/" className="link-line hover:text-paper">Agence IA à Tours</Link></li>
              <li><Link href="/developpement-application-tours/" className="link-line hover:text-paper">Applications mobiles et web</Link></li>
              <li><Link href="/gaming/" className="link-line hover:text-paper">Gaming</Link></li>
              <li><Link href="/ressources/" className="link-line hover:text-paper">Ressources</Link></li>
              <li><Link href="/a-propos/" className="link-line hover:text-paper">À propos</Link></li>
              {localPages.map((p) => (
                <li key={p.slug}><Link href={`/${p.slug}/`} className="link-line hover:text-paper">{p.name}</Link></li>
              ))}
            </ul>
          </nav>
        </details>

        <div className="mt-4 border-t border-line pt-6 text-sm text-muted">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li><Link href="/mentions-legales/" className="link-line hover:text-paper">Mentions légales</Link></li>
            <li><Link href="/confidentialite/" className="link-line hover:text-paper">Confidentialité</Link></li>
            <li><a href={site.group.url} target="_blank" rel="noopener noreferrer" className="link-line hover:text-paper">Groupe FDA<span className="sr-only"> (nouvel onglet)</span></a></li>
          </ul>
          <p className="mt-4">
            © {new Date().getFullYear()} FDA Studio, marque de la société {site.company.name} ({site.group.name}). Aucun cookie, aucun traceur.
          </p>
        </div>
      </div>
    </footer>
  );
}
