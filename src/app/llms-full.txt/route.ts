import { aboutFaq } from "@/lib/about";
import { articleMarkdown, formatDate, getArticles } from "@/lib/articles";
import { llmsFacts, llmsSummary, textResponse } from "@/lib/llms";
import { localPages } from "@/lib/local-pages";
import { services, type Service } from "@/lib/services";
import { site } from "@/lib/site";

/**
 * /llms-full.txt : version intégrale de /llms.txt, pour un assistant IA qui veut tout lire en une
 * seule requête. Générée au build à partir des mêmes données que les pages (services, pages locales,
 * questions fréquentes, articles) : elle ne peut pas diverger du site. Exclue de l'index des moteurs
 * (en-tête X-Robots-Tag dans vercel.json) : seules les pages HTML doivent apparaître et être citées.
 */
export const dynamic = "force-static";

/** Liens internes relatifs (« /agence-ia-tours/ ») rendus absolus : le fichier se lit hors du site. */
const absolute = (md: string) => md.replace(/\]\(\//g, `](${site.url}/`);
/** Les titres d'un article descendent de deux niveaux pour rester sous le titre de l'article. */
const demote = (md: string) => md.replace(/^(#{1,4}) /gm, (_, h: string) => `${"#".repeat(h.length + 2)} `);
const heading = (s: string) => s.replace(/\.$/, "");

function servicePage(p: Service): string[] {
  return [
    `### ${p.h1.join(" ")}`,
    "",
    `Page : ${site.url}/${p.slug}/`,
    "",
    p.intro,
    "",
    `#### ${heading(p.headings.offers)}`,
    "",
    ...p.offers.map((o) => `- ${o.title} : ${o.text}`),
    "",
    `#### ${heading(p.headings.forWhom)}`,
    "",
    ...p.forWhom.map((w) => `- ${w.title} : ${w.text}`),
    "",
    `#### ${heading(p.headings.steps)}`,
    "",
    ...p.steps.map((st, i) => `${i + 1}. ${st.title} : ${st.text}`),
    "",
    `#### ${heading(p.headings.included)}`,
    "",
    ...p.included.map((it) => `- ${it}`),
    "",
    `#### ${heading(p.headings.local)}`,
    "",
    p.local,
    "",
    `#### ${heading(p.headings.faq)}`,
    "",
    ...p.faq.flatMap((f) => [`**${f.q}**`, f.a, ""]),
  ];
}

export function GET() {
  return textResponse([
    `# ${site.name} : version intégrale`,
    "",
    `> ${llmsSummary}`,
    "",
    site.disambiguation,
    "",
    `Ce fichier reprend le texte des pages de ${site.url} (version courte : ${site.url}/llms.txt). Pour citer une information, citez la page indiquée sous chaque titre.`,
    "",
    "Faits clés :",
    "",
    ...llmsFacts(),
    "",
    `## À propos de ${site.name}`,
    "",
    `Page : ${site.url}/a-propos/`,
    "",
    ...aboutFaq.flatMap((f) => [`**${f.q}**`, f.a, ""]),
    "## Services",
    "",
    ...services.flatMap(servicePage),
    "## Pages par ville et par métier",
    "",
    ...localPages.flatMap(servicePage),
    "## Articles",
    "",
    ...getArticles().flatMap((a) => [
      `### ${a.title}`,
      "",
      `Page : ${site.url}/ressources/${a.slug}/`,
      `Publié le ${formatDate(a.date)}${a.updated && a.updated !== a.date ? `, mis à jour le ${formatDate(a.updated)}` : ""}, par ${site.author.name}.`,
      "",
      a.description,
      "",
      demote(absolute(articleMarkdown(a.slug))),
      "",
    ]),
  ]);
}
