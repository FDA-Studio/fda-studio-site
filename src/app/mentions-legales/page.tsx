import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = { ...pageMeta({ title: "Mentions légales", description: "Mentions légales du site FDA Studio : éditeur, hébergement et propriété intellectuelle.", path: "/mentions-legales/" }), robots: { index: false, follow: true } };

export default function MentionsPage() {
  const c = site.company;
  return (
    <LegalPage title="Mentions légales" path="/mentions-legales/">
      <div>
        <h2>Éditeur du site</h2>
        <p>Le site fdastudio.fr est édité par la société {c.name}, {c.form.toLowerCase()} au capital de {c.capital}, exerçant sous le nom commercial FDA Studio.</p>
        <ul>
          <li>Siège social : {c.address}</li>
          <li>Immatriculation : {c.rcs} (EUID {c.euid})</li>
          <li>TVA intracommunautaire : {c.vat}</li>
          <li>Directeur de la publication : {c.director}</li>
          <li>Contact : <a className="link-line text-paper" href={`mailto:${site.email}`}>{site.email}</a></li>
        </ul>
      </div>
      <div>
        <h2>Hébergement</h2>
        <p>GitHub, Inc. (GitHub Pages), 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis. Téléphone : +1 877 448 4820. github.com</p>
        <p>Le nom de domaine fdastudio.fr est enregistré auprès d’IONOS SARL, 7 place de la Gare, 57200 Sarreguemines, France.</p>
      </div>
      <div>
        <h2>Propriété intellectuelle</h2>
        <p>L’ensemble des contenus de ce site (textes, visuels, code, logos et sons) est la propriété de la société {c.name}, sauf mention contraire. FDA Studio et Door Knight sont des marques exploitées par la société {c.name}. Toute reproduction ou réutilisation sans autorisation écrite est interdite.</p>
        <p>Les visuels du jeu Door Knight proviennent du site officiel doorknight.games, édité par la même société.</p>
      </div>
      <div>
        <h2>Responsabilité</h2>
        <p>Les démonstrations interactives du site (agent IA, tableau de bord, application terrain) sont des concepts : les données affichées sont fictives et aucune information saisie n’y est transmise.</p>
      </div>
    </LegalPage>
  );
}
