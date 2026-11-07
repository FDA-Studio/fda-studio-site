import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = { ...pageMeta({ title: "Mentions légales", description: "Mentions légales du site FDA Studio.", path: "/mentions-legales/" }), robots: { index: false, follow: true } };

/* TODO(FDA) : compléter les éléments surlignés avant la mise en ligne. Ne pas publier en l'état. */
export default function MentionsPage() {
  return (
    <LegalPage title="Mentions légales" path="/mentions-legales/">
      <div>
        <h2>Éditeur du site</h2>
        <p>{site.legalName}, <mark>forme juridique et capital à compléter</mark>.</p>
        <p>Siège social : <mark>adresse à compléter</mark>. SIRET : <mark>à compléter</mark>. TVA intracommunautaire : <mark>à compléter</mark>.</p>
        <p>Directeur de la publication : <mark>à compléter</mark>. Contact : <a className="link-line text-paper" href={`mailto:${site.email}`}>{site.email}</a>.</p>
      </div>
      <div>
        <h2>Hébergement</h2>
        <p>GitHub Pages, GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis.</p>
      </div>
      <div>
        <h2>Propriété intellectuelle</h2>
        <p>L’ensemble des contenus de ce site (textes, visuels, code, marques et logos) est la propriété de {site.legalName} ou du groupe FDA, sauf mention contraire. Toute reproduction sans autorisation est interdite.</p>
      </div>
      <div>
        <h2>Door Knight</h2>
        <p>Door Knight est un jeu développé par FDA Studio. Les informations relatives au jeu sont publiées sur doorknight.games.</p>
      </div>
    </LegalPage>
  );
}
