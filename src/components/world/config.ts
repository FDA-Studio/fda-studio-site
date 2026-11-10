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
  cta?: Cta;
}

/** Les six scènes du vol, dans l'ordre : chacune porte le texte affiché pendant son segment. */
export const WORLD_SECTIONS: WorldSection[] = [
  {
    id: "entree",
    label: "Entrée",
    accent: "#2f5bff",
    eyebrow: "Studio digital à Tours",
    title: "Sites, applications et agents IA.",
    body: "Dessinés, développés et branchés à vos outils par un seul studio, à Tours. De la première maquette à la mise en ligne.",
    tags: [],
  },
  {
    id: "sites",
    label: "Sites",
    accent: "#2f5bff",
    eyebrow: "Sites internet",
    title: "Un site qui donne envie de vous appeler.",
    body: "Vitrine, boutique en ligne ou page de lancement : dessiné pour votre marque, rapide sur mobile, construit pour être trouvé sur Google.",
    tags: ["Sur mesure", "Rapides", "Référencés"],
    copyAt: 0.72,
  },
  {
    id: "ia",
    label: "IA",
    accent: "#8fb4ff",
    eyebrow: "Intelligence artificielle",
    title: "Une IA qui travaille dans vos outils, pas à côté.",
    body: "Elle répond au téléphone, trie les demandes, lit vos factures et remplit votre CRM. Vous gardez la main sur chaque décision.",
    tags: ["Agents vocaux", "Assistants", "Automatisations"],
    copyAt: 0.72,
  },
  {
    id: "applications",
    label: "Applications",
    accent: "#2f5bff",
    eyebrow: "Applications",
    title: "Des applications que vos équipes ouvrent chaque matin.",
    body: "Applications web et mobiles, SaaS, tableaux de bord : conçus avec vos équipes, livrés jusqu’à la publication sur les stores.",
    tags: ["Web", "Mobile", "SaaS"],
    copyAt: 0.72,
  },
  {
    id: "jeux",
    label: "Gaming",
    accent: "#9a80ff",
    eyebrow: "Gaming",
    title: "Et derrière la porte, nos propres univers.",
    body: "Le studio crée aussi ses propres jeux. Door Knight, un jeu d’action 3D pour mobile et tablette, ouvre la voie.",
    tags: ["Door Knight", "Unity", "Mobile 3D"],
    copyAt: 0.72,
  },
  {
    id: "contact",
    label: "Contact",
    accent: "#2f5bff",
    eyebrow: "Parlons de votre projet",
    title: "Votre prochain projet commence par une conversation.",
    body: "Décrivez votre besoin en quelques lignes. Nous revenons vers vous avec une première proposition.",
    tags: [],
    cta: {
      primary: { label: "Démarrer un projet", href: "#contact" },
      secondary: { label: "Voir les démos IA", href: "#creations" },
    },
  },
];
