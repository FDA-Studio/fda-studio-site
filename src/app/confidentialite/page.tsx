import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Politique de confidentialité", description: "Comment FDA Studio traite les données transmises via son site : finalité, durée de conservation et droits.", path: "/confidentialite/" });

/*
 * Rédigée pour la configuration actuelle : formulaire en e-mail pré-rempli, sans serveur.
 * Si la fonction serveur (Supabase + Resend) est activée, ajouter ces sous-traitants ci-dessous.
 */
export default function PrivacyPage() {
  const c = site.company;
  return (
    <LegalPage title="Confidentialité" path="/confidentialite/">
      <div>
        <h2>En bref</h2>
        <p>Ce site ne dépose aucun cookie et n’utilise aucun outil de mesure d’audience ni aucun traceur publicitaire. Les seules données personnelles traitées sont celles que vous nous envoyez volontairement par e-mail, notamment via le formulaire de contact.</p>
      </div>
      <div>
        <h2>Responsable du traitement</h2>
        <p>Société {c.name} (nom commercial FDA Studio), {c.address}. Contact : <a className="link-line text-paper" href={`mailto:${site.email}`}>{site.email}</a>.</p>
      </div>
      <div>
        <h2>Formulaire de contact</h2>
        <p>Le formulaire vérifie votre saisie dans votre navigateur, puis ouvre votre messagerie avec un e-mail pré-rempli adressé à {site.email}. Rien n’est enregistré par le site lui-même : la demande n’existe qu’une fois l’e-mail envoyé par vos soins.</p>
        <p>Données concernées : nom, e-mail, entreprise et téléphone (facultatifs), type de besoin, budget, délai et description du projet. Finalité : répondre à votre demande et préparer une éventuelle proposition commerciale. Base légale : mesures précontractuelles prises à votre demande.</p>
      </div>
      <div>
        <h2>Destinataires et sous-traitants</h2>
        <ul>
          <li>Les données ne sont ni vendues ni cédées. Elles sont lues uniquement par l’équipe FDA Studio.</li>
          <li>Messagerie : IONOS (hébergement des e-mails, Union européenne).</li>
          <li>Hébergement du site : GitHub Pages, qui traite des journaux techniques de connexion (adresse IP) pour assurer la sécurité du service.</li>
          <li>L’expérience sonore et les visuels Door Knight sont servis depuis nos propres sites (fdastudio.fr et doorknight.games).</li>
        </ul>
      </div>
      <div>
        <h2>Durée de conservation</h2>
        <p>Trois ans à compter du dernier échange en l’absence de relation contractuelle, puis suppression.</p>
      </div>
      <div>
        <h2>Vos droits</h2>
        <p>Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition, de limitation et de portabilité. Pour l’exercer, écrivez à {site.email}. Vous pouvez aussi introduire une réclamation auprès de la CNIL (cnil.fr).</p>
      </div>
    </LegalPage>
  );
}
