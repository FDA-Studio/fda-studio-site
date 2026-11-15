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
  /**
   * Téléphone affiché (format lisible) et lien tel: (format international). Vide : rien n'est affiché
   * et rien n'est déclaré aux moteurs de recherche. À renseigner avec le numéro de la fiche Google.
   */
  phone: { display: "", e164: "" },
  /** Profils officiels, déclarés aux moteurs de recherche (sameAs). Ajouter LinkedIn dès qu'il existe. */
  socials: ["https://www.instagram.com/fda_studio_fr/"] as string[],
  /** Auteur des articles de la rubrique Ressources (affiché et déclaré en données structurées). */
  author: { name: "Antoine Donabella", jobTitle: "Gérant de FDA Studio" },
  region: "Touraine, France",
  group: { name: "Groupe FDA", url: "https://fdaholding.fr" },
  tagline: "We build what's next.",
  description:
    "Agence web et IA près de Tours : création de sites internet, intégration de l'intelligence artificielle, applications mobiles et jeux vidéo, partout en France.",
  /**
   * Point d'envoi du formulaire de contact : les demandes arrivent dans l'outil interne FDA Studio
   * (app.fdastudio.fr, dépôt fda-studio-internal), qui n'accepte que l'origine fdastudio.fr.
   * Surchargeable par la variable de dépôt NEXT_PUBLIC_CONTACT_ENDPOINT. En développement, sans
   * variable, le formulaire prépare un e-mail complet dans le client de messagerie.
   */
  contactEndpoint:
    process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ||
    (process.env.NODE_ENV === "production" ? "https://app.fdastudio.fr/api/public/leads" : ""),
  /**
   * Clé publique du captcha Cloudflare Turnstile (widget « fdastudio.fr », domaines fdastudio.fr et
   * www.fdastudio.fr), surchargeable par NEXT_PUBLIC_TURNSTILE_SITE_KEY. Vide : pas de captcha. La vérification se fait côté serveur, dans l'outil interne.
   */
  turnstileSiteKey:
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
    (process.env.NODE_ENV === "production" ? "0x4AAAAAAF7gr2st8ri8mRN3" : ""),
  /** Démo vocale « Parler à Emma » : session signée délivrée par l'outil interne (quotas côté serveur). */
  voiceDemoEndpoint:
    process.env.NEXT_PUBLIC_VOICE_DEMO_ENDPOINT ||
    (process.env.NODE_ENV === "production" ? "https://app.fdastudio.fr/api/public/voice-demo" : ""),
  /** « Emma, par écrit » : session de chat signée délivrée par l'outil interne (quotas côté serveur). */
  chatEndpoint:
    process.env.NEXT_PUBLIC_CHAT_ENDPOINT ||
    (process.env.NODE_ENV === "production" ? "https://app.fdastudio.fr/api/public/chat-demo" : ""),
} as const;

/** Préfixe d'URL des fichiers statiques (voir next.config.ts). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (path: string) => `${basePath}${path}`;

/** Navigation : ancres de l'accueil, plus la page Gaming. */
export const nav: { id: string; label: string; page?: string }[] = [
  { id: "expertises", label: "Expertises" },
  { id: "creations", label: "Démos IA" },
  { id: "gaming", label: "Gaming", page: "/gaming/" },
  { id: "contact", label: "Contact" },
];

export const externalLinks = {
  doorknight: "https://doorknight.games",
} as const;
