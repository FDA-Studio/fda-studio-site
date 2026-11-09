import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { getArticles } from "@/lib/articles";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...services.map((s) => ({ url: `${site.url}/${s.slug}/`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: `${site.url}/ressources/`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...getArticles().map((a) => ({ url: `${site.url}/ressources/${a.slug}/`, lastModified: new Date(`${a.updated ?? a.date}T12:00:00Z`), changeFrequency: "monthly" as const, priority: 0.6 })),
    { url: `${site.url}/gaming/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/confidentialite/`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
