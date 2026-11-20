import { services } from "./services";
import { site } from "./site";

/** Première lettre en minuscule, sauf pour un sigle (« CRM sur mesure » reste tel quel). */
const lowerFirst = (s: string) => (/^[A-ZÀ-Ý][a-zà-ÿ]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s);

/** « a, b et c » */
const frList = (items: string[]) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} et ${items[items.length - 1]}`);

const c = site.company;
const contact = site.phone.display ? `par e-mail à ${site.email} ou par téléphone au ${site.phone.display}` : `par e-mail à ${site.email}`;

/**
 * Questions fréquentes sur le studio lui-même : celles qu'on pose à un moteur de recherche ou à un
 * assistant IA sur une entreprise (qui, quoi, où, depuis quand). Affichées sur /a-propos/ avec leurs
 * données structurées FAQPage, et reprises dans /llms-full.txt. Faits vérifiables uniquement :
 * aucun prix, aucun délai, aucun client.
 */
export const aboutFaq: { q: string; a: string }[] = [
  {
    q: "Qu’est-ce que FDA Studio ?",
    a: "FDA Studio est une agence web et IA basée à Fondettes, près de Tours (Indre-et-Loire). Le studio conçoit et développe des sites internet, des applications web et mobiles, des CRM sur mesure et des solutions d’intelligence artificielle (agents vocaux, assistants écrits, automatisations) pour les TPE, PME et porteurs de projet. Il accompagne aussi le référencement naturel et la sécurité des sites.",
  },
  {
    q: "Quels services propose FDA Studio ?",
    a: `Le studio propose ${frList(services.map((s) => lowerFirst(s.name)))}. Il développe aussi ses propres produits, dont le jeu mobile Door Knight.`,
  },
  {
    q: "Où se trouve FDA Studio ?",
    a: `Le studio est installé à ${c.address.replace(/, France$/, "")}, près de Tours. Le premier échange a lieu à Tours ou en visio, ce qui lui permet de travailler avec des entreprises de toute la France.`,
  },
  {
    q: "Dans quelles villes FDA Studio intervient-il ?",
    a: "À Tours et dans toute la Touraine, à Orléans et dans le Loiret, au Mans et dans la Sarthe, et partout en France à distance.",
  },
  {
    q: "Qui a fondé FDA Studio ?",
    a: `${site.author.name}, qui dirige le studio depuis sa création en ${site.founded}. FDA Studio est un nom commercial de la société ${c.name} (${c.rcs}), membre du ${site.group.name}.`,
  },
  {
    q: "FDA Studio a-t-il un lien avec la FDA américaine ?",
    a: `Non. ${site.disambiguation}`,
  },
  {
    q: "Comment demander un devis à FDA Studio ?",
    a: `Décrivez votre projet en quelques lignes dans le formulaire de contact du site, ${contact}. Le studio revient vers vous avec une première proposition ; le devis est gratuit.`,
  },
];
