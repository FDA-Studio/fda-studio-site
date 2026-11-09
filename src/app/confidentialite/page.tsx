import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Politique de confidentialité", description: "Comment FDA Studio traite les données transmises via son site : finalité, durée de conservation et droits.", path: "/confidentialite/" });

/*
 * Formulaire relié à l'outil interne FDA Studio (app.fdastudio.fr) : Vercel, Supabase et Resend
 * sont sous-traitants. Si NEXT_PUBLIC_CONTACT_ENDPOINT n'est pas défini, le formulaire repasse en
 * e-mail pré-rempli : adapter alors la section « Formulaire de contact ».
 */
export default function PrivacyPage() {
  const c = site.company;
  return (
    <LegalPage title="Confidentialité" path="/confidentialite/">
      <div>
        <h2>En bref</h2>
        <p>Ce site ne dépose aucun cookie et n’utilise aucun outil de mesure d’audience ni aucun traceur publicitaire. Les seules données personnelles traitées sont celles que vous nous envoyez volontairement : via le formulaire de contact, par e-mail, ou en parlant à Emma, notre démo d’agent vocal.</p>
      </div>
      <div>
        <h2>Responsable du traitement</h2>
        <p>Société {c.name} (nom commercial FDA Studio), {c.address}. Contact : <a className="link-line text-paper" href={`mailto:${site.email}`}>{site.email}</a>.</p>
      </div>
      <div>
        <h2>Formulaire de contact</h2>
        <p>Votre demande est transmise de façon chiffrée à l’outil de gestion commerciale de FDA Studio, où elle est enregistrée pour que nous puissions vous répondre. Vous recevez un accusé de réception par e-mail. Pour limiter les abus, une empreinte non réversible de votre adresse IP est conservée avec la demande ; l’adresse IP elle-même n’est pas enregistrée.</p>
        <p>Données concernées : nom, e-mail, entreprise et téléphone (facultatifs), type de besoin, budget, délai et description du projet. Finalité : répondre à votre demande et préparer une éventuelle proposition commerciale. Base légale : mesures précontractuelles prises à votre demande.</p>
      </div>
      <div>
        <h2>Démo vocale « Parler à Emma »</h2>
        <p>Emma est une intelligence artificielle. La démo ne démarre que lorsque vous cliquez sur « Démarrer l’appel » et autorisez votre micro ; elle s’arrête au bout de deux minutes. Votre voix est transmise en direct à ElevenLabs, qui la transcrit et génère les réponses d’Emma. L’audio n’est pas enregistré ; la transcription est conservée 30 jours pour vérifier la qualité de la démo, puis supprimée. Emma ne vous demande aucune coordonnée.</p>
        <p>Pour limiter les abus (deux démos par jour et par visiteur), une empreinte non réversible de votre adresse IP est conservée par notre outil de gestion ; l’adresse IP elle-même n’est pas enregistrée. Base légale : votre demande d’utiliser la démo.</p>
      </div>
      <div>
        <h2>Destinataires et sous-traitants</h2>
        <ul>
          <li>Les données ne sont ni vendues ni cédées. Elles sont lues uniquement par l’équipe FDA Studio.</li>
          <li>Base de données de l’outil de gestion : Supabase (hébergement à Paris, Union européenne).</li>
          <li>Application de gestion : Vercel (fonctions exécutées à Paris ; société américaine, transferts encadrés par les clauses contractuelles types de la Commission européenne).</li>
          <li>Envoi des e-mails de confirmation : Resend (serveurs d’envoi en Irlande, Union européenne ; société américaine, mêmes garanties).</li>
          <li>Démo vocale : ElevenLabs (société américaine, transferts encadrés par les clauses contractuelles types de la Commission européenne).</li>
          <li>Messagerie : IONOS (hébergement des e-mails, Union européenne).</li>
          <li>Hébergement du site : GitHub Pages, qui traite des journaux techniques de connexion (adresse IP) pour assurer la sécurité du service.</li>
          <li>L’expérience sonore et les visuels Door Knight sont servis depuis nos propres sites (fdastudio.fr et doorknight.games).</li>
        </ul>
      </div>
      <div>
        <h2>Durée de conservation</h2>
        <p>Demandes de projet : trois ans à compter du dernier échange en l’absence de relation contractuelle, puis suppression. Démo vocale : transcription 30 jours, empreinte anti-abus jusqu’à la fin du mois suivant.</p>
      </div>
      <div>
        <h2>Vos droits</h2>
        <p>Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition, de limitation et de portabilité. Pour l’exercer, écrivez à {site.email}. Vous pouvez aussi introduire une réclamation auprès de la CNIL (cnil.fr).</p>
      </div>
    </LegalPage>
  );
}
