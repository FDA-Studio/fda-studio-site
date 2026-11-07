/**
 * Portfolio FDA Studio.
 *
 * Pour ajouter un projet : ajouter un objet à ce tableau. La page /work, la page détail
 * /work/<slug>, le sitemap et la vitrine de la homepage se mettent à jour automatiquement.
 *
 * Règle : aucun client, chiffre ou résultat inventé. Les concepts et démonstrateurs
 * internes sont signalés par `nature: "concept"` et affichés comme tels.
 */
export type ProjectCategory = "web" | "ia" | "applications" | "gaming";
export type CoverVariant = "doors" | "browser" | "holding" | "sculpture" | "agent" | "cockpit";

export type Project = {
  slug: string;
  title: string;
  owner: string;
  categories: ProjectCategory[];
  nature: "production" | "en-cours" | "concept";
  status: string;
  year: string;
  summary: string;
  context: string;
  work: string[];
  tags: string[];
  cover: CoverVariant;
  /** Visuel réel (capture ou image officielle). Prioritaire sur la couverture générée. */
  image?: { src: string; alt: string; width: number; height: number; position?: string };
  link?: { href: string; label: string };
  featured?: boolean;
};

export const categoryLabels: Record<ProjectCategory, string> = {
  web: "Web",
  ia: "Intelligence artificielle",
  applications: "Applications",
  gaming: "Gaming",
};

export const natureLabels: Record<Project["nature"], string> = {
  production: "En ligne",
  "en-cours": "En développement",
  concept: "Démonstrateur interne",
};

export const projects: Project[] = [
  {
    slug: "door-knight",
    title: "Door Knight 2.0",
    owner: "Produit propriétaire FDA Studio",
    categories: ["gaming", "applications"],
    nature: "en-cours",
    status: "En développement, version jouable en bêta TestFlight",
    year: "2026",
    summary: "Un jeu d'action 3D pour mobile : chaque porte cache une horde, un boss ou le gardien d'un monde.",
    context:
      "Door Knight est notre premier univers de jeu. La version 2.0 est entièrement reconstruite en 3D sur un nouveau moteur, pour iPhone, iPad et Android. Dix mondes, dix zones par monde, dix portes par zone : mille portes à franchir.",
    work: [
      "Game design : structure en mondes, zones et portes, boss de zone et gardiens de monde",
      "Quatre classes jouables (Chevalier, Archer, Mage, Samouraï) avec chacune une capacité signature",
      "Butin par rareté, forge d'équipement et camp de ressources qui produit même jeu fermé",
      "Guildes, objectif hebdomadaire et classement mondial",
      "Sauvegarde en ligne unique, partagée entre les appareils",
    ],
    tags: ["Jeu mobile 3D", "iOS", "Android", "Multijoueur", "Free-to-play"],
    cover: "doors",
    image: { src: "https://doorknight.games/img/v3/w/w01.webp", alt: "Capture réelle de Door Knight 2.0", width: 1920, height: 864 },
    link: { href: "https://doorknight.games", label: "doorknight.games" },
    featured: true,
  },
  {
    slug: "fda-studio",
    title: "FDA Studio",
    owner: "Site de la marque FDA Studio",
    categories: ["web"],
    nature: "en-cours",
    status: "Le site que vous parcourez",
    year: "2026",
    summary: "Notre propre démonstrateur : sculpture WebGL temps réel, design system sur mesure et démonstrations interactives.",
    context:
      "Plutôt que de décrire notre savoir-faire, ce site le montre. Chaque section est une preuve : la sculpture du hero est calculée en direct par votre navigateur, les démonstrations IA et produit sont des composants réels, et la performance est mesurée sur votre propre visite.",
    work: [
      "Direction artistique et design system FDA Studio",
      "Sculpture 3D générative en WebGL, shader écrit sur mesure, adaptée aux mobiles",
      "Démonstrateurs interactifs : agent IA, produit numérique, univers de jeu",
      "Export statique, aucun traceur, respect de prefers-reduced-motion",
      "SEO technique : données structurées, sitemap, métadonnées par page",
    ],
    tags: ["Next.js", "WebGL", "Three.js", "Design system", "SEO"],
    cover: "sculpture",
    image: { src: "/work/fda-studio.webp", alt: "Page d’accueil de fdastudio.fr avec la sculpture 3D temps réel", width: 1200, height: 840, position: "top" },
    link: { href: "/", label: "Retour à l'accueil" },
    featured: true,
  },
  {
    slug: "fda-holding",
    title: "Groupe FDA",
    owner: "Site corporate du groupe FDA",
    categories: ["web"],
    nature: "production",
    status: "Site corporate",
    year: "2026",
    summary: "Le site du groupe qui réunit FDA Studio et les autres activités de FDA Holding.",
    context:
      "Un groupe aux métiers variés a besoin d'une présentation claire : qui le dirige, quelles sont ses sociétés et comment les contacter. Le site présente chaque activité sans diluer l'identité du groupe.",
    work: [
      "Architecture de l'information multi-activités",
      "Identité visuelle cohérente avec les marques du groupe",
      "Site statique rapide, référencement et métadonnées",
      "Hébergement et déploiement automatisés",
    ],
    tags: ["Site corporate", "SEO", "Déploiement continu"],
    cover: "holding",
    image: { src: "/work/fda-holding.webp", alt: "Page d’accueil du site fdaholding.fr", width: 1200, height: 840, position: "top" },
    link: { href: "https://fdaholding.fr", label: "fdaholding.fr" },
  },
  {
    slug: "doorknight-games",
    title: "doorknight.games",
    owner: "Site officiel du jeu Door Knight",
    categories: ["web", "gaming"],
    nature: "production",
    status: "Site officiel",
    year: "2026",
    summary: "La vitrine de Door Knight : l'univers, les classes, la feuille de route et l'accès à la bêta.",
    context:
      "Le site d'un jeu doit donner envie en quelques secondes et préparer la communauté au lancement. Il présente les mondes, les classes et les systèmes du jeu, et oriente les joueurs vers la bêta et le Discord.",
    work: [
      "Direction artistique alignée sur l'univers du jeu",
      "Présentation des mondes, classes et systèmes",
      "Parcours vers la bêta TestFlight et la communauté",
      "Optimisation mobile et référencement",
    ],
    tags: ["Site de jeu", "Communauté", "Mobile first"],
    cover: "browser",
    image: { src: "/work/doorknight-games.webp", alt: "Page d’accueil du site doorknight.games", width: 1200, height: 840, position: "top" },
    link: { href: "https://doorknight.games", label: "doorknight.games" },
  },
  {
    slug: "agent-qualification",
    title: "Agent de qualification",
    owner: "Démonstrateur interne FDA Studio",
    categories: ["ia"],
    nature: "concept",
    status: "Démonstrateur, scénarios simulés",
    year: "2026",
    summary: "Un agent qui lit une demande entrante, en extrait l'essentiel et prépare les actions dans le CRM, avec validation humaine.",
    context:
      "Ce démonstrateur illustre la façon dont nous concevons un agent IA d'entreprise : un périmètre précis, des données extraites et structurées, des actions préparées et un humain qui valide. La démonstration de la page d'accueil est scénarisée : elle n'appelle aucun modèle et ne traite aucune donnée réelle.",
    work: [
      "Modélisation des scénarios : demande de devis, appel manqué, relance",
      "Extraction structurée : intention, entités, urgence",
      "Actions préparées : fiche CRM, brouillon de réponse, rendez-vous",
      "Point de validation humaine avant toute action visible du client",
    ],
    tags: ["Agent IA", "CRM", "Human in the loop", "Concept"],
    cover: "agent",
    link: { href: "/#demo-ia", label: "Voir la démonstration" },
    featured: true,
  },
  {
    slug: "cockpit",
    title: "Cockpit opérationnel",
    owner: "Concept interne FDA Studio",
    categories: ["applications"],
    nature: "concept",
    status: "Concept d'interface, données fictives",
    year: "2026",
    summary: "Un tableau de bord et son application mobile pour piloter l'activité d'une PME en temps réel.",
    context:
      "Concept d'interface qui illustre notre approche produit : un tableau de bord pour la direction, une application mobile pour le terrain, un back-office pour l'administration. Toutes les données affichées sont fictives.",
    work: [
      "Parcours utilisateurs par rôle : direction, terrain, administration",
      "Design system d'application et composants de données",
      "Prototype interactif web et mobile",
    ],
    tags: ["Dashboard", "Application mobile", "SaaS", "Concept"],
    cover: "cockpit",
    link: { href: "/#demo-produit", label: "Voir le concept" },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
