import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Politique de confidentialité", description: "Comment FDA Studio traite les données transmises via son site : finalité, durée de conservation et droits.", path: "/confidentialite/" });

export default function PrivacyPage() {
  return (
    <LegalPage title="Confidentialité" path="/confidentialite/">
      <div>
        <h2>En bref</h2>
        <p>Ce site ne dépose aucun cookie et n’utilise aucun outil de mesure d’audience ni aucun traceur publicitaire. Les seules données collectées sont celles que vous transmettez volontairement via le formulaire de contact.</p>
      </div>
      <div>
        <h2>Responsable du traitement</h2>
        <p>{site.legalName}, <mark>adresse à compléter</mark>. Contact : <a className="link-line text-paper" href={`mailto:${site.email}`}>{site.email}</a>.</p>
      </div>
      <div>
        <h2>Données collectées et finalité</h2>
        <p>Nom, e-mail, entreprise et téléphone (facultatifs), type de besoin, budget, délai et description du projet. Ces données servent uniquement à répondre à votre demande et à préparer une éventuelle proposition commerciale. Base légale : votre consentement et les mesures précontractuelles prises à votre demande.</p>
      </div>
      <div>
        <h2>Durée de conservation</h2>
        <p>Trois ans à compter du dernier échange, sauf relation contractuelle, puis suppression.</p>
      </div>
      <div>
        <h2>Destinataires et sous-traitants</h2>
        <ul>
          <li>Les données ne sont ni vendues ni cédées.</li>
          <li><mark>Liste à confirmer selon la configuration retenue</mark> : Supabase (hébergement des demandes, région Union européenne) et Resend (acheminement de l’e-mail de notification).</li>
        </ul>
      </div>
      <div>
        <h2>Vos droits</h2>
        <p>Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition, de limitation et de portabilité. Pour l’exercer, écrivez à {site.email}. Vous pouvez aussi saisir la CNIL (cnil.fr).</p>
      </div>
    </LegalPage>
  );
}
