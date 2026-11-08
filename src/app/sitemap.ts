import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/gaming/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/confidentialite/`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
