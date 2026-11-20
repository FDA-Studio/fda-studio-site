import { getArticles } from "@/lib/articles";
import { llmsFacts, llmsSummary, textResponse } from "@/lib/llms";
import { localPages } from "@/lib/local-pages";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

/**
 * /llms.txt : présentation du studio pour les assistants IA (format proposé sur llmstxt.org).
 * Généré au build (export statique) : la liste des articles suit automatiquement la rubrique Ressources.
 * La version intégrale (texte complet des pages et des articles) est servie par /llms-full.txt.
 */
export const dynamic = "force-static";

export function GET() {
  return textResponse([
    `# ${site.name}`,
    "",
    `> ${llmsSummary}`,
    "",
    site.disambiguation,
    "",
    "Faits clés :",
    "",
    ...llmsFacts(),
    "",
    "## Services",
    "",
    ...services.map((s) => `- [${s.name}](${site.url}/${s.slug}/) : ${s.description}`),
    "",
    "## Pages par ville et par métier",
    "",
    ...localPages.map((p) => `- [${p.name}](${site.url}/${p.slug}/) : ${p.description}`),
    "",
    "## Ressources",
    "",
    ...getArticles().map((a) => `- [${a.title}](${site.url}/ressources/${a.slug}/) : ${a.description}`),
    "",
    "## Studio",
    "",
    `- [À propos de ${site.name}](${site.url}/a-propos/) : identité, fondateur, produits, méthode et questions fréquentes sur le studio.`,
    `- [Gaming : Door Knight](${site.url}/gaming/) : le jeu d'action 3D du studio pour iPhone, iPad et Android.`,
    `- [Contact et demande de devis](${site.url}/#contact)`,
    "",
    "## Optional",
    "",
    `- [Version intégrale](${site.url}/llms-full.txt) : texte complet des pages de service, des pages locales, des questions fréquentes et des articles, en un seul fichier.`,
    "",
  ]);
}
