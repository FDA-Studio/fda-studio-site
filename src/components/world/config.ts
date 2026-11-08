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
  scroll?: number;
  linger?: number;
  /** Moment du segment (0..1) où le texte culmine : la scène apparaît dans la seconde moitié du vol. */
  copyAt?: number;
  cta?: Cta;
}

/** Les six scènes du vol, dans l'ordre : chacune porte le texte affiché pendant son segment. */
export const WORLD_SECTIONS: WorldSection[] = [
  {
    id: "entree",
    label: "Entrée",
    accent: "#2f5bff",
    eyebrow: "FDA Studio, à Tours",
    title: "Sites, applications et agents IA pour les entreprises.",
    body: "Un studio qui dessine, code et branche l’IA. Un seul interlocuteur, de la maquette à la mise en ligne.",
    tags: [],
    scroll: 1.7,
    linger: 0.35,
  },
  {
    id: "sites",
    label: "Sites",
    accent: "#2f5bff",
    eyebrow: "Sites internet",
    title: "Des sites qui tiennent la promesse de votre marque.",
    body: "Sites vitrines, e-commerce et pages de conversion. Dessinés sur mesure, rapides, bien référencés.",
    tags: ["Sur mesure", "Rapides", "Référencés"],
    copyAt: 0.72,
  },
  {
    id: "ia",
    label: "IA",
    accent: "#8fb4ff",
    eyebrow: "Intelligence artificielle",
    title: "Une IA qui travaille dans vos outils, pas à côté.",
    body: "Agents vocaux, assistants et automatisations branchés sur votre CRM et vos e-mails. Un humain garde la main.",
    tags: ["Agents vocaux", "Assistants", "Automatisations"],
    copyAt: 0.72,
  },
  {
    id: "applications",
    label: "Applications",
    accent: "#2f5bff",
    eyebrow: "Applications",
    title: "Des applications que vos équipes ouvrent chaque matin.",
    body: "Applications web, iOS et Android, SaaS et tableaux de bord, de la maquette à la publication sur les stores.",
    tags: ["Web", "iOS et Android", "SaaS"],
    copyAt: 0.72,
  },
  {
    id: "jeux",
    label: "Gaming",
    accent: "#9a80ff",
    eyebrow: "Gaming",
    title: "Et derrière la porte, nos propres univers.",
    body: "Le studio développe aussi ses jeux. Door Knight, un jeu d’action 3D pour iPhone, iPad et Android, est le premier.",
    tags: ["Door Knight", "Unity", "Mobile 3D"],
    copyAt: 0.72,
  },
  {
    id: "contact",
    label: "Contact",
    accent: "#2f5bff",
    eyebrow: "Parlons de votre projet",
    title: "Votre prochain produit commence ici.",
    body: "Décrivez votre besoin en quelques lignes : nous revenons vers vous avec une première proposition.",
    tags: [],
    scroll: 1.8,
    cta: {
      primary: { label: "Démarrer un projet", href: "#contact" },
      secondary: { label: "Voir les démos IA", href: "#creations" },
    },
  },
];
