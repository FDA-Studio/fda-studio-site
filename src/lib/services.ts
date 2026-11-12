/**
 * Pages de service optimisées pour la recherche locale (Tours, Touraine) et nationale.
 * Contenu factuel uniquement : aucun client, chiffre ou prix inventé.
 */
export type Service = {
  slug: string;
  /** Libellé court (navigation, fil d'Ariane, liens internes) */
  name: string;
  /** Titre de la balise <title> (≈ 60 caractères) */
  title: string;
  /** Meta description (≈ 155 caractères) */
  description: string;
  keywords: string[];
  /** Titre H1, en deux lignes */
  h1: [string, string];
  intro: string;
  /** Type de service pour les données structurées schema.org */
  serviceType: string;
  offers: { title: string; text: string }[];
  steps: { title: string; text: string }[];
  /** Pour qui : situations typiques de prospects (aucun client nommé) */
  forWhom: { title: string; text: string }[];
  /** Ce que comprend chaque projet */
  included: string[];
  local: string;
  faq: { q: string; a: string }[];
  /** Lien vers une démonstration sur l'accueil */
  demo?: { href: string; label: string };
};

export const services: Service[] = [
  {
    slug: "creation-site-internet-tours",
    name: "Création de site internet",
    title: "Création de site internet à Tours — Agence web FDA Studio",
    description:
      "Création de sites internet à Tours et en Touraine : sites vitrines, e-commerce et landing pages rapides, bien référencés et faits sur mesure. Devis gratuit.",
    keywords: [
      "création site internet Tours",
      "agence web Tours",
      "création site web Indre-et-Loire",
      "site vitrine Tours",
      "site e-commerce Tours",
      "refonte site internet",
      "référencement local Tours",
    ],
    h1: ["Création de site internet", "à Tours et partout en France"],
    intro:
      "FDA Studio conçoit et développe des sites internet sur mesure pour les entreprises de Tours, de Touraine et de toute la France : rapides, faciles à trouver sur Google et pensés pour transformer les visites en demandes de contact.",
    serviceType: "Création de site internet",
    offers: [
      { title: "Site vitrine", text: "Présenter votre entreprise, vos services et vos réalisations, avec un formulaire de contact qui fonctionne." },
      { title: "Site e-commerce", text: "Vendre en ligne avec un catalogue, un paiement sécurisé et une gestion des commandes simple." },
      { title: "Landing page", text: "Une page unique centrée sur une offre, pour vos campagnes Google Ads ou réseaux sociaux." },
      { title: "Refonte de site", text: "Moderniser un site existant sans perdre son référencement : redirections, contenus et structure conservés." },
      { title: "Référencement naturel", text: "Structure, balises, données structurées, vitesse et contenus travaillés pour Google dès la conception." },
      { title: "Expériences interactives", text: "Animations, 3D et son pour les marques qui veulent marquer les esprits, comme ce site." },
    ],
    steps: [
      { title: "Échange", text: "Nous parlons de votre activité, de vos clients et de vos objectifs, à Tours ou en visio." },
      { title: "Maquettes", text: "Vous validez la structure et le design avant la moindre ligne de code." },
      { title: "Développement", text: "Le site est construit, testé sur mobile, tablette et ordinateur, et optimisé pour la vitesse." },
      { title: "Mise en ligne", text: "Nom de domaine, hébergement, Google Search Console : tout est branché et vérifié." },
      { title: "Suivi", text: "Évolutions, nouvelles pages et améliorations du référencement au fil du temps." },
    ],
    forWhom: [
      { title: "Artisans et entreprises du bâtiment", text: "Être trouvé quand un particulier cherche un professionnel près de chez lui, montrer ses chantiers et recevoir des demandes de devis complètes plutôt que des appels manqués." },
      { title: "Commerces et restaurants", text: "Horaires, carte, réservation ou vente en ligne : les informations que vos clients cherchent sur leur téléphone, à jour et rapides à afficher." },
      { title: "Professions libérales et cabinets", text: "Présenter vos domaines d’intervention avec clarté, rassurer avant le premier rendez-vous et permettre la prise de contact en quelques secondes." },
      { title: "PME et entreprises de services", text: "Un site qui explique ce que vous faites, pour qui, et qui alimente votre équipe commerciale avec des demandes qualifiées." },
    ],
    included: [
      "Un design sur mesure, sans thème acheté ni modèle recyclé",
      "Un affichage pensé d’abord pour le téléphone, testé sur mobile, tablette et ordinateur",
      "Des pages rapides : images optimisées, code léger, chargement vérifié avant la mise en ligne",
      "Les bases du référencement : balises, données structurées, plan du site, adresses lisibles",
      "Un formulaire de contact protégé contre le spam, qui arrive directement dans votre boîte",
      "Des mentions légales et une politique de confidentialité à compléter avec vos informations",
      "Le branchement de Google Search Console pour suivre votre présence sur Google",
    ],
    local:
      "Le studio est installé à Fondettes, aux portes de Tours. Nous rencontrons volontiers les entreprises de Tours, Joué-lès-Tours, Saint-Cyr-sur-Loire, Chambray-lès-Tours, Amboise et du reste de l’Indre-et-Loire, et nous travaillons à distance avec des clients partout en France.",
    faq: [
      {
        q: "Combien coûte la création d’un site internet ?",
        a: "Le prix dépend du nombre de pages, des fonctionnalités et du niveau de design. Après un premier échange, vous recevez un devis détaillé et gratuit. Le formulaire de contact propose des fourchettes de budget pour orienter la discussion.",
      },
      {
        q: "Mon site sera-t-il bien référencé sur Google à Tours ?",
        a: "Le référencement est pris en compte dès la conception : pages rapides, balises et données structurées, contenus ciblés sur votre activité et votre zone, fiche Google Business Profile à relier au site. Aucune agence sérieuse ne peut garantir une position, mais nous mettons toutes les bases en place.",
      },
      {
        q: "Le site sera-t-il adapté aux téléphones ?",
        a: "Oui. Chaque site est conçu d’abord pour le mobile, puis adapté à la tablette et à l’ordinateur, et testé sur ces trois formats avant la mise en ligne.",
      },
      {
        q: "Travaillez-vous avec des entreprises en dehors de Tours ?",
        a: "Oui. Nous travaillons avec des entreprises partout en France, en visioconférence. Pour les entreprises de Touraine, nous pouvons aussi nous rencontrer sur place.",
      },
      {
        q: "Pouvez-vous reprendre un site existant ?",
        a: "Oui, nous réalisons des refontes complètes ou partielles, en préservant les adresses des pages et le référencement déjà acquis.",
      },
      {
        q: "Combien de temps faut-il pour créer un site ?",
        a: "Cela dépend du nombre de pages, des contenus à produire et des fonctions attendues. Un site vitrine se compte généralement en semaines, une boutique en ligne demande davantage. Le planning est fixé dans le devis, et les contenus fournis à temps sont souvent ce qui fait gagner le plus de temps.",
      },
      {
        q: "Serai-je propriétaire de mon site et de mon nom de domaine ?",
        a: "Oui. Le nom de domaine est enregistré à votre nom et vous recevez les accès à votre site. Vous restez libre de changer de prestataire.",
      },
      {
        q: "Pourrai-je modifier les contenus moi-même ?",
        a: "Si vous le souhaitez, oui : nous pouvons prévoir un espace d’édition simple pour vos textes, vos photos ou vos actualités. Pour les sites qui évoluent peu, nous pouvons aussi nous charger des mises à jour.",
      },
    ],
  },
  {
    slug: "agence-ia-tours",
    name: "Intégration de l’IA",
    title: "Agence IA à Tours — Intégration de l’intelligence artificielle",
    description:
      "Agence IA à Tours : agents vocaux, chatbots, automatisation des e-mails et du CRM, lecture de documents. L’intelligence artificielle intégrée à votre entreprise.",
    keywords: [
      "agence IA Tours",
      "intégration intelligence artificielle entreprise",
      "automatisation IA",
      "agent vocal IA",
      "chatbot entreprise",
      "automatisation CRM",
      "IA PME Indre-et-Loire",
    ],
    h1: ["Intégration de l’IA", "pour les entreprises de Tours"],
    intro:
      "FDA Studio intègre l’intelligence artificielle dans le quotidien des entreprises : un agent qui répond au téléphone, un assistant qui répond aux clients, des demandes saisies automatiquement dans le CRM. Branché sur vos outils, avec un humain qui garde la main.",
    serviceType: "Intégration de l'intelligence artificielle",
    offers: [
      { title: "Agent vocal", text: "Il décroche, comprend la demande, prend ou déplace un rendez-vous dans votre agenda et note tout dans votre CRM, à toute heure." },
      { title: "Assistant client", text: "Un chatbot qui répond à partir de vos documents et de vos données, puis transmet à la bonne personne." },
      { title: "Automatisation des demandes", text: "Les e-mails et formulaires entrants sont qualifiés, saisis dans votre CRM et préparés pour votre équipe." },
      { title: "Lecture de documents", text: "Factures, bons de commande, contrats : les informations sont extraites et classées sans ressaisie." },
      { title: "IA dans vos logiciels", text: "Ajout de fonctions d’IA dans un outil existant, un site ou une application métier." },
      { title: "Audit et conseil", text: "Repérer les tâches où l’IA fait réellement gagner du temps, et celles où elle n’a pas sa place." },
    ],
    steps: [
      { title: "Audit", text: "Nous observons vos processus et repérons les tâches répétitives qui coûtent le plus de temps." },
      { title: "Prototype", text: "Une première version est testée sur de vrais cas, avec vos données et vos équipes." },
      { title: "Intégration", text: "L’IA est branchée sur vos outils : téléphonie, e-mails, CRM, ERP, site." },
      { title: "Contrôle", text: "Un humain valide les décisions importantes ; les erreurs sont suivies et corrigées." },
      { title: "Suivi", text: "Coûts, qualité des réponses et nouveaux besoins sont revus régulièrement." },
    ],
    forWhom: [
      { title: "Entreprises qui ratent des appels", text: "Artisans sur les chantiers, cabinets en rendez-vous, commerces débordés aux heures de pointe : un agent vocal décroche, répond aux questions courantes et prend les rendez-vous." },
      { title: "Équipes noyées sous les e-mails", text: "Les demandes entrantes sont lues, triées, résumées et saisies dans le CRM ; votre équipe n’a plus qu’à valider et répondre." },
      { title: "Services administratifs qui ressaisissent", text: "Factures, bons de commande, formulaires : les informations sont extraites des documents et rangées au bon endroit, avec une vérification humaine." },
      { title: "Dirigeants qui veulent avancer sans se tromper", text: "Un audit pour savoir où l’IA fait vraiment gagner du temps dans votre entreprise, ce que cela coûte à l’usage et ce qu’il vaut mieux ne pas automatiser." },
    ],
    included: [
      "Un audit de vos processus avant toute recommandation",
      "Le choix du modèle d’IA et des fournisseurs, expliqué : coût à l’usage, hébergement des données, limites",
      "Un prototype testé sur vos vrais cas avant le déploiement",
      "Le branchement sur vos outils : téléphonie, agenda, e-mails, CRM, ERP, site",
      "Des garde-fous : réponses limitées à vos informations, transfert vers un humain, journal des actions",
      "Des clés et accès conservés côté serveur, jamais exposés dans le navigateur",
      "Un suivi régulier de la qualité des réponses et des coûts",
    ],
    local:
      "Basé à Fondettes, près de Tours, le studio accompagne les PME, artisans, commerces et professions libérales de Touraine, ainsi que des entreprises partout en France à distance. Les données sont traitées dans le respect du RGPD et les choix de fournisseurs d’IA vous sont expliqués.",
    faq: [
      {
        q: "L’IA est-elle adaptée à une petite entreprise ?",
        a: "Souvent, oui : répondre au téléphone, trier les e-mails ou ressaisir des documents prend beaucoup de temps dans une petite structure. L’audit sert justement à vérifier où le gain est réel avant d’investir.",
      },
      {
        q: "Mes données restent-elles confidentielles ?",
        a: "Nous choisissons des fournisseurs et des réglages adaptés à la sensibilité de vos données, expliquons où elles sont traitées et appliquons les règles du RGPD. Les clés et accès ne sont jamais exposés côté navigateur.",
      },
      {
        q: "L’IA peut-elle se tromper ?",
        a: "Oui, aucune IA n’est infaillible. C’est pourquoi les décisions importantes restent validées par une personne, et que les réponses de l’IA sont limitées à vos propres informations.",
      },
      {
        q: "Avec quels outils l’IA peut-elle fonctionner ?",
        a: "Avec la plupart des outils qui disposent d’une API ou d’un export : messagerie, agenda, CRM, ERP, logiciel de facturation, site internet ou téléphonie.",
      },
      {
        q: "Puis-je voir des exemples ?",
        a: "Oui : la page d’accueil présente quatre démonstrations animées (agent vocal, assistant client, automatisation, lecture de documents). Ce sont des concepts avec des données fictives.",
      },
      {
        q: "Combien coûte une IA à l’usage ?",
        a: "Une partie du coût dépend de l’utilisation : minutes d’appel pour un agent vocal, volume de messages ou de documents traités. Nous estimons ce coût avant le projet et le suivons ensuite. Nos articles détaillent les ordres de grandeur du marché, par exemple pour un agent vocal.",
      },
      {
        q: "Faut-il changer de logiciels pour utiliser l’IA ?",
        a: "Non, dans la plupart des cas. L’intérêt est justement de brancher l’IA sur les outils que vous utilisez déjà, sans imposer une nouvelle façon de travailler à votre équipe.",
      },
      {
        q: "Combien de temps pour mettre en place un premier usage ?",
        a: "Un premier cas bien délimité, comme un agent qui répond au téléphone ou le tri des e-mails, peut être testé rapidement sous forme de prototype. Le délai complet dépend des outils à connecter et du niveau de contrôle souhaité.",
      },
    ],
    demo: { href: "/#creations", label: "Voir les démos IA" },
  },
  {
    slug: "developpement-application-tours",
    name: "Développement d’applications",
    title: "Développement d’application mobile et web à Tours — FDA Studio",
    description:
      "Développement d’applications à Tours : applications mobiles iOS et Android, applications web, SaaS et outils métiers sur mesure, de la maquette aux stores.",
    keywords: [
      "développement application Tours",
      "création application mobile Tours",
      "développement application web",
      "développeur iOS Android Tours",
      "création SaaS",
      "logiciel sur mesure Indre-et-Loire",
    ],
    h1: ["Développement d’applications", "mobiles et web à Tours"],
    intro:
      "FDA Studio crée des applications sur mesure : applications mobiles iOS et Android, applications web, SaaS, tableaux de bord et outils métiers. Le même studio s’occupe du design, du développement et de la publication.",
    serviceType: "Développement d'applications",
    offers: [
      { title: "Application mobile", text: "Pour iPhone, iPad et Android, publiée sur l’App Store et Google Play." },
      { title: "Application web", text: "Accessible depuis un navigateur, sans installation, sur ordinateur comme sur téléphone." },
      { title: "SaaS", text: "Un logiciel en ligne avec comptes utilisateurs, abonnements et espace d’administration." },
      { title: "Outil métier", text: "Planning, devis, suivi d’interventions : un outil pensé pour la façon dont votre équipe travaille." },
      { title: "Tableau de bord", text: "Vos chiffres réunis au même endroit, mis à jour automatiquement depuis vos logiciels." },
      { title: "Jeu et expérience 3D", text: "Le studio développe aussi ses propres jeux mobiles, comme Door Knight." },
    ],
    steps: [
      { title: "Cadrage", text: "Qui utilisera l’application, pour faire quoi : nous définissons ensemble la première version utile." },
      { title: "Maquettes", text: "Les écrans sont dessinés et testés avant le développement." },
      { title: "Développement", text: "Livraisons régulières que vous pouvez essayer, plutôt qu’un effet tunnel." },
      { title: "Publication", text: "Mise en ligne, publication sur les stores, comptes et sécurité vérifiés." },
      { title: "Évolutions", text: "Nouvelles fonctions, corrections et mises à jour des systèmes au fil du temps." },
    ],
    forWhom: [
      { title: "Porteurs de projet et startups", text: "Transformer une idée en première version utilisable, la mettre entre les mains de vrais utilisateurs et la faire évoluer selon leurs retours, sans tout construire d’un coup." },
      { title: "PME aux outils dispersés", text: "Remplacer les tableurs, les e-mails et les ressaisies par un outil unique, pensé pour la façon dont votre équipe travaille réellement." },
      { title: "Entreprises de terrain", text: "Techniciens, livreurs, commerciaux : une application mobile pour les interventions, les photos, les signatures et la remontée d’informations, même avec une connexion faible." },
      { title: "Entreprises qui veulent un service en ligne", text: "Un espace client, une plateforme de réservation ou un logiciel par abonnement, avec comptes, paiements et administration." },
    ],
    included: [
      "Un cadrage écrit de la première version : utilisateurs, écrans, fonctions prioritaires",
      "Des maquettes cliquables validées avant le développement",
      "Des versions de test à essayer tout au long du projet",
      "Une sécurité vérifiée : comptes, permissions, règles d’accès aux données, sauvegardes",
      "La publication sur l’App Store et Google Play, ou la mise en ligne de l’application web",
      "La documentation technique et la remise des accès : le code vous appartient",
      "Un accompagnement pour les évolutions et les mises à jour des systèmes",
    ],
    local:
      "Le studio est installé à Fondettes, près de Tours. Nous travaillons avec des entreprises et des porteurs de projet de Touraine en rendez-vous, et partout en France à distance.",
    faq: [
      {
        q: "Combien de temps faut-il pour développer une application ?",
        a: "Cela dépend du nombre d’écrans et de fonctions. Nous commençons par une première version utile, livrée par étapes, puis l’application s’enrichit. Le planning est précisé dans le devis.",
      },
      {
        q: "Faut-il choisir entre iPhone et Android ?",
        a: "Non. Nous utilisons des technologies qui permettent de publier sur les deux à partir d’une même base, quand le projet s’y prête.",
      },
      {
        q: "Application mobile ou application web : que choisir ?",
        a: "Une application web suffit souvent pour un outil interne ; une application mobile est préférable quand il faut des notifications, l’appareil photo ou un usage hors connexion. Nous vous conseillons selon l’usage.",
      },
      {
        q: "Pouvez-vous ajouter de l’IA dans l’application ?",
        a: "Oui : assistant, recherche dans des documents, saisie automatique ou analyse de données peuvent être intégrés, avec les mêmes précautions de confidentialité que nos projets d’IA.",
      },
      {
        q: "Travaillez-vous en dehors de Tours ?",
        a: "Oui, avec des clients partout en France, en visioconférence et avec des versions de test partagées tout au long du projet.",
      },
      {
        q: "Qui est propriétaire du code de l’application ?",
        a: "Vous. Le code, les comptes des stores et les accès aux services sont à votre nom, et la documentation vous est remise.",
      },
      {
        q: "Qu’est-ce qu’une première version utile ?",
        a: "C’est la version la plus simple qui rend déjà service à vos utilisateurs. Elle permet de vérifier l’intérêt du projet et de décider des fonctions suivantes à partir de l’usage réel, plutôt que sur des suppositions.",
      },
      {
        q: "L’application peut-elle se connecter à mes logiciels actuels ?",
        a: "Oui, dès que ces logiciels proposent une API ou un export : CRM, ERP, facturation, agenda, paiement. Nous vérifions ce point dès le cadrage.",
      },
    ],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
