import { existsSync, readdirSync, readFileSync } from "node:fs";
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
  /** Le premier mot-clé est le mot-clé principal : il doit être unique sur tout le site (anti-doublon). */
  keywords: z.array(z.string().min(2)).min(1).max(12),
  draft: z.boolean().default(false),
});

export type Article = z.infer<typeof FrontMatter> & {
  slug: string;
  html: string;
  toc: { id: string; text: string }[];
  readingMinutes: number;
  /** Images de l'article, dans l'ordre : pour le plan du site (Google Images) et les données structurées. */
  images: ArticleImage[];
};

export type ArticleImage = { src: string; alt: string; width: number; height: number };

/** Seules les images du site, rangées dans /media/, sont acceptées dans un article. */
const LOCAL_IMAGE = /^\/media\/[a-z0-9/-]+\.(webp|png|jpe?g)$/;

/**
 * Largeur et hauteur d'une image du dossier public, lues dans son en-tête (WebP, PNG, JPEG).
 * Elles évitent le décalage de mise en page pendant le chargement. Le build échoue si l'image manque.
 */
function imageSize(src: string): { width: number; height: number } {
  const file = join(process.cwd(), "public", src);
  if (!existsSync(file)) throw new Error(`Image introuvable dans public : ${src}`);
  const b = readFileSync(file);
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const kind = b.toString("ascii", 12, 16);
    if (kind === "VP8X") return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    if (kind === "VP8L") {
      const bits = b.readUInt32LE(21);
      return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
    }
    return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  }
  if (b.readUInt32BE(0) === 0x89504e47) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  for (let i = 2; i < b.length - 9; ) {
    if (b[i] !== 0xff) { i++; continue; }
    const marker = b[i + 1];
    if (marker >= 0xc0 && marker <= 0xc3) return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error(`Dimensions illisibles : ${src}`);
}

/**
 * Texte Markdown d'un article publié, sans son en-tête (utilisé par /llms-full.txt). Lu à part,
 * et non ajouté aux objets Article, pour ne jamais alourdir les données passées aux pages.
 */
export function articleMarkdown(slug: string): string {
  if (!SLUG.test(slug)) throw new Error(`Slug invalide : ${slug}`);
  return parseFrontMatter(readFileSync(join(DIR, `${slug}.md`), "utf8")).body.trim();
}

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
  const images: ArticleImage[] = [];
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
      // Image du site uniquement (/media/…), avec texte alternatif obligatoire ; le titre Markdown
      // devient la légende. Jamais d'image distante non maîtrisée.
      image(token: Tokens.Image) {
        const src = token.href.trim();
        const alt = token.text.trim();
        if (!LOCAL_IMAGE.test(src)) return "";
        if (alt.length < 10) throw new Error(`Image sans texte alternatif utile : ${src}`);
        const { width, height } = imageSize(src);
        images.push({ src, alt, width, height });
        const lazy = images.length > 1 ? ' loading="lazy"' : "";
        const caption = token.title ? `<figcaption>${escapeHtml(token.title)}</figcaption>` : "";
        const cls = height > width ? "article-figure article-figure--portrait" : "article-figure";
        return `<figure class="${cls}"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" width="${width}" height="${height}" decoding="async"${lazy} />${caption}</figure>`;
      },
      table(token: Tokens.Table) {
        const head = token.header.map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`).join("");
        const rows = token.rows.map((r) => `<tr>${r.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join("")}</tr>`).join("");
        return `<div class="table-scroll"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
      },
    },
  });
  const html = md.parse(frTypo(body), { async: false }) as string;
  return { html, toc, images };
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
    const { html, toc, images } = render(body);
    const words = body.split(/\s+/).filter(Boolean).length;
    const fm = { ...parsed.data, title: frTypo(parsed.data.title), description: frTypo(parsed.data.description) };
    return { ...fm, slug, html, toc, images, readingMinutes: Math.max(1, Math.round(words / 220)) };
  });
  assertNoDuplicates(all);
  cache = all.filter((a) => !a.draft).sort((a, b) => b.date.localeCompare(a.date));
  return cache;
}

/** Texte comparable : minuscules, sans accents ni ponctuation, espaces simples. */
const norm = (t: string) =>
  t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const STOP = new Set(["le", "la", "les", "un", "une", "des", "de", "du", "d", "l", "et", "ou", "en", "a", "au", "aux", "pour", "par", "sur", "dans", "avec", "votre", "vos", "son", "sa", "ses", "ce", "que", "qui", "quoi", "est", "il", "elle", "on", "ne", "pas", "plus", "faut", "comment", "quel", "quelle", "quels", "quelles"]);
const words = (t: string) => new Set(norm(t).split(" ").filter((w) => w.length > 1 && !STOP.has(w) && !/^\d+$/.test(w)));

/**
 * Anti-doublon, vérifié à chaque build (donc avant toute publication automatique) :
 * deux articles ne peuvent pas viser le même mot-clé principal, ni porter le même titre
 * ou un titre presque identique (au moins 75 % de mots significatifs en commun).
 * Le build échoue avec un message clair : l'agent SEO ne peut alors pas fusionner.
 */
function assertNoDuplicates(list: { slug: string; title: string; keywords: string[] }[]) {
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i], b = list[j];
      const why =
        norm(a.keywords[0]) === norm(b.keywords[0]) ? `même mot-clé principal « ${a.keywords[0]} »`
        : norm(a.title) === norm(b.title) ? "même titre"
        : (() => {
            const wa = words(a.title), wb = words(b.title);
            const inter = [...wa].filter((w) => wb.has(w)).length;
            const union = new Set([...wa, ...wb]).size || 1;
            return inter / union >= 0.75 ? `titres presque identiques (${Math.round((100 * inter) / union)} % de mots communs)` : "";
          })();
      if (why) throw new Error(`Article en doublon : ${a.slug}.md et ${b.slug}.md (${why}). Choisir un autre sujet ou un autre angle.`);
    }
  }
}

export const articleBySlug = (slug: string) => getArticles().find((a) => a.slug === slug);

export const formatDate = (ymd: string) =>
  new Date(`${ymd}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });
