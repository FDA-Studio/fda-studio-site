/**
 * Configuration centrale du site.
 * Toute information de contact ou légale se modifie ici.
 */
export const site = {
  name: "FDA Studio",
  /**
   * Société éditrice : FDA Studio, société à part entière depuis le 23/11/2026 (Kbis).
   */
  company: {
    name: "FDA Studio",
    form: "Société par actions simplifiée à associé unique",
    capital: "1 000 €",
    address: "La Bonde, 37230 Fondettes, France",
    rcs: "RCS Tours 133 185 223",
    /** Numéro SIREN, déclaré aux moteurs (identifier) pour relier le studio aux registres officiels. */
    siren: "133185223",
    siret: "133 185 223 00012",
    euid: "FR3701.133185223",
    /** Numéro de TVA intracommunautaire : vide tant qu'il n'est pas confirmé par l'administration (rien n'est alors affiché ni déclaré). */
    vat: "FR71133185223",
    director: "Antoine Donabella",
  },
  url: "https://fdastudio.fr",
  locale: "fr_FR",
  email: "contact@fdastudio.fr",
  /**
   * Téléphone affiché (format lisible) et lien tel: (format international). Vide : rien n'est affiché
   * et rien n'est déclaré aux moteurs de recherche. À renseigner avec le numéro de la fiche Google.
   */
  phone: { display: "06 67 16 53 29", e164: "+33667165329" },
  /** Profils officiels, déclarés aux moteurs de recherche (sameAs). LinkedIn et Instagram. */
  socials: ["https://www.linkedin.com/company/fda-studio-fr/", "https://www.instagram.com/fda_studio_fr/", "https://www.facebook.com/profile.php?id=61596476086147"] as string[],
  /**
   * Fiches du studio dans les annuaires d'agences, déclarées aux moteurs (sameAs) et affichées sur
   * /a-propos/. Ce sont les sources que citent ChatGPT et le mode IA de Google sur FDA Studio (relevé du 20/11/2026).
   */
  directories: [
    { name: "Sortlist", url: "https://www.sortlist.fr/agency/fda-studio" },
    { name: "La Fabrique du Net", url: "https://www.lafabriquedunet.fr/agences/agence/fda-studio" },
  ] as { name: string; url: string }[],
  /** Auteur des articles de la rubrique Ressources (affiché et déclaré en données structurées). */
  author: { name: "Antoine Donabella", jobTitle: "Fondateur et dirigeant de FDA Studio" },
  /** Année de création du studio, telle que déclarée sur les fiches (décision d'Antoine, nov. 2026). */
  founded: "2026",
  /**
   * Désambiguïsation pour les moteurs et les assistants IA : une recherche « FDA Studio » renvoie
   * surtout le studio vidéo de la FDA américaine. Reprise dans le JSON-LD, /llms.txt et /a-propos/.
   */
  disambiguation:
    "FDA Studio est une agence web et IA française, basée à Fondettes près de Tours. Elle n’a aucun lien avec la Food and Drug Administration (FDA), l’agence fédérale américaine des médicaments et de l’alimentation.",
  region: "Touraine, France",
  // Seule mention du groupe, dans la fiche d'identité de /a-propos/ (souhait d'Antoine, 24 nov. 2026).
  group: { name: "Groupe FDA" },
  tagline: "We build what's next.",
  description:
    "Agence web et IA près de Tours : création de sites internet, identité visuelle et logos, intelligence artificielle, applications mobiles et jeux vidéo, partout en France.",
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
  /** Prise de rendez-vous (/rendez-vous/) : créneaux et réservation lus en direct dans le CRM. */
  bookingEndpoint:
    process.env.NEXT_PUBLIC_BOOKING_ENDPOINT ||
    (process.env.NODE_ENV === "production" ? "https://app.fdastudio.fr/api/public/booking" : ""),
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
