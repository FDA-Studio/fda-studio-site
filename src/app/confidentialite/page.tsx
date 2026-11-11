import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Politique de confidentialité", description: "Comment FDA Studio traite les données personnelles : site, chat et démo d’Emma, clients, prospection. Finalités, durées de conservation et droits.", path: "/confidentialite/" });

/*
 * À tenir à jour avec le registre des traitements de FDA Studio (document « Registre RGPD »).
 * Toute nouvelle collecte de données dans le site ou dans l'outil interne (app.fdastudio.fr)
 * doit être ajoutée ici et dans le registre.
 */
export default function PrivacyPage() {
  const c = site.company;
  const mail = <a className="link-line text-paper" href={`mailto:${site.email}`}>{site.email}</a>;
  return (
    <LegalPage title="Confidentialité" path="/confidentialite/">
      <div>
        <h2>En bref</h2>
        <p>Ce site ne dépose aucun cookie de mesure d’audience ni de publicité, et n’utilise aucun traceur publicitaire. Nous traitons uniquement les données que vous nous transmettez (formulaire, e-mail, chat ou démo d’Emma), celles de nos clients pour gérer nos projets, et, pour la prospection, des informations professionnelles publiques sur les entreprises. Nous ne vendons ni ne cédons aucune donnée.</p>
      </div>
      <div>
        <h2>Responsable du traitement</h2>
        <p>Société {c.name} (nom commercial FDA Studio), {c.address}, {c.rcs}. Contact : {mail}.</p>
      </div>
      <div>
        <h2>Ce qui est enregistré dans votre navigateur</h2>
        <p>Le site garde uniquement vos réglages d’affichage : son activé ou coupé, animations en pause. Ils restent dans votre navigateur, ne contiennent aucun identifiant et ne nous sont pas transmis. Ces réglages, nécessaires au service que vous demandez, ne requièrent pas de consentement.</p>
        <p>Pour bloquer les robots, le formulaire de contact, le chat et la démo d’Emma utilisent Cloudflare Turnstile, chargé seulement quand vous les ouvrez. Cloudflare vérifie alors que vous êtes humain à partir de signaux techniques du navigateur, sans publicité ni suivi entre sites. Base légale : intérêt légitime (sécurité du service).</p>
      </div>
      <div>
        <h2>Formulaire de contact</h2>
        <p>Votre demande est transmise de façon chiffrée à l’outil de gestion commerciale de FDA Studio, où elle est enregistrée pour que nous puissions vous répondre. Vous recevez un accusé de réception par e-mail. Pour limiter les abus, une empreinte non réversible de votre adresse IP est conservée avec la demande ; l’adresse IP elle-même n’est pas enregistrée.</p>
        <p>Données concernées : nom, e-mail, entreprise et téléphone (facultatifs), type de besoin, budget, délai et description du projet. Finalité : répondre à votre demande et préparer une éventuelle proposition commerciale. Base légale : mesures précontractuelles prises à votre demande.</p>
      </div>
      <div>
        <h2>Chat « Emma, par écrit »</h2>
        <p>Emma est une intelligence artificielle, et elle se présente comme telle. Vos messages sont transmis à ElevenLabs, qui génère ses réponses. Si vous lui confiez votre projet ou réservez un échange, Emma enregistre ces informations (nom, coordonnées, besoin, créneau) dans notre outil de gestion, comme le ferait le formulaire de contact. La conversation est conservée 30 jours chez ElevenLabs, puis supprimée. Base légale : mesures précontractuelles prises à votre demande.</p>
      </div>
      <div>
        <h2>Démo vocale « Parler à Emma »</h2>
        <p>La démo ne démarre que lorsque vous cliquez sur « Démarrer l’appel » et autorisez votre micro ; elle s’arrête au bout de deux minutes. Votre voix est transmise en direct à ElevenLabs, qui la transcrit et génère les réponses d’Emma. L’audio n’est pas enregistré ; la transcription est conservée 30 jours pour vérifier la qualité de la démo, puis supprimée. Emma ne vous demande aucune coordonnée.</p>
        <p>Pour limiter les abus (deux démos par jour et par visiteur), une empreinte non réversible de votre adresse IP est conservée par notre outil de gestion ; l’adresse IP elle-même n’est pas enregistrée. Base légale : votre demande d’utiliser la démo.</p>
      </div>
      <div>
        <h2>Clients, devis et facturation</h2>
        <p>Pour nos clients, nous conservons dans notre outil de gestion les coordonnées professionnelles, les échanges (e-mails, notes, résumés d’appels), les devis, les projets et les factures. Lorsque vous signez un devis en ligne, nous enregistrons votre nom, la date et l’heure, votre adresse IP et le navigateur utilisé, comme preuve de votre accord. Les factures sont émises via notre banque professionnelle. Base légale : exécution du contrat et obligations comptables et fiscales.</p>
      </div>
      <div>
        <h2>Prospection commerciale entre professionnels</h2>
        <p>FDA Studio présente ses services par e-mail à des entreprises dont l’activité peut être concernée. Nous utilisons uniquement des informations professionnelles publiques : le nom, le numéro SIREN, l’activité et la commune de l’entreprise (annuaire officiel des entreprises, données SIRENE), et l’adresse e-mail professionnelle publiée sur son site, ainsi que quelques constats techniques sur ce site (sécurité, adaptation au mobile, prise de rendez-vous en ligne). Les entreprises qui se sont opposées à la prospection commerciale dans le répertoire SIRENE sont exclues.</p>
        <p>Finalité : vous présenter des services en rapport avec votre activité professionnelle. Base légale : l’intérêt légitime de FDA Studio à faire connaître ses services. Chaque message indique comment ne plus en recevoir : un lien de désinscription en un clic, ou une simple réponse « stop » ou « non merci ». Aucun outil de suivi d’ouverture n’est utilisé.</p>
      </div>
      <div>
        <h2>Destinataires et sous-traitants</h2>
        <ul>
          <li>Les données ne sont ni vendues ni cédées. Elles sont lues uniquement par l’équipe FDA Studio.</li>
          <li>Base de données de l’outil de gestion : Supabase (hébergement à Paris, Union européenne).</li>
          <li>Site et application de gestion : Vercel (fonctions exécutées à Paris ; société américaine, transferts encadrés par les clauses contractuelles types de la Commission européenne).</li>
          <li>E-mails transactionnels et réponses des clients : Resend (serveurs d’envoi en Irlande, Union européenne ; société américaine, mêmes garanties).</li>
          <li>Chat, démo vocale et agent téléphonique Emma : ElevenLabs (société américaine, transferts encadrés par les clauses contractuelles types de la Commission européenne).</li>
          <li>Messagerie et boîte d’envoi de la prospection : IONOS (Union européenne).</li>
          <li>Protection anti-robots du formulaire, du chat et de la démo : Cloudflare (société américaine, transferts encadrés par les clauses contractuelles types et le cadre de protection des données UE–États-Unis).</li>
          <li>Banque professionnelle et facturation : établissement bancaire français, qui conserve les factures et les opérations.</li>
          <li>L’expérience sonore et les visuels Door Knight sont servis depuis nos propres sites (fdastudio.fr et doorknight.games).</li>
        </ul>
      </div>
      <div>
        <h2>Durées de conservation</h2>
        <ul>
          <li>Demandes de projet sans suite : trois ans à compter du dernier échange, puis suppression.</li>
          <li>Clients : pendant la relation, puis trois ans après le dernier échange pour les données commerciales (échanges, notes, projets, devis non signés), effacées automatiquement. Devis signés : cinq ans après le dernier échange, durée de prescription des contrats entre commerçants. Factures : dix ans après la clôture de l’exercice, comme l’exige le Code de commerce.</li>
          <li>Prospection : douze mois après le dernier échange, puis suppression automatique. En cas d’opposition, seule l’adresse (ou le domaine) est conservée, pour ne plus vous écrire.</li>
          <li>Chat, démo vocale et appels d’Emma : 30 jours. L’audio n’est jamais enregistré.</li>
          <li>Empreinte anti-abus des démos : jusqu’à la fin du mois suivant. Empreinte anti-abus du formulaire de contact : 30 jours.</li>
        </ul>
      </div>
      <div>
        <h2>Sécurité</h2>
        <p>L’accès à notre outil de gestion est réservé à l’équipe FDA Studio et protégé par une double authentification. Les échanges sont chiffrés, et chaque donnée n’est accessible qu’aux personnes autorisées.</p>
      </div>
      <div>
        <h2>Vos droits</h2>
        <p>Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition (notamment à la prospection, à tout moment et sans justification), de limitation et de portabilité. Pour l’exercer, écrivez à {mail} ; nous répondons sous un mois. Vous pouvez aussi introduire une réclamation auprès de la CNIL (cnil.fr).</p>
      </div>
    </LegalPage>
  );
}
