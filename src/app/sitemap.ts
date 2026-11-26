import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { localPages } from "@/lib/local-pages";
import { getArticles } from "@/lib/articles";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // lastmod : seule une date réelle est utile aux moteurs. Les articles ont la leur ; la page
  // Ressources prend celle du dernier article ; les autres pages n'en déclarent pas (avant : la date
  // du build, qui changeait à chaque mise en ligne sans que la page change).
  const articles = getArticles();
  const lastArticle = articles
    .map((a) => new Date(`${a.updated ?? a.date}T12:00:00Z`))
    .reduce<Date | undefined>((max, d) => (!max || d > max ? d : max), undefined);
  return [
    { url: `${site.url}/`, changeFrequency: "monthly", priority: 1 },
    ...services.map((s) => ({ url: `${site.url}/${s.slug}/`, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...localPages.map((p) => ({ url: `${site.url}/${p.slug}/`, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${site.url}/ressources/`, ...(lastArticle ? { lastModified: lastArticle } : {}), changeFrequency: "weekly", priority: 0.7 },
    ...articles.map((a) => ({ url: `${site.url}/ressources/${a.slug}/`, lastModified: new Date(`${a.updated ?? a.date}T12:00:00Z`), changeFrequency: "monthly" as const, priority: 0.6, ...(a.images.length ? { images: a.images.map((i) => `${site.url}${i.src}`) } : {}) })),
    { url: `${site.url}/gaming/`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/a-propos/`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/rendez-vous/`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/confidentialite/`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
