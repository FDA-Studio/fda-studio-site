/**
 * Configuration centrale du site.
 * Toute information de contact ou légale se modifie ici.
 */
export const site = {
  name: "FDA Studio",
  legalName: "FDA Studio", // TODO(FDA) : raison sociale exacte à confirmer
  url: "https://fdastudio.fr",
  locale: "fr_FR",
  email: "contact@fdastudio.fr",
  region: "Touraine, France",
  group: { name: "Groupe FDA", url: "https://fdaholding.fr" },
  tagline: "We build what's next.",
  description:
    "FDA Studio conçoit des sites internet premium, intègre l'intelligence artificielle dans les entreprises, développe des applications web et mobiles et crée des jeux vidéo. Studio technologique du groupe FDA.",
  /**
   * Point d'envoi du formulaire de contact (fonction serveur, voir /supabase/functions/contact).
   * Tant qu'il n'est pas configuré, le formulaire prépare un e-mail complet dans le client de messagerie.
   */
  contactEndpoint: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "",
} as const;

/** Préfixe d'URL des fichiers statiques (voir next.config.ts). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (path: string) => `${basePath}${path}`;

export const nav = [
  { href: "/services/", label: "Expertises" },
  { href: "/work/", label: "Réalisations" },
  { href: "/gaming/", label: "Gaming" },
  { href: "/about/", label: "Studio" },
] as const;

export const externalLinks = {
  doorknight: "https://doorknight.games",
} as const;
