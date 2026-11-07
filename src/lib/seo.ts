import type { Metadata } from "next";
import { site } from "./site";

/** Métadonnées d'une page : titre, description, canonique et Open Graph cohérents. */
export function pageMeta({
  title,
  description,
  path,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = new URL(path, site.url).toString();
  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: site.locale,
      url,
      siteName: site.name,
      title: `${title} | ${site.name}`,
      description,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "FDA Studio" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: ["/og-image.png"],
    },
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: site.url,
  logo: `${site.url}/icon-512.png`,
  email: site.email,
  description: site.description,
  parentOrganization: { "@type": "Organization", name: site.group.name, url: site.group.url },
  areaServed: "FR",
  knowsAbout: [
    "Création de sites internet",
    "Développement web",
    "Intégration de l'intelligence artificielle",
    "Automatisation des processus",
    "Développement d'applications mobiles",
    "Développement de jeux vidéo",
  ],
};

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: new URL(it.path, site.url).toString(),
    })),
  };
}
