/**
 * Configuration centrale du site.
 * Toute information de contact ou légale se modifie ici.
 */
export const site = {
  name: "FDA Studio",
  /** Société éditrice : FDA Studio est un nom commercial de la société FDA (groupe FDA). */
  company: {
    name: "FDA",
    form: "Société à responsabilité limitée à associé unique",
    capital: "10 000 €",
    address: "La Bonde, 37230 Fondettes, France",
    rcs: "RCS Tours 889 822 300",
    euid: "FR3701.889822300",
    vat: "FR43889822300",
    director: "Antoine Donabella, gérant",
  },
  url: "https://fdastudio.fr",
  locale: "fr_FR",
  email: "contact@fdastudio.fr",
  region: "Touraine, France",
  group: { name: "Groupe FDA", url: "https://fdaholding.fr" },
  tagline: "We build what's next.",
  description:
    "Agence web et IA près de Tours : création de sites internet, intégration de l'intelligence artificielle, applications mobiles et jeux vidéo, partout en France.",
  /**
   * Point d'envoi du formulaire de contact (fonction serveur, voir /supabase/functions/contact).
   * Tant qu'il n'est pas configuré, le formulaire prépare un e-mail complet dans le client de messagerie.
   */
  contactEndpoint: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "",
} as const;

/** Préfixe d'URL des fichiers statiques (voir next.config.ts). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (path: string) => `${basePath}${path}`;

/** Navigation : ancres de l'accueil, plus la page Gaming. */
export const nav: { id: string; label: string; page?: string }[] = [
  { id: "expertises", label: "Expertises" },
  { id: "creations", label: "Démos IA" },
  { id: "experience", label: "Studio 3D", page: "/experience/" },
  { id: "gaming", label: "Gaming", page: "/gaming/" },
  { id: "contact", label: "Contact" },
];

export const externalLinks = {
  doorknight: "https://doorknight.games",
} as const;
