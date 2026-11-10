import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Marked, type Tokens } from "marked";
import { z } from "zod";
import { services } from "./services";
import { frTypo } from "./typo";

export { frTypo };

/**
 * Articles de la rubrique « Ressources » : un fichier Markdown par article dans
 * content/ressources/<slug>.md, avec un en-tête (front matter) validé ci-dessous.
 * Lus au moment du build (export statique) : rien n'est exécuté côté navigateur.
 */

const DIR = join(process.cwd(), "content", "ressources");
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const serviceSlugs = services.map((s) => s.slug) as [string, ...string[]];

const FrontMatter = z.object({
  title: z.string().min(10).max(110),
  description: z.string().min(70).max(170),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  service: z.enum(serviceSlugs),
  keywords: z.array(z.string()).max(12).default([]),
  draft: z.boolean().default(false),
});

export type Article = z.infer<typeof FrontMatter> & {
  slug: string;
  html: string;
  toc: { id: string; text: string }[];
  readingMinutes: number;
};

/** En-tête minimal : `clé: valeur`, listes `[a, b]`, booléens. Pas de YAML arbitraire. */
function parseFrontMatter(raw: string): { data: Record<string, unknown>; body: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!m) throw new Error("En-tête --- manquant");
  const data: Record<string, unknown> = {};
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const i = line.indexOf(":");
    if (i < 1) throw new Error(`Ligne d'en-tête invalide : ${line}`);
    const key = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    const unquote = (s: string) => s.trim().replace(/^["']|["']$/g, "");
    if (v.startsWith("[") && v.endsWith("]")) {
      data[key] = v.slice(1, -1).split(",").map(unquote).filter(Boolean);
    } else if (v === "true" || v === "false") {
      data[key] = v === "true";
    } else {
      v = unquote(v);
      data[key] = v;
    }
  }
  return { data, body: raw.slice(m[0].length) };
}

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");


const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function render(body: string) {
  const toc: { id: string; text: string }[] = [];
  const md = new Marked({ gfm: true });
  md.use({
    renderer: {
      // Pas de HTML brut dans les articles : il est affiché tel quel, jamais interprété.
      html(token: Tokens.HTML | Tokens.Tag) {
        return escapeHtml(token.text);
      },
      heading(token: Tokens.Heading) {
        const text = this.parser.parseInline(token.tokens);
        const plain = token.text.replace(/[*_`]/g, "");
        if (token.depth === 1) return `<h2>${text}</h2>`; // le titre H1 est celui de la page
        const id = slugify(plain);
        if (token.depth === 2) toc.push({ id, text: plain });
        return `<h${token.depth} id="${id}">${text}</h${token.depth}>`;
      },
      link(token: Tokens.Link) {
        const text = this.parser.parseInline(token.tokens);
        const href = token.href.trim();
        if (/^(javascript|data|vbscript):/i.test(href)) return text;
        const external = /^https?:\/\//.test(href) && !href.startsWith("https://fdastudio.fr");
        return external
          ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${text}</a>`
          : `<a href="${escapeHtml(href)}">${text}</a>`;
      },
      image() {
        return ""; // pas d'image distante non maîtrisée
      },
      table(token: Tokens.Table) {
        const head = token.header.map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`).join("");
        const rows = token.rows.map((r) => `<tr>${r.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join("")}</tr>`).join("");
        return `<div class="table-scroll"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
      },
    },
  });
  const html = md.parse(frTypo(body), { async: false }) as string;
  return { html, toc };
}

let cache: Article[] | null = null;

/** Tous les articles publiés, du plus récent au plus ancien. */
export function getArticles(): Article[] {
  if (cache) return cache;
  let files: string[] = [];
  try {
    files = readdirSync(DIR).filter((f) => f.endsWith(".md"));
  } catch {
    files = [];
  }
  const all = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    if (!SLUG.test(slug)) throw new Error(`Nom de fichier invalide : ${file}`);
    const { data, body } = parseFrontMatter(readFileSync(join(DIR, file), "utf8"));
    const parsed = FrontMatter.safeParse(data);
    if (!parsed.success) throw new Error(`${file} : ${parsed.error.issues.map((i) => `${i.path.join(".")} ${i.message}`).join(" ; ")}`);
    const { html, toc } = render(body);
    const words = body.split(/\s+/).filter(Boolean).length;
    const fm = { ...parsed.data, title: frTypo(parsed.data.title), description: frTypo(parsed.data.description) };
    return { ...fm, slug, html, toc, readingMinutes: Math.max(1, Math.round(words / 220)) };
  });
  cache = all.filter((a) => !a.draft).sort((a, b) => b.date.localeCompare(a.date));
  return cache;
}

export const articleBySlug = (slug: string) => getArticles().find((a) => a.slug === slug);

export const formatDate = (ymd: string) =>
  new Date(`${ymd}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });
