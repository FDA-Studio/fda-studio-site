import type { Metadata } from "next";
import { site } from "./site";
import { services } from "./services";

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
  // Titre de partage : le nom du studio n'est ajouté que s'il n'y figure pas déjà
  // (évite « … | FDA Studio | FDA Studio » sur LinkedIn, Facebook ou WhatsApp).
  const shareTitle = title.includes(site.name) ? title : `${title} | ${site.name}`;
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
      title: shareTitle,
      description,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "FDA Studio" }],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: ["/og-image.png"],
    },
  };
}

/**
 * L'entreprise pour les moteurs de recherche : ProfessionalService (sous-type de LocalBusiness),
 * pour apparaître dans les recherches locales (« agence web Tours ») et nationales.
 */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${site.url}/#organization`,
  name: site.name,
  alternateName: "FDA Studio Tours",
  legalName: site.company.name,
  url: site.url,
  logo: `${site.url}/icon-512.png`,
  image: `${site.url}/og-image.png`,
  email: site.email,
  description: site.description,
  slogan: site.tagline,
  address: {
    "@type": "PostalAddress",
    streetAddress: "La Bonde",
    postalCode: "37230",
    addressLocality: "Fondettes",
    addressRegion: "Centre-Val de Loire",
    addressCountry: "FR",
  },
  // Emplacement exact de La Bonde, identique aux fiches Apple Plans et Google (décision d'Antoine, 17/11/2026)
  geo: { "@type": "GeoCoordinates", latitude: 47.3916, longitude: 0.6309 },
  vatID: site.company.vat,
  parentOrganization: { "@type": "Organization", name: site.group.name },
  areaServed: [
    { "@type": "City", name: "Tours" },
    { "@type": "City", name: "Fondettes" },
    { "@type": "City", name: "Joué-lès-Tours" },
    { "@type": "City", name: "Saint-Cyr-sur-Loire" },
    { "@type": "City", name: "Chambray-lès-Tours" },
    { "@type": "City", name: "Amboise" },
    { "@type": "AdministrativeArea", name: "Indre-et-Loire" },
    { "@type": "AdministrativeArea", name: "Centre-Val de Loire" },
    // Villes visées par les pages locales /agence-web-orleans/ et /agence-web-le-mans/
    { "@type": "City", name: "Orléans" },
    { "@type": "AdministrativeArea", name: "Loiret" },
    { "@type": "City", name: "Le Mans" },
    { "@type": "AdministrativeArea", name: "Sarthe" },
    { "@type": "Country", name: "France" },
  ],
  knowsAbout: [
    "Création de sites internet",
    "Développement web",
    "Référencement naturel (SEO)",
    "Intégration de l'intelligence artificielle",
    "Agents vocaux IA",
    "Chatbots",
    "Automatisation des processus",
    "Développement d'applications mobiles",
    "CRM sur mesure",
    "Sécurité des sites internet et des applications",
    "Développement de jeux vidéo",
  ],
  makesOffer: services.map((s) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: s.name, url: `${site.url}/${s.slug}/` },
  })),
  founder: { "@id": `${site.url}/#author` },
  sameAs: ["https://doorknight.games", ...site.socials],
  ...(site.phone.e164 ? { telephone: site.phone.e164 } : {}),
};

/** L'auteur des articles : une personne identifiée, rattachée au studio. */
export const authorJsonLd = {
  "@type": "Person",
  "@id": `${site.url}/#author`,
  name: site.author.name,
  jobTitle: site.author.jobTitle,
  worksFor: { "@id": `${site.url}/#organization` },
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
