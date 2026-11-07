import type { MetadataRoute } from "next";
import { services } from "@/lib/services";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths: [string, number][] = [
    ["/", 1],
    ["/services/", 0.9],
    ...services.map((s) => [`/services/${s.slug}/`, 0.9] as [string, number]),
    ["/work/", 0.8],
    ...projects.map((p) => [`/work/${p.slug}/`, 0.6] as [string, number]),
    ["/gaming/", 0.7],
    ["/about/", 0.6],
    ["/contact/", 0.8],
    ["/confidentialite/", 0.2],
  ];
  return paths.map(([path, priority]) => ({ url: new URL(path, site.url).toString(), lastModified: now, changeFrequency: "monthly", priority }));
}
