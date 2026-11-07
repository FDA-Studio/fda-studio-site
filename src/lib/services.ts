export type ServiceSlug = "web" | "ia" | "applications" | "gaming";

export type Service = {
  slug: ServiceSlug;
  name: string;
  shortName: string;
  letter: string;
  summary: string;
  seo: { title: string; description: string; keywords: string[] };
  heroLines: string[];
  intro: string;
  offers: { title: string; text: string }[];
  outcomes: { title: string; text: string }[];
  deliverables: string[];
  stack: string[];
  faq: { q: string; a: string }[];
  cta: string;
};

export const services: Service[] = [
  {
    slug: "web",
    name: "Web Design & Development",
    shortName: "Sites & expériences web",
    letter: "W",
    summary:
      "Sites corporate, vitrines haut de gamme, e-commerce et expériences immersives, conçus pour convertir et pensés pour durer.",
    seo: {
      title: "Création de site internet premium & développement web",
      description:
        "Création de sites internet sur mesure : sites corporate, vitrines haut de gamme, e-commerce, landing pages et refontes. Design premium, performance et SEO, développement Next.js.",
      keywords: ["création de site internet", "développement web", "site vitrine premium", "refonte de site", "site e-commerce", "landing page"],
    },
    heroLines: ["Des sites qui", "font la différence", "dès la première seconde."],
    intro:
      "Votre site est souvent le premier contact avec votre entreprise. Nous le concevons comme un produit : une identité forte, une navigation évidente, des pages rapides et un parcours pensé pour transformer la visite en prise de contact.",
    offers: [
      { title: "Sites corporate", text: "Présenter un groupe, ses métiers et ses engagements avec la clarté qu'attendent clients, partenaires et candidats." },
      { title: "Vitrines haut de gamme", text: "Une direction artistique sur mesure pour les marques qui ne veulent pas ressembler à leurs concurrents." },
      { title: "E-commerce", text: "Catalogue, tunnel d'achat, paiement Stripe et back-office, avec une attention particulière à la vitesse de chargement." },
      { title: "Landing pages de conversion", text: "Une page, un objectif : capter des demandes pour un lancement, une campagne ou une offre précise." },
      { title: "Refonte", text: "Audit de l'existant, reprise des contenus, redirections et conservation du référencement acquis." },
      { title: "Expériences immersives", text: "WebGL, 3D temps réel et interactions avancées quand elles servent votre message, comme sur ce site." },
    ],
    outcomes: [
      { title: "Être compris", text: "En quelques secondes, un visiteur sait ce que vous faites, pour qui, et comment vous contacter." },
      { title: "Être trouvé", text: "Structure sémantique, données structurées, vitesse : les fondations techniques du référencement sont posées dès la conception." },
      { title: "Être autonome", text: "Vous modifiez vos contenus sans dépendre de nous pour chaque virgule." },
    ],
    deliverables: ["Direction artistique et maquettes", "Design system réutilisable", "Développement responsive mobile first", "SEO technique et données structurées", "Mise en conformité RGPD (cookies, mentions)", "Mise en ligne, nom de domaine et HTTPS", "Formation à la gestion des contenus"],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Three.js / WebGL", "Stripe", "CMS headless"],
    faq: [
      { q: "Combien de temps faut-il pour créer un site ?", a: "Cela dépend du périmètre : une landing page se compte en jours, un site corporate complet en semaines. Le planning est établi précisément lors du cadrage, avant tout engagement." },
      { q: "Pourrai-je modifier mon site moi-même ?", a: "Oui. Selon votre besoin, nous intégrons un outil de gestion de contenu et nous vous formons à son utilisation." },
      { q: "Reprenez-vous un site existant ?", a: "Oui. Nous commençons par un audit (performance, référencement, contenus) pour décider s'il faut faire évoluer le site ou le reconstruire, et nous préservons votre référencement lors de la migration." },
      { q: "Où le site est-il hébergé ?", a: "Nous choisissons l'hébergement selon le projet : statique et gratuit pour un site vitrine, plateforme managée pour une application. Les données sont hébergées dans l'Union européenne lorsque c'est nécessaire." },
    ],
    cta: "Parler de mon site",
  },
  {
    slug: "ia",
    name: "AI Integration & Automation",
    shortName: "Intelligence artificielle & automatisation",
    letter: "A",
    summary:
      "Agents IA, assistants vocaux et automatisations reliés à vos outils, pour libérer du temps sur les tâches répétitives sans perdre le contrôle.",
    seo: {
      title: "Intégration de l'intelligence artificielle en entreprise & automatisation IA",
      description:
        "Agence IA : agents intelligents, assistants vocaux, chatbots, automatisation des e-mails, du CRM et des processus métier. Intégration sécurisée de l'IA dans vos systèmes existants.",
      keywords: ["intégration intelligence artificielle entreprise", "automatisation IA", "agence IA", "agent IA", "assistant vocal IA", "chatbot entreprise"],
    },
    heroLines: ["L'IA au travail,", "pas en vitrine."],
    intro:
      "Nous partons de vos processus, pas de la technologie. Où passez-vous du temps sur des tâches répétitives ? Où des demandes restent-elles sans réponse ? Nous y plaçons des agents IA reliés à vos outils, avec des règles claires et un humain qui valide ce qui compte.",
    offers: [
      { title: "Agents IA", text: "Des agents qui lisent une demande, en extraient l'essentiel et préparent l'action : fiche CRM, réponse, devis, ticket." },
      { title: "Assistants vocaux", text: "Un agent téléphonique qui répond, qualifie, prend rendez-vous et transmet un résumé à la bonne personne." },
      { title: "Automatisation des processus", text: "Relances, tri des e-mails, saisie, génération de documents : les tâches sans valeur ajoutée sont automatisées." },
      { title: "IA dans vos systèmes", text: "Connexion de l'IA à votre CRM, votre ERP, votre messagerie ou vos bases documentaires via leurs API." },
      { title: "Solutions conversationnelles", text: "Assistants sur votre site ou en interne, nourris de vos propres documents et limités à votre périmètre." },
      { title: "IA sur mesure", text: "Choix du modèle, du coût et de l'architecture selon votre besoin réel, votre volume et vos contraintes de confidentialité." },
    ],
    outcomes: [
      { title: "Du temps rendu aux équipes", text: "Les tâches répétitives sont prises en charge, vos collaborateurs se concentrent sur ce qui demande leur expertise." },
      { title: "Aucune demande oubliée", text: "Chaque message, appel ou formulaire est traité, classé et suivi, y compris en dehors des heures ouvrées." },
      { title: "Un contrôle constant", text: "Coûts plafonnés, données minimisées, journal des actions et validation humaine pour les décisions importantes." },
    ],
    deliverables: ["Audit des processus et des gains attendus", "Estimation documentée des coûts d'usage", "Agents et automatisations en production", "Connexions API à vos outils", "Garde-fous : limites, validations, journalisation", "Conformité RGPD et minimisation des données", "Suivi et amélioration continue"],
    stack: ["Claude (Anthropic)", "OpenAI", "SignalWire", "ElevenLabs", "Supabase", "Upstash", "API CRM / ERP"],
    faq: [
      { q: "Par où commencer avec l'IA ?", a: "Par un atelier de cadrage : nous identifions les tâches répétitives et les points de friction, estimons le gain et le coût, puis démarrons par le cas d'usage le plus rentable." },
      { q: "Mes données sont-elles en sécurité ?", a: "Les clés et les appels aux modèles restent côté serveur, les données envoyées sont minimisées et nous privilégions un hébergement européen. Les règles sont documentées et validées avec vous." },
      { q: "Combien coûte une IA au quotidien ?", a: "Le coût dépend du volume et du modèle choisi. Nous l'estimons avant le projet (volume × prix d'usage) et configurons des plafonds de dépense chez le fournisseur." },
      { q: "L'IA peut-elle se tromper ?", a: "Oui, comme tout système. C'est pourquoi nos agents fonctionnent dans un périmètre défini, que leurs actions sont journalisées et que les décisions importantes restent validées par un humain." },
    ],
    cta: "Automatiser un processus",
  },
  {
    slug: "applications",
    name: "Apps & Digital Products",
    shortName: "Applications & produits",
    letter: "P",
    summary:
      "Applications web et mobiles, SaaS, plateformes et outils métiers : de l'idée au produit en production, avec ses utilisateurs.",
    seo: {
      title: "Développement d'application web, mobile iOS & Android et SaaS",
      description:
        "Création d'applications mobiles iOS et Android, développement d'applications web, SaaS, dashboards et outils métiers sur mesure. De la maquette à la mise en production.",
      keywords: ["création application mobile", "développement application web", "développement SaaS", "application iOS Android", "outil métier sur mesure", "dashboard"],
    },
    heroLines: ["De l'idée", "au produit", "qu'on utilise."],
    intro:
      "Un bon produit numérique résout un problème précis pour des utilisateurs précis. Nous vous aidons à le définir, à le concevoir et à le construire par étapes, pour mettre une première version entre les mains de vrais utilisateurs le plus tôt possible.",
    offers: [
      { title: "Applications web", text: "Des interfaces rapides et accessibles depuis n'importe quel navigateur, pour vos clients ou vos équipes." },
      { title: "Applications mobiles", text: "iOS et Android, avec une expérience pensée pour le pouce, les notifications et l'usage hors connexion." },
      { title: "SaaS", text: "Comptes, abonnements, rôles et facturation : l'architecture d'un produit vendu par abonnement." },
      { title: "Dashboards", text: "Vos indicateurs clés réunis, lisibles et à jour, au lieu de tableurs dispersés." },
      { title: "Outils métiers", text: "Le logiciel qui épouse vos processus plutôt que l'inverse : planning, suivi, devis, interventions." },
      { title: "Systèmes connectés", text: "Connexion à vos API, objets, paiements et services tiers, avec une sécurité pensée dès le départ." },
    ],
    outcomes: [
      { title: "Un produit livré par étapes", text: "Une première version utile rapidement, puis des évolutions guidées par l'usage réel." },
      { title: "Une base saine", text: "TypeScript, tests, migrations versionnées : un code que d'autres développeurs peuvent reprendre." },
      { title: "La sécurité par défaut", text: "Authentification, permissions et règles d'accès aux données vérifiées côté serveur." },
    ],
    deliverables: ["Cadrage produit et user stories", "Prototype interactif", "Design system et interfaces", "Développement web et mobile", "Base de données et règles d'accès", "Tests des parcours critiques", "Publication sur les stores", "Maintenance et évolutions"],
    stack: ["Next.js", "React Native", "TypeScript", "Supabase", "PostgreSQL", "Stripe", "Vercel"],
    faq: [
      { q: "Faut-il une application mobile ou une application web ?", a: "Cela dépend de l'usage : fréquence, besoin de notifications, de l'appareil photo ou du mode hors connexion. Nous vous aidons à trancher lors du cadrage, parfois au profit d'une application web installable." },
      { q: "Qui est propriétaire du code ?", a: "Vous. La propriété intellectuelle vous est cédée à l'issue du projet, et le code est livré dans un dépôt à votre nom ou accessible à vos équipes." },
      { q: "Pouvez-vous publier sur l'App Store et Google Play ?", a: "Oui, nous accompagnons la création des comptes développeur, la préparation des fiches et la soumission aux stores." },
      { q: "Assurez-vous la maintenance ?", a: "Oui, avec une garantie corrective après livraison, puis une maintenance optionnelle pour les mises à jour, la sécurité et les évolutions." },
    ],
    cta: "Lancer mon application",
  },
  {
    slug: "gaming",
    name: "Gaming & Interactive Experiences",
    shortName: "Gaming & interactif",
    letter: "G",
    summary:
      "Jeux mobiles 3D, multijoueur et expériences interactives. Nous concevons nos propres univers, à commencer par Door Knight.",
    seo: {
      title: "Développement de jeux vidéo mobiles 3D & expériences interactives",
      description:
        "Studio de développement de jeux vidéo : jeux mobiles 3D, multijoueur, game design, développement Unity et expériences interactives. Créateur de Door Knight.",
      keywords: ["développement jeux vidéo", "studio jeu mobile", "jeu mobile 3D", "développement Unity", "jeu multijoueur", "expérience interactive"],
    },
    heroLines: ["Des mondes", "qu'on a envie", "d'explorer."],
    intro:
      "Le jeu vidéo est le terrain le plus exigeant du numérique : performance temps réel, systèmes de progression, économie, serveurs, direction artistique. Nous l'avons choisi comme laboratoire, en développant nos propres jeux. Ce que nous y apprenons nourrit tous nos projets.",
    offers: [
      { title: "Jeux mobiles 3D", text: "Des jeux pensés pour le téléphone : sessions courtes, contrôles tactiles, performance sur des appareils variés." },
      { title: "Multijoueur", text: "Comptes, sauvegarde en ligne, guildes et classements : les systèmes qui font vivre une communauté." },
      { title: "Game design", text: "Boucles de jeu, progression, équilibrage et économie, documentés et testés." },
      { title: "Développement Unity", text: "Production de jeux 3D multiplateformes, de l'optimisation des scènes à la publication." },
      { title: "Expériences interactives", text: "Installations, configurateurs 3D et expériences web temps réel pour les marques." },
      { title: "Produits propriétaires", text: "Nous concevons, éditons et exploitons nos propres jeux." },
    ],
    outcomes: [
      { title: "L'exigence du temps réel", text: "Soixante images par seconde ne se négocient pas : nous savons optimiser là où ça compte." },
      { title: "Des systèmes complets", text: "Gameplay, serveurs, achats intégrés et suivi : un jeu est un produit complet." },
      { title: "Un savoir-faire transversal", text: "La 3D et les interactions du jeu enrichissent nos sites et nos applications." },
    ],
    deliverables: ["Concept et game design document", "Prototype jouable", "Direction artistique", "Production et intégration", "Systèmes en ligne", "Tests et bêta", "Publication sur les stores"],
    stack: ["Unity", "C#", "Three.js", "WebGL", "Supabase", "TestFlight"],
    faq: [
      { q: "Développez-vous des jeux pour d'autres entreprises ?", a: "Nous développons d'abord nos propres jeux. Pour un projet de jeu, d'expérience interactive ou de 3D temps réel pour votre marque, parlons-en : nous étudions chaque demande." },
      { q: "Où en est Door Knight ?", a: "Door Knight 2.0 est en développement sur iPhone, iPad et Android. Une version est jouable en bêta via TestFlight. Les informations à jour sont sur doorknight.games." },
      { q: "Quels moteurs utilisez-vous ?", a: "Unity pour les jeux 3D multiplateformes, et Three.js / WebGL pour les expériences dans le navigateur." },
    ],
    cta: "Parler d'un projet interactif",
  },
];

export const getService = (slug: ServiceSlug) => services.find((s) => s.slug === slug)!;
