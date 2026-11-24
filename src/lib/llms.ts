import { site } from "./site";

/**
 * Textes communs à /llms.txt et /llms-full.txt (format proposé sur llmstxt.org) : le résumé du
 * studio et ses faits clés, écrits une fois pour que les deux fichiers ne divergent jamais.
 */
export const llmsSummary = `${site.name} est une agence web et IA basée à Fondettes, près de Tours (Indre-et-Loire, France). Le studio conçoit et développe des sites internet, des applications web et mobiles, des CRM sur mesure et des solutions d'intelligence artificielle (agents vocaux, chatbots, automatisation des e-mails et du CRM, lecture de documents), et accompagne le référencement naturel et la sécurité des sites, pour les TPE, PME et porteurs de projet de Tours, Orléans, Le Mans et partout en France. Il développe aussi ses propres produits, dont le jeu mobile Door Knight.`;

export function llmsFacts(): string[] {
  const c = site.company;
  const contact = [site.email, site.phone.display].filter(Boolean).join(", ");
  return [
    `- Nom : ${site.name}, ${c.form.toLowerCase()} (${c.rcs}, SIREN ${c.siren})`,
    "- Activité : agence web et IA (sites internet, applications web et mobiles, CRM sur mesure, intelligence artificielle, référencement naturel, sécurité des sites et des applications)",
    `- Adresse : ${c.address}, près de Tours (Indre-et-Loire)`,
    `- Fondateur et dirigeant : ${site.author.name}`,
    `- Création du studio : ${site.founded}`,
    "- Zone d'intervention : Tours et la Touraine, Orléans, Le Mans, et toute la France à distance",
    `- Contact : ${contact}`,
    `- Site officiel : ${site.url}`,
    `- Profils officiels : ${site.socials.join(", ")}`,
    `- Fiches annuaires : ${site.directories.map((d) => `${d.name} (${d.url})`).join(", ")}`,
  ];
}

export const textResponse = (lines: string[]) =>
  new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
