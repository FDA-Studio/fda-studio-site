import { asset } from "@/lib/site";

export const worldAsset = (file: string) => asset(`/world/${file}`);

type Cta = { primary: { label: string; href: string }; secondary?: { label: string; href: string } };

export interface WorldSection {
  id: string;
  label: string;
  accent: string;
  eyebrow: string;
  title: string;
  body: string;
  tags: string[];
  /** Moment du segment (0..1) où le texte culmine : la scène apparaît dans la seconde moitié du vol. */
  copyAt?: number;
  /** Lien affiché sous le titre, vers la page du service. */
  link?: { label: string; href: string };
  cta?: Cta;
}

/**
 * Les six scènes du vol, dans l'ordre. Chaque scène affiche un titre court et, pour les services,
 * un lien vers la page du service : l'image fait le travail, le détail est sur la page liée.
 */
export const WORLD_SECTIONS: WorldSection[] = [
  {
    id: "entree",
    label: "Entrée",
    accent: "#2f5bff",
    eyebrow: "Agence web et IA à Tours",
    title: "Sites, applications, agents IA.",
    body: "",
    tags: [],
  },
  {
    id: "sites",
    label: "Sites",
    accent: "#2f5bff",
    eyebrow: "Sites internet",
    title: "Un site qui donne envie d’appeler.",
    body: "",
    tags: [],
    link: { label: "Création de site internet", href: "/creation-site-internet-tours/" },
    copyAt: 0.72,
  },
  {
    id: "ia",
    label: "IA",
    accent: "#8fb4ff",
    eyebrow: "Intelligence artificielle",
    title: "Une IA dans vos outils.",
    body: "",
    tags: [],
    link: { label: "Agence IA", href: "/agence-ia-tours/" },
    copyAt: 0.72,
  },
  {
    id: "applications",
    label: "Applications",
    accent: "#2f5bff",
    eyebrow: "Applications",
    title: "Des applications ouvertes chaque matin.",
    body: "",
    tags: [],
    link: { label: "Applications", href: "/developpement-application-tours/" },
    copyAt: 0.72,
  },
  {
    id: "jeux",
    label: "Gaming",
    accent: "#9a80ff",
    eyebrow: "Gaming",
    title: "Derrière la porte, nos univers.",
    body: "",
    tags: [],
    link: { label: "Gaming", href: "/gaming/" },
    copyAt: 0.72,
  },
  {
    id: "contact",
    label: "Contact",
    accent: "#2f5bff",
    eyebrow: "Parlons de votre projet",
    title: "Tout commence par une conversation.",
    body: "",
    tags: [],
    cta: {
      primary: { label: "Démarrer un projet", href: "#contact" },
      secondary: { label: "Voir les démos IA", href: "#creations" },
    },
  },
];
