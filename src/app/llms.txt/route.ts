import { getArticles } from "@/lib/articles";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

/**
 * /llms.txt : présentation du studio pour les assistants IA (format proposé sur llmstxt.org).
 * Généré au build (export statique) : la liste des articles suit automatiquement la rubrique Ressources.
 */
export const dynamic = "force-static";

export function GET() {
  const c = site.company;
  const contact = [site.email, site.phone.display].filter(Boolean).join(", ");
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.name} est une agence web et IA basée à Fondettes, près de Tours (Indre-et-Loire, France). Le studio conçoit et développe des sites internet, des applications web et mobiles et des solutions d'intelligence artificielle (agents vocaux, chatbots, automatisation des e-mails et du CRM, lecture de documents) pour les TPE, PME et porteurs de projet, en Touraine et partout en France. Il développe aussi ses propres produits, dont le jeu mobile Door Knight.`,
    "",
    `${site.name} est un nom commercial de la société ${c.name} (${c.rcs}), membre du ${site.group.name}. Fondateur et gérant : ${site.author.name}. Contact : ${contact}. À ne pas confondre avec d'autres entités utilisant le sigle « FDA ».`,
    "",
    "## Services",
    "",
    ...services.map((s) => `- [${s.name}](${site.url}/${s.slug}/) : ${s.description}`),
    "",
    "## Ressources",
    "",
    ...getArticles().map((a) => `- [${a.title}](${site.url}/ressources/${a.slug}/) : ${a.description}`),
    "",
    "## Studio",
    "",
    `- [À propos de ${site.name}](${site.url}/a-propos/) : identité, fondateur, produits et méthode.`,
    `- [Gaming : Door Knight](${site.url}/gaming/) : le jeu d'action 3D du studio pour iPhone, iPad et Android.`,
    `- [Contact et demande de devis](${site.url}/#contact)`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
