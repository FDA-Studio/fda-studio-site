/**
 * Contenu officiel de Door Knight, repris du site doorknight.games (même société éditrice).
 * Les visuels sont servis depuis doorknight.games : toute mise à jour du site du jeu
 * se reflète ici automatiquement.
 */
const BASE = "https://doorknight.games";
export const dk = (path: string) => `${BASE}${path}`;

export const doorKnight = {
  url: BASE,
  wordmark: dk("/img/v2/wordmark-1200.webp"),
  emblem: dk("/img/v2/emblem.webp"),
  door: dk("/img/v2/door.webp"),
  og: dk("/img/og.jpg"),
  trailer: { src: dk("/vid/trailer.mp4"), title: "Vingt-cinq secondes dans la Forge Volcanique" },
  links: {
    discord: "https://discord.gg/GNWHbMUqP3",
    beta: dk("/guide/installer-la-beta-testflight.html"),
    news: dk("/nouveautes/"),
    instagram: "https://www.instagram.com/doorknight.games/",
    tiktok: "https://www.tiktok.com/@doorknight.games",
    youtube: "https://www.youtube.com/@doorknightgames",
  },
  // Descriptions limitées à ce que publie doorknight.games
  classes: [
    { name: "Chevalier", img: dk("/img/v3/h/knight-f-sm.webp"), text: "Corps à corps, bouclier levé. La plus solide des quatre. Sort : Frappe sismique." },
    { name: "Archer", img: dk("/img/v3/h/archer-f-sm.webp"), text: "À distance, elle fait pleuvoir ses flèches sur les hordes." },
    { name: "Mage", img: dk("/img/v3/h/mage-f-sm.webp"), text: "Sa Nova de givre frappe tout ce qui l’entoure." },
    { name: "Samouraï", img: dk("/img/v3/h/samurai-f-sm.webp"), text: "Comme chaque classe, une capacité signature qui lui est propre." },
  ],
  worlds: [
    "Forêt de Brume",
    "Grottes d’Écho",
    "Marais Putride",
    "Désert d’Ambre",
    "Pics Gelés",
    "Forge Volcanique",
    "Cité Engloutie",
    "Château Hanté",
    "Cieux d’Orage",
    "Antre du Dragon",
  ],
  worldArt: [
    { img: dk("/img/v3/w/w01.webp"), label: "Capture réelle de Door Knight 2.0" },
    { img: dk("/img/v3/w/w02-960.webp"), label: "Capture réelle de Door Knight 2.0" },
    { img: dk("/img/v3/w/w10-960.webp"), label: "Capture réelle de Door Knight 2.0" },
  ],
  shots: [
    { img: dk("/img/v3/s/combat-knight-800.webp"), alt: "Le Chevalier lance Frappe sismique dans les Grottes d’Écho" },
    { img: dk("/img/v3/s/combat-archer-800.webp"), alt: "L’Archère fait pleuvoir ses flèches sur le Marais Putride" },
    { img: dk("/img/v3/s/combat-mage-800.webp"), alt: "Le Mage déclenche une Nova de givre sur les Pics Gelés" },
    { img: dk("/img/v3/s/guardian-slime-800.webp"), alt: "Combat contre le Roi Gluant, gardien de la Forêt de Brume, à la porte 100" },
  ],
  ui: [
    { img: dk("/img/v3/s/ui-map-800.webp"), title: "Chaque porte annonce son butin", alt: "La carte du monde avec les zones, les portes et les chances de butin" },
    { img: dk("/img/v3/s/ui-camp-800.webp"), title: "Un campement qui travaille pour toi", alt: "Le campement : scierie, carrière, mine de cristal et forge" },
    { img: dk("/img/v3/s/ui-create-800.webp"), title: "Ton héros, ton pseudo", alt: "L’écran de création de personnage de Door Knight 2.0" },
    { img: dk("/img/v3/s/ui-victory-800.webp"), title: "Un butin qui se voit", alt: "L’écran de victoire avec l’objet gagné et les ressources" },
  ],
} as const;
