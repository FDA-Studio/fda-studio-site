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
  /** Intertitres H2 propres au service (lus par Google : ils disent de quoi parle chaque section) */
  headings: { offers: string; forWhom: string; steps: string; included: string; local: string; faq: string };
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
  /** Villes et territoires desservis, pour les données structurées (Tours et sa région par défaut) */
  areaServed?: string[];
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
    headings: {
      offers: "Les sites internet que nous créons.",
      forWhom: "À qui s’adressent nos sites.",
      steps: "Comment nous créons votre site.",
      included: "Ce que comprend chaque site.",
      local: "Création de site internet à Tours, en Touraine et partout en France.",
      faq: "Questions fréquentes sur la création de site.",
    },
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
    slug: "identite-visuelle-logo-tours",
    name: "Identité visuelle et logo",
    title: "Création de logo et identité visuelle à Tours | FDA Studio",
    description:
      "Création de logo et d’identité visuelle à Tours : logo, charte graphique, couleurs, typographies et déclinaisons pour vos supports, votre site et vos réseaux.",
    keywords: [
      "création logo Tours",
      "identité visuelle Tours",
      "agence communication Tours",
      "charte graphique Tours",
      "graphiste Tours",
      "refonte logo",
      "identité de marque Indre-et-Loire",
    ],
    h1: ["Identité visuelle et logo", "à Tours et partout en France"],
    headings: {
      offers: "Ce que nous créons pour votre image.",
      forWhom: "À qui s’adresse une identité visuelle.",
      steps: "Comment nous créons votre identité.",
      included: "Ce que comprend chaque identité visuelle.",
      local: "Identité visuelle et logo à Tours, en Touraine et partout en France.",
      faq: "Questions fréquentes sur la création de logo.",
    },
    intro:
      "Un logo, des couleurs, des typographies : c’est ce que vos clients retiennent avant même de lire ce que vous faites. FDA Studio crée l’identité visuelle des entreprises de Tours, de Touraine et de toute la France, puis la fait vivre partout où vos clients vous voient : site internet, réseaux sociaux, documents et supports imprimés.",
    serviceType: "Création d’identité visuelle et de logo",
    offers: [
      { title: "Création de logo", text: "Un logo pensé pour votre métier et vos clients, lisible en petit comme en grand, sur écran comme sur papier." },
      { title: "Charte graphique", text: "Couleurs, typographies, règles d’usage du logo : un guide simple pour que votre image reste cohérente partout." },
      { title: "Refonte d’identité", text: "Moderniser un logo existant sans perdre ce que vos clients reconnaissent déjà." },
      { title: "Supports de communication", text: "Cartes de visite, signature e-mail, documents commerciaux, présentations : votre identité appliquée à vos outils du quotidien." },
      { title: "Réseaux sociaux", text: "Photo de profil, bannières et modèles de publications aux couleurs de votre marque." },
      { title: "Site internet assorti", text: "Votre nouvelle identité prolongée sur un site sur mesure, conçu par la même équipe." },
    ],
    steps: [
      { title: "Échange", text: "Nous parlons de votre activité, de vos clients, de vos valeurs et des images qui vous ressemblent, ou pas." },
      { title: "Pistes", text: "Plusieurs directions créatives vous sont présentées, chacune expliquée." },
      { title: "Affinage", text: "La piste retenue est travaillée avec vous jusqu’à la version finale." },
      { title: "Charte", text: "Les couleurs, typographies et règles d’usage sont réunies dans un guide clair." },
      { title: "Livraison", text: "Tous les fichiers sont livrés, prêts pour l’écran, l’impression et les réseaux sociaux." },
    ],
    forWhom: [
      { title: "Entreprises qui se lancent", text: "Partir avec une image professionnelle dès le premier jour, sur tous vos supports." },
      { title: "Artisans et commerces", text: "Un logo qui se lit sur un véhicule, une enseigne, un devis ou un écran de téléphone." },
      { title: "Entreprises qui ont grandi", text: "Une image qui n’a pas suivi l’évolution de l’entreprise mérite une identité à sa mesure." },
      { title: "Professions libérales et cabinets", text: "Une image sobre et rassurante, qui inspire confiance avant le premier rendez-vous." },
    ],
    included: [
      "Un logo original, créé pour vous, sans banque d’images ni modèle",
      "Les déclinaisons du logo : couleur, noir, blanc, version compacte",
      "Une palette de couleurs et des typographies choisies pour l’écran et l’impression",
      "Une charte graphique simple, utilisable par vous et vos prestataires",
      "Les fichiers livrés dans les formats utiles : vectoriel pour l’impression, images pour le web et les réseaux",
      "Les droits d’utilisation précisés dans le devis",
    ],
    local:
      "Le studio est installé à Fondettes, aux portes de Tours. Nous rencontrons volontiers les entreprises de Tours, Joué-lès-Tours, Saint-Cyr-sur-Loire, Chambray-lès-Tours, Amboise et du reste de l’Indre-et-Loire, et nous travaillons à distance avec des clients partout en France.",
    faq: [
      { q: "Combien coûte la création d’un logo ?", a: "Cela dépend de ce que vous attendez : un logo seul, ou une identité complète avec charte et supports. Après un premier échange, vous recevez un devis détaillé et gratuit." },
      { q: "Serai-je propriétaire de mon logo ?", a: "Les droits d’utilisation et les fichiers livrés sont précisés dans le devis, avant le début du travail. Vous savez dès le départ ce que vous pourrez faire de votre logo." },
      { q: "Pouvez-vous moderniser mon logo actuel ?", a: "Oui. Une refonte peut garder ce que vos clients reconnaissent déjà, tout en rendant votre image plus actuelle et plus lisible." },
      { q: "Faites-vous aussi le site internet ?", a: "Oui. C’est même l’intérêt de travailler avec un seul studio : l’identité visuelle et le site sont pensés ensemble, pour une image cohérente partout." },
      { q: "Travaillez-vous avec des entreprises en dehors de Tours ?", a: "Oui. Nous travaillons avec des entreprises partout en France, en visioconférence. Pour les entreprises de Touraine, nous pouvons aussi nous rencontrer sur place." },
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
    headings: {
      offers: "Les solutions d’IA que nous intégrons.",
      forWhom: "À qui s’adresse l’IA que nous intégrons.",
      steps: "Comment se déroule un projet d’IA.",
      included: "Ce que comprend chaque projet d’IA.",
      local: "Votre agence IA à Tours, en Touraine et partout en France.",
      faq: "Questions fréquentes sur l’IA en entreprise.",
    },
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
      "Développement d’applications à Tours : applications mobiles iOS et Android, applications web, logiciels en ligne et outils métiers sur mesure, de la maquette aux stores.",
    keywords: [
      "développement application Tours",
      "création application mobile Tours",
      "développement application web",
      "développeur iOS Android Tours",
      "création logiciel en ligne",
      "logiciel sur mesure Indre-et-Loire",
    ],
    h1: ["Développement d’applications", "mobiles et web à Tours"],
    headings: {
      offers: "Les applications que nous développons.",
      forWhom: "À qui s’adressent nos applications.",
      steps: "Comment nous développons votre application.",
      included: "Ce que comprend chaque application.",
      local: "Développement d’applications à Tours, en Touraine et partout en France.",
      faq: "Questions fréquentes sur le développement d’applications.",
    },
    intro:
      "FDA Studio crée des applications sur mesure : applications mobiles iOS et Android, applications web, logiciels en ligne, tableaux de bord et outils métiers. Le même studio s’occupe du design, du développement et de la publication.",
    serviceType: "Développement d'applications",
    offers: [
      { title: "Application mobile", text: "Pour iPhone, iPad et Android, publiée sur l’App Store et Google Play." },
      { title: "Application web", text: "Accessible depuis un navigateur, sans installation, sur ordinateur comme sur téléphone." },
      { title: "Logiciel en ligne", text: "Un logiciel accessible en ligne, avec comptes utilisateurs, abonnements et espace d’administration." },
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
  {
    slug: "crm-sur-mesure-tours",
    name: "CRM sur mesure",
    title: "CRM sur mesure à Tours — Logiciel de suivi client | FDA Studio",
    description:
      "CRM sur mesure à Tours : contacts, devis, relances, agenda et application iPhone, pensés pour votre façon de vendre. Agent vocal et IA branchés. Devis gratuit.",
    keywords: [
      "CRM sur mesure Tours",
      "logiciel CRM sur mesure",
      "création CRM",
      "CRM PME",
      "logiciel de gestion client sur mesure",
      "CRM artisan",
    ],
    h1: ["CRM sur mesure", "pour les entreprises de Tours"],
    headings: {
      offers: "Ce que fait un CRM conçu pour vous.",
      forWhom: "Pour qui un CRM sur mesure a du sens.",
      steps: "Comment nous construisons votre CRM.",
      included: "Ce que comprend chaque CRM.",
      local: "Un CRM conçu près de Tours, utilisé partout.",
      faq: "Questions fréquentes sur le CRM sur mesure.",
    },
    intro:
      "Un CRM du marché vous oblige à travailler comme il l’a prévu. FDA Studio conçoit des CRM sur mesure qui suivent votre façon de vendre : vos étapes, vos documents, vos relances, sur ordinateur et sur iPhone. Le studio utilise chaque jour son propre CRM, conçu et développé ici.",
    serviceType: "Développement de CRM sur mesure",
    offers: [
      { title: "Fiches clients et prospects", text: "Coordonnées, historique des échanges, documents et prochaine action au même endroit, retrouvés en quelques secondes." },
      { title: "Devis et suivi des ventes", text: "De la demande au devis signé : chaque étape de votre cycle de vente, avec les montants et les relances à faire." },
      { title: "Relances automatiques", text: "E-mails et rappels envoyés au bon moment, selon vos règles, pour qu’aucune demande ne reste sans réponse." },
      { title: "Agenda et rendez-vous", text: "Rendez-vous reliés aux fiches clients, rappels envoyés, synchronisation avec votre agenda habituel." },
      { title: "Application mobile", text: "Le CRM dans la poche, pour consulter une fiche ou noter un échange juste après un rendez-vous." },
      { title: "IA et agent vocal branchés", text: "Les appels pris par l’agent vocal et les demandes du site arrivent directement dans le CRM, résumées et classées." },
    ],
    steps: [
      { title: "Observation", text: "Nous regardons comment vous vendez aujourd’hui : tableurs, carnets, e-mails, logiciels déjà en place." },
      { title: "Cadrage", text: "Nous définissons ensemble la première version : les écrans, les étapes et les automatismes utiles dès le premier jour." },
      { title: "Maquettes", text: "Vous validez les écrans avant le développement, avec les personnes qui utiliseront l’outil." },
      { title: "Reprise des données", text: "Vos contacts et votre historique sont importés depuis vos fichiers ou votre ancien outil." },
      { title: "Mise en service et suivi", text: "Prise en main par l’équipe, ajustements après les premières semaines, puis évolutions au fil des besoins." },
    ],
    forWhom: [
      { title: "Entreprises qui suivent leurs clients sur tableur", text: "Quand le fichier devient trop lourd, que plusieurs personnes le modifient et que les relances se perdent." },
      { title: "Équipes que les CRM du marché ne satisfont pas", text: "Trop de fonctions inutiles, pas celle dont vous avez besoin, et un abonnement par utilisateur qui augmente avec l’équipe." },
      { title: "Artisans et entreprises de services", text: "Demandes de devis, visites, chantiers ou interventions : un suivi simple, utilisable depuis le téléphone." },
      { title: "Entreprises qui veulent brancher l’IA", text: "Un CRM qui reçoit les appels résumés, les e-mails triés et les demandes du site, sans ressaisie." },
    ],
    included: [
      "Un cadrage écrit de la première version et des maquettes validées",
      "L’import de vos contacts et de votre historique existants",
      "Des accès par utilisateur, avec des droits adaptés à chaque rôle",
      "Des sauvegardes régulières et des données protégées",
      "Une version web et, si utile, une application iPhone",
      "Le code, les données et les accès à votre nom",
      "Un accompagnement pour la prise en main et les évolutions",
    ],
    local:
      "Le studio est installé à Fondettes, aux portes de Tours. Nous rencontrons volontiers les équipes de Touraine pour observer leur façon de travailler, et nous accompagnons à distance des entreprises d’Orléans, du Mans et de toute la France.",
    faq: [
      { q: "Pourquoi un CRM sur mesure plutôt qu’un logiciel du marché ?", a: "Un logiciel du marché convient quand votre façon de vendre ressemble à celle qu’il a prévue. Un CRM sur mesure se justifie quand vous adaptez votre travail à l’outil plutôt que l’inverse, ou quand le coût par utilisateur grimpe avec l’équipe. Nous vous disons franchement si un outil existant suffit." },
      { q: "Combien coûte un CRM sur mesure ?", a: "Cela dépend du nombre d’écrans, des automatismes et des branchements. Après un premier échange, vous recevez un devis détaillé et gratuit." },
      { q: "Pouvez-vous reprendre nos données actuelles ?", a: "Oui : contacts, historique et documents sont importés depuis vos tableurs ou votre ancien logiciel, dès qu’un export est possible." },
      { q: "Le CRM fonctionnera-t-il sur téléphone ?", a: "Oui. La version web s’utilise sur tous les écrans, et une application iPhone peut être ajoutée pour un usage sur le terrain." },
      { q: "Peut-on y brancher un agent vocal ou un chatbot ?", a: "Oui, c’est l’un des intérêts du sur-mesure : les appels pris par l’agent vocal et les demandes du site arrivent directement dans les bonnes fiches." },
      { q: "À qui appartiennent les données ?", a: "À vous. Les données, le code et les accès sont à votre nom, et vous pouvez exporter vos données à tout moment." },
    ],
    demo: { href: "/#creations", label: "Voir la démo du CRM" },
  },
  {
    slug: "referencement-naturel-tours",
    name: "Référencement naturel (SEO)",
    title: "Référencement naturel à Tours — Agence SEO et local | FDA Studio",
    description:
      "Référencement naturel à Tours : audit SEO, corrections techniques, contenus, fiche Google Business et visibilité dans les réponses des IA. Sans promesse de position.",
    keywords: [
      "référencement naturel Tours",
      "agence SEO Tours",
      "référencement local Tours",
      "audit SEO",
      "référencement Google Business Profile",
      "visibilité IA GEO",
    ],
    h1: ["Référencement naturel", "à Tours et en Touraine"],
    headings: {
      offers: "Ce que nous faisons pour votre référencement.",
      forWhom: "À qui s’adresse notre accompagnement SEO.",
      steps: "Comment se déroule un accompagnement SEO.",
      included: "Ce que comprend chaque accompagnement.",
      local: "Référencement local à Tours, Orléans et Le Mans.",
      faq: "Questions fréquentes sur le référencement.",
    },
    intro:
      "Être trouvé sur Google quand un client cherche ce que vous faites, près de chez lui. FDA Studio travaille le référencement naturel de bout en bout : technique, contenus, fiche Google et visibilité dans les réponses des assistants d’IA. Des actions mesurées dans votre Search Console, sans jargon ni promesse de première place.",
    serviceType: "Référencement naturel (SEO)",
    offers: [
      { title: "Audit SEO", text: "Indexation, vitesse, balises, structure, contenus et concurrence : un état des lieux classé par priorité, avec ce qui bloque d’abord." },
      { title: "Corrections techniques", text: "Plan du site, adresses, redirections, données structurées, vitesse sur mobile : corrigé directement quand nous avons accès au site." },
      { title: "Contenus qui répondent", text: "Pages de service et articles écrits pour les questions que posent vraiment vos clients, sans remplissage." },
      { title: "Référencement local", text: "Fiche Google Business Profile, cohérence de vos coordonnées sur les annuaires, pages par ville utiles et non dupliquées." },
      { title: "Visibilité dans les IA", text: "Informations claires et vérifiables sur votre entreprise, pour être compris et cité par les assistants comme ChatGPT, Perplexity ou Gemini." },
      { title: "Suivi mesuré", text: "Impressions, clics et positions lus dans votre Search Console, et un point régulier sur ce qui a été fait et ce qui a changé." },
    ],
    steps: [
      { title: "Accès et mesure", text: "Search Console et outils de mesure branchés : on part des données réelles, pas d’impressions." },
      { title: "Audit", text: "Les problèmes sont classés : bloquant, important, mineur, avec le gain attendu de chaque correction." },
      { title: "Corrections", text: "Les corrections techniques passent en premier ; elles conditionnent tout le reste." },
      { title: "Contenus et local", text: "Pages et articles ciblés, fiche Google et annuaires alignés." },
      { title: "Suivi", text: "Point régulier sur les chiffres, ajustement des priorités selon ce qui fonctionne." },
    ],
    forWhom: [
      { title: "Entreprises locales invisibles sur Google", text: "Votre site existe, mais vos clients tombent sur vos concurrents quand ils cherchent votre métier dans votre ville." },
      { title: "Sites qui ont perdu du trafic", text: "Après une refonte, un changement d’adresses ou une mise à jour de Google : on cherche la cause avant de corriger." },
      { title: "Entreprises qui lancent un nouveau site", text: "Poser les bonnes bases dès le départ coûte moins cher que de corriger ensuite." },
      { title: "Dirigeants qui veulent comprendre", text: "Des rapports lisibles, des priorités claires et aucune promesse de position impossible à tenir." },
    ],
    included: [
      "Un audit écrit, classé par priorité",
      "Les corrections techniques sûres faites directement, ou listées pour votre prestataire",
      "Des contenus relus, sourcés et jamais générés en masse",
      "Aucun achat de liens ni technique risquée pour votre site",
      "Le suivi dans votre propre Search Console, à votre nom",
      "Un compte rendu qui distingue ce qui est mesuré de ce qui est estimé",
    ],
    local:
      "Le studio est installé à Fondettes, près de Tours. Nous travaillons le référencement local d’entreprises de Tours et de Touraine, et à distance pour Orléans, Le Mans et le reste de la France.",
    faq: [
      { q: "Pouvez-vous garantir la première place sur Google ?", a: "Non, et personne ne le peut honnêtement : Google décide seul de son classement. Nous mettons en place tout ce qui dépend de vous et nous mesurons les progrès dans votre Search Console." },
      { q: "Combien de temps avant de voir des résultats ?", a: "Les corrections techniques peuvent jouer en quelques semaines ; les contenus et la notoriété demandent généralement plusieurs mois. Un site neuf part de zéro et doit d’abord gagner la confiance de Google." },
      { q: "Combien coûte un accompagnement SEO ?", a: "Cela dépend de l’état du site, du nombre de pages et de la concurrence locale. Après un premier échange, vous recevez un devis détaillé et gratuit." },
      { q: "Travaillez-vous sur des sites que vous n’avez pas créés ?", a: "Oui. Nous intervenons sur la plupart des sites ; selon l’outil utilisé, nous corrigeons nous-mêmes ou transmettons une liste précise à votre prestataire." },
      { q: "Qu’est-ce que la visibilité dans les IA ?", a: "Les assistants comme ChatGPT ou Perplexity citent des entreprises dans leurs réponses. Ils s’appuient sur des informations claires, cohérentes et vérifiables : c’est ce que nous travaillons, sans pouvoir garantir une recommandation." },
      { q: "Achetez-vous des liens ?", a: "Non. Les liens achetés ou échangés exposent votre site à une pénalité. Nous cherchons des mentions réelles : partenaires, annuaires sérieux, presse locale." },
    ],
  },
  {
    slug: "securite-site-internet-tours",
    name: "Sécurité de site et d’application",
    title: "Audit de sécurité de site internet à Tours | FDA Studio",
    description:
      "Audit de sécurité de site internet et d’application à Tours : configuration, mises à jour, accès, sauvegardes et messagerie vérifiés, puis corrigés.",
    keywords: [
      "audit sécurité site internet Tours",
      "sécurité site internet",
      "audit sécurité application",
      "cybersécurité PME Tours",
      "sécuriser son site web",
      "audit configuration site",
    ],
    h1: ["Sécurité de site internet", "et d’application à Tours"],
    headings: {
      offers: "Ce que nous vérifions et corrigeons.",
      forWhom: "À qui s’adresse un audit de sécurité.",
      steps: "Comment se déroule un audit.",
      included: "Ce que comprend chaque audit.",
      local: "Sécurité des sites et applications à Tours et partout en France.",
      faq: "Questions fréquentes sur la sécurité d’un site.",
    },
    intro:
      "Un site piraté, c’est un site hors ligne, des données exposées et une confiance à reconstruire. FDA Studio vérifie la sécurité de votre site internet, de vos applications et des services qui les entourent, puis corrige ce qui doit l’être. Avec votre autorisation écrite, sur vos seuls systèmes, et un rapport compréhensible par un dirigeant.",
    serviceType: "Audit de sécurité de site internet et d’application",
    offers: [
      { title: "Configuration du site", text: "HTTPS, en-têtes de sécurité, redirections, fichiers exposés par erreur : les réglages qui ferment les portes les plus courantes." },
      { title: "Mises à jour et dépendances", text: "CMS, extensions et bibliothèques vérifiés : les failles connues sont repérées et la mise à jour planifiée." },
      { title: "Comptes et accès", text: "Mots de passe, double authentification, comptes inutilisés, droits trop larges sur l’hébergement et les outils." },
      { title: "Formulaires et données", text: "Protection contre le spam et les envois abusifs, données personnelles collectées au strict nécessaire." },
      { title: "Messagerie du domaine", text: "Vérification des réglages qui empêchent d’usurper vos adresses e-mail, et recommandations si un réglage manque." },
      { title: "Sauvegardes et reprise", text: "Des sauvegardes qui existent vraiment, testées, et un plan simple si le site tombe." },
    ],
    steps: [
      { title: "Autorisation", text: "Le périmètre est fixé par écrit : quels sites, quelles applications, quels comptes. Rien n’est testé en dehors." },
      { title: "Vérifications", text: "Contrôle de la configuration, des versions, des accès et des sauvegardes, sans perturber le service." },
      { title: "Rapport", text: "Chaque problème classé par gravité, expliqué simplement, avec la correction à apporter." },
      { title: "Corrections", text: "Nous corrigeons ce qui relève de nos compétences, ou transmettons une liste précise à votre prestataire." },
      { title: "Contrôle", text: "Une seconde vérification confirme que les corrections sont bien en place." },
    ],
    forWhom: [
      { title: "Entreprises dont le site n’a pas été mis à jour depuis longtemps", text: "Un site oublié reste en ligne, et ses failles avec lui." },
      { title: "Sites qui collectent des données", text: "Formulaires, comptes clients, paiements : des données à protéger, et des obligations à respecter." },
      { title: "Entreprises qui lancent une application", text: "Vérifier les accès et les règles de données avant d’ouvrir aux utilisateurs plutôt qu’après un incident." },
      { title: "Dirigeants qui veulent savoir où ils en sont", text: "Un état des lieux clair, sans jargon, pour décider quoi corriger d’abord." },
    ],
    included: [
      "Un périmètre écrit et votre autorisation avant toute vérification",
      "Un rapport classé par gravité, lisible par un dirigeant",
      "Des corrections faites ou détaillées pour votre prestataire",
      "Une seconde vérification après correction",
      "Aucun secret ni mot de passe copié ou conservé",
      "Une orientation vers un prestataire qualifié quand la situation l’exige",
    ],
    local:
      "Le studio est installé à Fondettes, près de Tours. Nous intervenons pour des entreprises de Touraine, d’Orléans, du Mans et de toute la France, à distance la plupart du temps.",
    faq: [
      { q: "Faites-vous des tests d’intrusion certifiés ?", a: "Non. Nous ne sommes pas un prestataire qualifié PASSI. Si votre assureur, un client ou une réglementation exige un test d’intrusion qualifié, nous vous le disons et vous orientons vers un prestataire adapté." },
      { q: "L’audit peut-il casser mon site ?", a: "Les vérifications sont choisies pour ne pas perturber le service. Toute intervention qui pourrait l’interrompre est annoncée et planifiée avec vous." },
      { q: "Combien coûte un audit de sécurité ?", a: "Cela dépend du nombre de sites, d’applications et de services à vérifier. Après un premier échange, vous recevez un devis détaillé et gratuit." },
      { q: "Mon site a été piraté : pouvez-vous aider ?", a: "Signalez d’abord l’incident sur cybermalveillance.gouv.fr, qui oriente vers des prestataires d’urgence. Nous pouvons ensuite aider à remettre le site en ligne proprement et à fermer la faille." },
      { q: "Vérifiez-vous des sites que vous n’avez pas créés ?", a: "Oui, avec l’autorisation écrite du propriétaire et les accès nécessaires. Nous n’intervenons jamais sur un système sans cette autorisation." },
    ],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
