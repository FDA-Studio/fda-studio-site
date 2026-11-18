import type { Service } from "./services";

/**
 * Pages locales : une page par ville (Orléans, Le Mans) et une page par métier de client
 * (Tours, Orléans, Le Mans). Même gabarit que les pages de service, contenu propre à chaque
 * public : jamais une copie où seule la ville change. Contenu factuel uniquement : aucun client,
 * chiffre, délai ou prix inventé. Tours est déjà couvert par les trois pages de service.
 */

const CITIES = ["Tours", "Orléans", "Le Mans"];

const SHARED_STEPS: Service["steps"] = [
  { title: "Échange", text: "Un premier rendez-vous, sur place ou en visio, pour comprendre votre activité, vos clients et ce qui vous fait perdre du temps." },
  { title: "Proposition", text: "Un devis détaillé et gratuit, avec ce qui sera fait, comment et dans quel ordre." },
  { title: "Réalisation", text: "Maquettes validées avant le développement, puis construction et tests sur mobile, tablette et ordinateur." },
  { title: "Mise en service", text: "Branchement de vos outils, réglages, vérifications, et une prise en main simple pour vous et votre équipe." },
  { title: "Suivi", text: "Ajustements, évolutions et améliorations au fil du temps, avec un interlocuteur unique." },
];

export const localPages: Service[] = [
  {
    slug: "agence-web-orleans",
    name: "Agence web et IA à Orléans",
    title: "Agence web et IA pour les entreprises d’Orléans — FDA Studio",
    description:
      "Sites internet, applications et IA pour les entreprises d’Orléans et du Loiret : agent vocal, automatisation, site rapide et bien référencé. Devis gratuit.",
    keywords: ["agence web Orléans", "création site internet Orléans", "agence IA Orléans", "agent vocal Orléans", "développement application Orléans", "site internet Loiret"],
    h1: ["Agence web et IA", "pour les entreprises d’Orléans"],
    headings: {
      offers: "Ce que nous réalisons pour les entreprises d’Orléans.",
      forWhom: "Pour qui, dans le Loiret.",
      steps: "Comment nous travaillons ensemble.",
      included: "Ce que comprend chaque projet.",
      local: "Orléans, le Loiret et le Centre-Val de Loire.",
      faq: "Questions fréquentes des entreprises d’Orléans.",
    },
    intro:
      "FDA Studio accompagne les entreprises d’Orléans et du Loiret dans leurs projets numériques : site internet, application mobile ou web, et intelligence artificielle intégrée au quotidien, comme un agent vocal qui répond au téléphone ou l’automatisation des tâches répétitives.",
    serviceType: "Agence web et intelligence artificielle",
    areaServed: ["Orléans", "Olivet", "Saint-Jean-de-Braye", "Fleury-les-Aubrais", "Loiret", "Centre-Val de Loire"],
    offers: [
      { title: "Site internet", text: "Site vitrine, boutique en ligne ou refonte : rapide, pensé pour le téléphone et construit pour être trouvé sur Google à Orléans." },
      { title: "Agent vocal", text: "Un assistant qui décroche quand vous ne pouvez pas, comprend la demande, prend le rendez-vous et vous transmet le résumé." },
      { title: "Automatisation", text: "Relances, devis, e-mails, saisie dans vos outils : les tâches qui reviennent chaque semaine, faites sans vous." },
      { title: "Application", text: "Application mobile ou outil web sur mesure pour vos clients ou votre équipe." },
    ],
    steps: SHARED_STEPS,
    forWhom: [
      { title: "Commerces et restaurants du centre-ville", text: "Être trouvé sur le téléphone de vos clients, afficher des informations à jour et prendre les réservations sans décrocher à chaque appel." },
      { title: "Artisans de la métropole", text: "Ne plus perdre une demande de devis quand vous êtes sur un chantier, et présenter vos réalisations." },
      { title: "PME et entreprises de services", text: "Gagner du temps sur l’administratif et transformer les visites du site en demandes qualifiées pour l’équipe commerciale." },
    ],
    included: [
      "Un interlocuteur unique, de la première idée à la mise en service",
      "Un design sur mesure, sans modèle recyclé",
      "Un affichage pensé d’abord pour le téléphone",
      "Les bases du référencement local : balises, données structurées, fiche Google à relier",
      "Vos données protégées et des accès qui restent à votre nom",
    ],
    local:
      "Le studio est installé à Fondettes, près de Tours, et travaille avec les entreprises d’Orléans, d’Olivet, de Saint-Jean-de-Braye, de Fleury-les-Aubrais et de tout le Loiret. La plupart des échanges se font en visio ; nous nous déplaçons à Orléans quand le projet le demande.",
    faq: [
      { q: "Travaillez-vous vraiment avec des entreprises d’Orléans sans y avoir de bureau ?", a: "Oui. Les rendez-vous se font en visio ou sur place quand c’est utile, et tout le suivi se fait à distance. Vous avez un interlocuteur unique, joignable directement." },
      { q: "Combien coûte un projet ?", a: "Cela dépend de ce que vous voulez faire. Après un premier échange, vous recevez un devis détaillé et gratuit." },
      { q: "Mon site sera-t-il visible à Orléans sur Google ?", a: "Le référencement local est pris en compte dès la conception : contenus ciblés sur votre activité et votre zone, données structurées, fiche Google Business Profile reliée au site. Personne ne peut garantir une position, mais toutes les bases sont posées." },
      { q: "Un agent vocal peut-il remplacer notre secrétariat ?", a: "Il prend en charge les appels simples et répétitifs (horaires, prise de rendez-vous, prise de message) et vous transmet le reste. Il complète une équipe plutôt qu’il ne la remplace." },
    ],
    demo: { href: "/#creations", label: "Voir les démos" },
  },
  {
    slug: "agence-web-le-mans",
    name: "Agence web et IA au Mans",
    title: "Agence web et IA pour les entreprises du Mans — FDA Studio",
    description:
      "Sites internet, applications et IA pour les entreprises du Mans et de la Sarthe : agent vocal, automatisation, site rapide et bien référencé. Devis gratuit.",
    keywords: ["agence web Le Mans", "création site internet Le Mans", "agence IA Le Mans", "agent vocal Le Mans", "développement application Le Mans", "site internet Sarthe"],
    h1: ["Agence web et IA", "pour les entreprises du Mans"],
    headings: {
      offers: "Ce que nous réalisons pour les entreprises du Mans.",
      forWhom: "Pour qui, en Sarthe.",
      steps: "Comment nous travaillons ensemble.",
      included: "Ce que comprend chaque projet.",
      local: "Le Mans et la Sarthe.",
      faq: "Questions fréquentes des entreprises du Mans.",
    },
    intro:
      "FDA Studio accompagne les entreprises du Mans et de la Sarthe : un site internet qui amène des demandes, une application quand il en faut une, et l’intelligence artificielle pour décharger l’équipe des appels et des tâches qui reviennent sans cesse.",
    serviceType: "Agence web et intelligence artificielle",
    areaServed: ["Le Mans", "Allonnes", "Coulaines", "Arnage", "Sarthe", "Pays de la Loire"],
    offers: [
      { title: "Site internet", text: "Site vitrine, boutique en ligne ou refonte, rapide sur téléphone et préparé pour les recherches locales au Mans." },
      { title: "Agent vocal", text: "Les appels pris même quand l’équipe est occupée : demande comprise, rendez-vous posé, résumé envoyé." },
      { title: "Automatisation", text: "Devis, relances, comptes rendus, saisie dans le CRM : moins de copier-coller, plus de temps pour vos clients." },
      { title: "Application", text: "Application mobile ou outil interne sur mesure, relié à vos données." },
    ],
    steps: SHARED_STEPS,
    forWhom: [
      { title: "Entreprises industrielles et de services", text: "Des outils sur mesure pour suivre l’activité, et un site qui présente clairement votre savoir-faire aux clients comme aux recrues." },
      { title: "Artisans et entreprises du bâtiment", text: "Répondre à chaque demande, même pendant les chantiers, et montrer des réalisations qui rassurent." },
      { title: "Commerces, hôtels et restaurants", text: "Être bien visible sur Google, prendre les réservations et répondre aux questions courantes à toute heure." },
    ],
    included: [
      "Un interlocuteur unique, de la première idée à la mise en service",
      "Un design sur mesure, sans modèle recyclé",
      "Un affichage pensé d’abord pour le téléphone",
      "Les bases du référencement local : balises, données structurées, fiche Google à relier",
      "Vos données protégées et des accès qui restent à votre nom",
    ],
    local:
      "Le studio est installé à Fondettes, près de Tours, et travaille avec les entreprises du Mans, d’Allonnes, de Coulaines, d’Arnage et de toute la Sarthe. Les échanges se font surtout en visio ; nous nous déplaçons au Mans quand le projet le demande.",
    faq: [
      { q: "Pourquoi une agence de Touraine pour une entreprise du Mans ?", a: "Pour un interlocuteur unique qui maîtrise à la fois le site, l’application et l’intelligence artificielle. La distance ne change rien au suivi, qui se fait en visio et par téléphone, avec des déplacements quand c’est utile." },
      { q: "Combien coûte un projet ?", a: "Cela dépend de ce que vous voulez faire. Après un premier échange, vous recevez un devis détaillé et gratuit." },
      { q: "Pouvez-vous reprendre notre site existant ?", a: "Oui, en conservant les adresses des pages et le référencement déjà acquis." },
      { q: "L’intelligence artificielle est-elle utile pour une petite entreprise ?", a: "Souvent oui, sur des tâches précises : répondre au téléphone, trier les e-mails, préparer des devis ou des comptes rendus. Nous commençons par ce qui vous fait perdre le plus de temps." },
    ],
    demo: { href: "/#creations", label: "Voir les démos" },
  },
  {
    slug: "agent-vocal-artisans-tours",
    name: "Agent vocal pour artisans",
    title: "Agent vocal pour artisans à Tours, Orléans et Le Mans — FDA Studio",
    description:
      "Un agent vocal IA qui répond quand vous êtes sur un chantier : demande comprise, rendez-vous pris, résumé envoyé. Pour les artisans de Tours, Orléans et Le Mans.",
    keywords: ["agent vocal artisan", "standard téléphonique artisan Tours", "secrétariat téléphonique artisan", "agent vocal IA Orléans", "répondeur intelligent artisan Le Mans", "prise de rendez-vous automatique"],
    h1: ["Agent vocal pour artisans", "à Tours, Orléans et Le Mans"],
    headings: {
      offers: "Ce que fait l’agent vocal pour un artisan.",
      forWhom: "Pour quels métiers.",
      steps: "Comment nous le mettons en place.",
      included: "Ce que comprend la mise en place.",
      local: "Pour les artisans de Tours, d’Orléans, du Mans et des alentours.",
      faq: "Questions fréquentes des artisans.",
    },
    intro:
      "Sur un chantier, sur une échelle ou au volant, il est difficile de décrocher. Un agent vocal répond à votre place, comprend ce que veut la personne, prend le rendez-vous ou le message et vous envoie un résumé clair. Vous rappelez quand vous pouvez, en sachant déjà de quoi il s’agit.",
    serviceType: "Agent vocal IA pour artisans",
    areaServed: CITIES,
    offers: [
      { title: "Répondre à chaque appel", text: "L’agent décroche quand vous êtes occupé, à la voix de votre entreprise, poliment et sans attente." },
      { title: "Comprendre la demande", text: "Type de travaux, adresse, urgence, disponibilités : l’agent pose les bonnes questions selon votre métier." },
      { title: "Prendre le rendez-vous", text: "Visite ou devis, posé directement dans votre agenda selon vos créneaux." },
      { title: "Vous résumer l’appel", text: "Un message clair par SMS ou e-mail, et la demande rangée dans votre outil de suivi." },
    ],
    steps: SHARED_STEPS,
    forWhom: [
      { title: "Plombiers, chauffagistes, électriciens", text: "Distinguer l’urgence de la simple demande de devis, et ne plus perdre les appels de dépannage pendant une intervention." },
      { title: "Menuisiers, couvreurs, maçons", text: "Recueillir les informations du projet avant la visite, pour arriver avec les bonnes questions." },
      { title: "Paysagistes et entreprises de rénovation", text: "Gérer les demandes de saison sans y passer ses soirées au téléphone." },
    ],
    included: [
      "Un script d’accueil écrit pour votre métier et vos prestations",
      "Le branchement à votre agenda et à votre numéro existant",
      "Des résumés d’appel clairs, envoyés là où vous les lisez",
      "Des réglages ajustés après les premiers appels réels",
      "Des données d’appel protégées et conservées le temps nécessaire",
    ],
    local:
      "Le studio est installé à Fondettes, près de Tours, et met en place l’agent vocal pour des artisans de Tours, d’Orléans, du Mans et de leurs alentours. La mise en place se fait à distance ; nous pouvons aussi nous rencontrer sur place.",
    faq: [
      { q: "Mes clients sauront-ils qu’ils parlent à une IA ?", a: "Oui, l’agent se présente comme l’assistant de votre entreprise. Il est là pour ne pas laisser un appel sans réponse, et vous restez joignable pour les cas qui le demandent." },
      { q: "Faut-il changer de numéro ?", a: "Non. Les appels que vous ne prenez pas sont renvoyés vers l’agent, depuis votre numéro actuel." },
      { q: "Que se passe-t-il en cas d’urgence ?", a: "Les règles sont fixées avec vous : l’agent peut vous transmettre immédiatement un appel urgent ou vous prévenir par message." },
      { q: "Combien ça coûte ?", a: "Cela dépend du volume d’appels et des branchements souhaités. Vous recevez un devis détaillé et gratuit après un premier échange." },
    ],
    demo: { href: "/#demo-telephone", label: "Écouter la démo" },
  },
  {
    slug: "site-internet-restaurant-tours",
    name: "Site internet pour restaurant",
    title: "Site internet pour restaurant à Tours, Orléans et Le Mans — FDA Studio",
    description:
      "Site internet pour restaurants, bars et traiteurs à Tours, Orléans et Le Mans : carte à jour, réservation, horaires, avis Google et agent vocal au téléphone.",
    keywords: ["site internet restaurant Tours", "création site restaurant Orléans", "site restaurant Le Mans", "réservation en ligne restaurant", "agent vocal restaurant", "site web bar traiteur"],
    h1: ["Site internet pour restaurant", "à Tours, Orléans et Le Mans"],
    headings: {
      offers: "Ce que le site fait pour votre restaurant.",
      forWhom: "Pour quels établissements.",
      steps: "Comment nous le réalisons.",
      included: "Ce que comprend chaque site.",
      local: "Pour les restaurants de Tours, d’Orléans, du Mans et des alentours.",
      faq: "Questions fréquentes des restaurateurs.",
    },
    intro:
      "Vos clients regardent votre carte, vos horaires et vos photos sur leur téléphone avant de venir. Le site de votre restaurant doit leur donner ces informations en un instant, à jour, et leur permettre de réserver sans avoir à appeler pendant le coup de feu.",
    serviceType: "Création de site internet pour restaurant",
    areaServed: CITIES,
    offers: [
      { title: "La carte toujours à jour", text: "Plats, prix, menu du jour et allergènes, modifiables simplement, lisibles sur téléphone." },
      { title: "La réservation", text: "Réservation en ligne reliée à votre outil, ou demande transmise directement à l’équipe." },
      { title: "Les appels pendant le service", text: "Un agent vocal répond aux questions courantes et prend les réservations quand personne ne peut décrocher." },
      { title: "La visibilité sur Google", text: "Site relié à votre fiche Google, horaires cohérents partout, informations structurées pour la recherche locale." },
    ],
    steps: SHARED_STEPS,
    forWhom: [
      { title: "Restaurants et brasseries", text: "Remplir les services en semaine et répondre aux demandes de groupes sans y passer l’après-midi." },
      { title: "Bars et caves", text: "Faire connaître les soirées, les événements et la carte du moment." },
      { title: "Traiteurs", text: "Présenter les formules et recevoir des demandes de devis complètes pour les événements." },
    ],
    included: [
      "Un design à l’image de votre établissement, sans modèle recyclé",
      "Un affichage pensé d’abord pour le téléphone",
      "Des photos optimisées pour un chargement rapide",
      "Les informations pratiques bien visibles : adresse, horaires, accès, contact",
      "Le lien avec votre fiche Google et vos réseaux",
    ],
    local:
      "Le studio est installé à Fondettes, près de Tours, et réalise des sites pour des restaurants de Tours, d’Orléans, du Mans et des communes voisines. Nous pouvons passer vous voir pour les photos et la prise en main.",
    faq: [
      { q: "Pourrai-je modifier la carte moi-même ?", a: "Oui, un espace simple permet de changer plats, prix et menu du jour depuis votre téléphone." },
      { q: "Faut-il un système de réservation payant ?", a: "Pas forcément. Nous pouvons relier le site à l’outil que vous utilisez déjà, ou prévoir une demande de réservation transmise à l’équipe." },
      { q: "Le site aide-t-il à apparaître sur Google Maps ?", a: "C’est la fiche Google Business Profile qui apparaît sur la carte. Le site la renforce : mêmes informations partout, contenus clairs, liens entre les deux." },
      { q: "Combien coûte un site de restaurant ?", a: "Cela dépend des fonctions souhaitées. Vous recevez un devis détaillé et gratuit après un premier échange." },
    ],
    demo: { href: "/#creations", label: "Voir les démos" },
  },
  {
    slug: "ia-professions-liberales-tours",
    name: "IA pour cabinets et professions libérales",
    title: "IA pour cabinets et professions libérales à Tours, Orléans, Le Mans",
    description:
      "Agent vocal, prise de rendez-vous, tri des e-mails, préparation des documents : l’IA pour les cabinets de Tours, Orléans et Le Mans, sans perdre la main.",
    keywords: ["IA cabinet comptable Tours", "IA cabinet avocat Orléans", "agent vocal cabinet", "automatisation profession libérale", "prise de rendez-vous automatique cabinet", "intelligence artificielle Le Mans"],
    h1: ["L’IA pour les cabinets", "à Tours, Orléans et Le Mans"],
    headings: {
      offers: "Ce que l’IA prend en charge dans un cabinet.",
      forWhom: "Pour quels cabinets.",
      steps: "Comment nous la mettons en place.",
      included: "Ce que comprend chaque mise en place.",
      local: "Pour les cabinets de Tours, d’Orléans, du Mans et des alentours.",
      faq: "Questions fréquentes des cabinets.",
    },
    intro:
      "Dans un cabinet, une grande partie de la journée part dans le téléphone, les rendez-vous, les relances de pièces et les e-mails. L’intelligence artificielle peut prendre en charge ces tâches répétitives, tandis que les décisions et le conseil restent entre vos mains.",
    serviceType: "Intégration de l’intelligence artificielle pour cabinets",
    areaServed: CITIES,
    offers: [
      { title: "Accueil téléphonique", text: "Un agent vocal répond, oriente et prend les rendez-vous selon vos règles, et vous transmet un résumé." },
      { title: "Prise de rendez-vous", text: "Créneaux proposés en ligne ou au téléphone, rappels envoyés, moins de rendez-vous oubliés." },
      { title: "Tri des e-mails et des pièces", text: "Les messages classés, les pièces manquantes repérées et relancées, les demandes urgentes mises en avant." },
      { title: "Préparation de documents", text: "Brouillons de courriers, comptes rendus et synthèses préparés pour relecture, jamais envoyés sans vous." },
    ],
    steps: SHARED_STEPS,
    forWhom: [
      { title: "Cabinets d’expertise comptable", text: "Relancer les pièces, répondre aux questions courantes et dégager du temps en période fiscale." },
      { title: "Cabinets d’avocats", text: "Filtrer les premiers appels, recueillir les informations utiles avant le rendez-vous et préparer les courriers types." },
      { title: "Agences et cabinets de conseil", text: "Moins d’administratif, des suivis clients plus réguliers et des comptes rendus prêts plus vite." },
    ],
    included: [
      "Un repérage des tâches qui prennent le plus de temps au cabinet",
      "Des règles fixées avec vous : ce que l’IA fait seule, ce qu’elle vous soumet",
      "Le branchement à vos outils existants (agenda, messagerie, logiciel métier quand c’est possible)",
      "Une attention particulière à la confidentialité et à la conformité RGPD",
      "Une prise en main simple pour toute l’équipe",
    ],
    local:
      "Le studio est installé à Fondettes, près de Tours, et accompagne des cabinets de Tours, d’Orléans, du Mans et des villes voisines. La mise en place se fait surtout à distance, avec un premier rendez-vous sur place si vous le souhaitez.",
    faq: [
      { q: "Nos données restent-elles confidentielles ?", a: "La confidentialité est un préalable : accès limités, données hébergées en Europe quand c’est possible, et aucune information transmise sans nécessité. Nous fixons ensemble ce que l’IA peut lire et ce qu’elle ne doit pas voir." },
      { q: "L’IA peut-elle envoyer des documents à nos clients ?", a: "Seulement si vous le décidez. Par défaut, elle prépare des brouillons que vous relisez et validez." },
      { q: "Faut-il changer nos logiciels ?", a: "Non. Nous partons de vos outils actuels et branchons l’IA dessus quand c’est possible." },
      { q: "Combien coûte la mise en place ?", a: "Cela dépend des tâches choisies et des outils à relier. Vous recevez un devis détaillé et gratuit après un premier échange." },
    ],
    demo: { href: "/#creations", label: "Voir les démos IA" },
  },
  {
    slug: "site-agence-immobiliere-tours",
    name: "Site et IA pour agences immobilières",
    title: "Site internet et IA pour agence immobilière à Tours, Orléans, Le Mans",
    description:
      "Site d’agence immobilière, mise en avant des biens, demandes d’estimation et agent vocal pour les appels : pour les agences de Tours, Orléans et Le Mans.",
    keywords: ["site agence immobilière Tours", "création site immobilier Orléans", "site agence immobilière Le Mans", "agent vocal agence immobilière", "demande d’estimation en ligne", "IA immobilier"],
    h1: ["Site et IA pour agences immobilières", "à Tours, Orléans et Le Mans"],
    headings: {
      offers: "Ce que nous réalisons pour une agence immobilière.",
      forWhom: "Pour quelles agences.",
      steps: "Comment nous le réalisons.",
      included: "Ce que comprend chaque projet.",
      local: "Pour les agences de Tours, d’Orléans, du Mans et des alentours.",
      faq: "Questions fréquentes des agences immobilières.",
    },
    intro:
      "Les vendeurs comparent les agences en ligne avant de vous appeler, et les acheteurs veulent des réponses tout de suite. Un site qui met vos biens et votre secteur en valeur, des demandes d’estimation bien qualifiées et un agent vocal qui ne laisse aucun appel sans suite font la différence.",
    serviceType: "Site internet et intelligence artificielle pour agence immobilière",
    areaServed: CITIES,
    offers: [
      { title: "Site d’agence", text: "Biens mis en valeur, présentation de l’équipe et du secteur, pensé pour le téléphone." },
      { title: "Demandes d’estimation", text: "Un formulaire qui recueille les bonnes informations sur le bien et arrive directement à l’agent concerné." },
      { title: "Appels et visites", text: "Un agent vocal répond sur les annonces, qualifie l’acheteur et propose des créneaux de visite." },
      { title: "Suivi des contacts", text: "Les demandes rangées et relancées automatiquement, pour ne laisser filer aucun mandat." },
    ],
    steps: SHARED_STEPS,
    forWhom: [
      { title: "Agences indépendantes", text: "Une image soignée face aux réseaux nationaux, et des demandes de vendeurs du secteur." },
      { title: "Agences de réseau", text: "Un site local qui complète celui du réseau et met en avant votre connaissance du quartier." },
      { title: "Gestion locative", text: "Les questions courantes des locataires et des propriétaires traitées sans saturer la ligne." },
    ],
    included: [
      "Un design sur mesure, à l’image de votre agence",
      "Un affichage pensé d’abord pour le téléphone",
      "Des pages de secteur utiles aux vendeurs comme aux acheteurs",
      "Le lien avec votre fiche Google et vos annonces existantes quand c’est possible",
      "Des données de contacts protégées",
    ],
    local:
      "Le studio est installé à Fondettes, près de Tours, et travaille avec des agences de Tours, d’Orléans, du Mans et de leurs alentours. Nous pouvons nous rencontrer à l’agence pour le lancement du projet.",
    faq: [
      { q: "Pouvez-vous afficher nos annonces sur le site ?", a: "Oui, dans la plupart des cas en reliant le site à votre logiciel de transaction, pour ne pas saisir deux fois les biens." },
      { q: "L’agent vocal peut-il fixer des visites ?", a: "Oui, selon vos créneaux et vos règles : il qualifie l’acheteur, propose un rendez-vous et vous transmet le résumé." },
      { q: "Le site aide-t-il à obtenir des mandats ?", a: "C’est son rôle : rassurer les vendeurs, montrer votre connaissance du secteur et faciliter la demande d’estimation." },
      { q: "Combien coûte un projet ?", a: "Cela dépend des fonctions et des branchements. Vous recevez un devis détaillé et gratuit après un premier échange." },
    ],
    demo: { href: "/#creations", label: "Voir les démos" },
  },
];

export const localBySlug = (slug: string) => localPages.find((p) => p.slug === slug);
