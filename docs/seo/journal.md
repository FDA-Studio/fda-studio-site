# Journal SEO — fdastudio.fr

Le plus récent en haut. Une ligne par passage de l'agent, un bloc par rapport mensuel.

- 2026-11-24 (mardi, passage planifié, tâche du Bureau) — Article « Automatiser ses devis et relances : méthode et coût
  pour une PME en 2026 » (slug automatiser-devis-relances ; mot-clé principal : automatiser ses devis et relances ;
  ~1 550 mots ; PR #86 fusionnée, en ligne vers 08:52 UTC). Anti-doublon : 9 articles existants, aucune PR ouverte, aucun article sur l'automatisation. Le sujet
  voisin « Make, Zapier ou n8n » reste à faire : l'article ne donne que les tarifs d'entrée, sans comparatif.
  Sources ouvertes : rapport final du baromètre France Num 2026 (88 % outil de gestion, 71 % logiciel de facturation),
  communiqué du ministère de l'Économie du 28/09/2026 (40 % utilisent l'IA, 11 % pour automatiser des tâches),
  Service Public Entreprendre F31144 (mentions du devis bâtiment, amendes), F23211 (délais de paiement, 40 €),
  A15683 (facturation électronique), pages tarifs officielles de Make, Zapier et n8n (relevées le 24/11).
  Audit : 30 pages construites, un title, une meta description et un seul H1 partout, aucun lien interne cassé,
  BlogPosting et BreadcrumbList présents ; robots.txt en ligne avec le groupe des robots IA en `Allow: /` et le
  sitemap ; /llms-full.txt en 200 ; derniers passages IndexNow verts (24/11). Accès direct à fdastudio.fr toujours
  refusé par le proxy de l'agent : vérifications en ligne faites par un service de lecture de pages.
  Suggestion hors périmètre : la page /developpement-application-tours/ (src/lib/services.ts) emploie « SaaS »
  (description, mots-clés, encadré), alors que le vocabulaire du studio dit « CRM » ou « logiciel en ligne » ;
  le sujet du plan « MVP : lancer un SaaS » est à renommer le jour où il sera traité.
- 2026-11-20 (après-midi, Antoine : « il faut qu'on soit ultra bien référencé pour toutes les IA ») — Accès vérifié :
  17 signatures de robots (OpenAI, Anthropic, Perplexity, Mistral, Google, Bing, Apple…) reçoivent un 200 sur
  l'accueil, une page de service, /llms.txt et un article ; aucun blocage Vercel ; DNS chez Vercel (pas de proxy
  Cloudflare) ; pages lisibles sans JavaScript, FAQ comprises. Constat : « FDA Studio » renvoie surtout au studio
  vidéo de la FDA américaine. Branche `ia-visibilite-2026-11-20` : robots.txt avec un groupe explicite pour les robots
  IA (sans changement d'effet), JSON-LD Organization complété (désambiguïsation, création 2026, SIREN, langue,
  fondateur décrit en entier), /a-propos/ : fiche d'identité complétée et 7 questions fréquentes sur le studio
  (FAQPage), /llms.txt avec faits clés et désambiguïsation, nouveau /llms-full.txt (texte intégral, noindex),
  AGENT.md : règles d'écriture pour être cité par les IA et contrôle IA dans l'audit du mardi (PR #76).
  Relevé dans les IA (navigateur d'Antoine) : sur « meilleures agences web à Tours », le mode IA de Google et
  ChatGPT citent Sortlist, La Fabrique du Net et les notes Google des agences, sans FDA Studio ; sur « Qu'est-ce
  que FDA Studio ? », les deux répondent juste à partir de la fiche Sortlist et de l'annuaire des entreprises.
  Les fiches Sortlist et La Fabrique du Net indiquent « Chemin de la Bondé » au lieu de « La Bonde » et n'ont
  aucun avis. Fiches déclarées en sameAs et affichées sur /a-propos/ (PR suivante).
- 2026-11-20 (midi, demande d'Antoine : « regarde si tout est bien indexé ») — Vérifié dans Search Console et Bing
  Webmaster Tools (navigateur d'Antoine). Google, inspection d'URL : 13 pages indexées (accueil, 3 services historiques,
  /ressources/, Orléans, Le Mans, 4 pages métiers, /a-propos/, choisir-agence-web-tours) ; non indexées : les 5 pages
  du 20/11 et la plupart des articles (« inconnue de Google » ou « détectée, non indexée »). Indexation demandée pour
  10 URL (IA Orléans, IA Le Mans, CRM, référencement, sécurité, étude de cas kinésiologue, prix site vitrine,
  choisir agence IA, prix agent vocal, prix application mobile) ; sitemap renvoyé : relu le 20/11, 28 pages découvertes.
  Bing : seule l'accueil est indexée ; IndexNow a bien reçu les 28 URL ; 26 URL soumises à la main (quota 100/jour)
  et sitemap renvoyé (dernière lecture 12/11, 9 URL). Ne pas redemander l'indexation des mêmes URL avant une semaine.
- 2026-11-20 (10 h, demande d'Antoine) — Étude de cas publiée : site d'Alexandra Degans, kinésiologue à Bassens et
  Myans près de Chambéry (https://alexandradegans-kinesiologie.com/), réalisé par FDA Studio ; accord de la cliente
  pour apparaître comme réalisation confirmé par Antoine. Faits relevés sur le site en ligne le 20/11 (navigateur) :
  14 pages au plan du site, 6 soins, 2 cabinets, réservation en 4 étapes avec règlement en ligne, données
  structurées HealthAndBeautyBusiness, robots.txt ouvert, lien « Site réalisé par FDA Studio — Antoine Donabella »
  vers fdastudio.fr en pied de page (lien suivi). Le domaine en .fr ne résout pas (NXDOMAIN) : le site est en .com.
  Troisième article de la semaine (17, 18, 20/11) : plafond de 2 dépassé à la demande d'Antoine pour une réalisation.
  Décision d'Antoine : pas de connecteur Ahrefs ni Semrush ; volumes et liens par exports gratuits (Keyword Planner,
  Search Console, Bing Webmaster Tools).
- 2026-11-20 (vendredi, passage planifié) — Pas d'article : plafond de 2 par semaine déjà atteint
  (17 et 18/11). Aucune PR ouverte sur le dépôt. Pas d'audit (vendredi). Reprise au passage du
  mardi 24/11 avec le premier sujet P1 `à faire` du plan, après contrôle anti-doublon.
- 2026-11-20 (suite, Antoine : « fais tous les points ») — PR #71 : 3 pages de service (/crm-sur-mesure-tours/,
  /referencement-naturel-tours/, /securite-site-internet-tours/) et 2 pages locales IA (/agence-ia-orleans/,
  /agence-ia-le-mans/), toutes vérifiées en ligne ; 9 sujets ajoutés au plan pour ces services ; AGENT.md : ces
  services sont autorisés dans l'en-tête `service:` des articles. PR #72 : llms.txt avec les pages par ville et
  par métier (vérifié en ligne), titres de partage sans « | FDA Studio » en double, IndexNow déclenché aussi par
  src/lib/local-pages.ts. Tâche planifiée créée : « Rapport SEO hebdomadaire — fdastudio.fr » (lundi 7 h 52,
  Search Console via Windsor.ai, rapport dans docs/seo/rapports.md). Reste chez Antoine : activer la mesure des
  visites (Vercel → Analytics), fiche Google, avis, annuaires, connexion Ahrefs ; textes prêts dans le projet
  claude.ai (« seo-kit-fiches-presse-2026-11-20 »).
- 2026-11-20 (nuit, passage « seo-autopilot » demandé par Antoine, en autonomie) — Pas d'article : 2 déjà
  publiés cette semaine (17 et 18/11) et passage planifié du vendredi à venir ; plafond respecté. Audit des
  27 pages construites : un title, une description et un seul H1 partout, canoniques, JSON-LD valide, aucun
  lien interne cassé. Corrigé (PR de corrections du 20/11) : (1) texte des H1 collé pour les robots qui lisent
  le HTML sans CSS (« IApour », « À proposde ») sur les 9 pages de service et locales et les pages à en-tête ;
  (2) lastmod du sitemap = date du build sur toutes les pages : retiré, sauf dates réelles des articles et de
  /ressources/ ; (3) directive `Host:` retirée de robots.txt ; (4) zone desservie du JSON-LD de l'entreprise
  complétée par Orléans, Loiret, Le Mans, Sarthe (déjà visés par le H1 et les pages locales) ; (5) bloc
  « Pour aller plus loin » ajouté aux 6 pages locales (articles du service correspondant ; les plus récents pour
  Orléans et Le Mans) : liens entrants des articles les moins liés passés de 2-5 à 4-7. Constat marché :
  La Fabrique du Net occupe le haut des résultats sur « agence web / IA / application Tours », « Orléans »,
  « Le Mans » ; la fiche FDA Studio en attente de validation y est le levier local le plus rapide.
- 2026-11-18 (mercredi, passage « seo-autopilot » demandé par Antoine) — Article « Comment choisir son agence
  web à Tours : 7 points à vérifier » (slug choisir-agence-web-tours ; mot-clé principal : choisir une agence
  web ; ~1 400 mots). Le mot-clé du plan « création site internet Tours » reste à la page de service
  /creation-site-internet-tours/ (gardé en secondaire, lien vers la page). Anti-doublon : 7 articles existants,
  aucune PR d'article ouverte ; sujet voisin de choisir-agence-ia-tours mais autre question (site, pas IA).
  Sources ouvertes : baromètre France Num 2026 (service-public, 2 oct. 2026), communiqué Afnic « Réussir avec
  le web » 2025, article L131-3 du CPI (Légifrance). Audit des 24 pages construites : un seul H1 partout,
  canoniques, données structurées valides, aucun lien interne cassé, sitemap cohérent. Corrigé hors agent
  (PR #63) : 6 titres d'articles de plus de 65 caractères (suffixe « | FDA Studio » retiré quand il ne tient
  pas), titre de /ressources/, 5 descriptions de pages locales de plus de 165 caractères.
- 2026-11-17 (mardi, passage agent) — Article « Comment choisir une agence IA à Tours : ce qu’elle doit vous apporter »
  (slug choisir-agence-ia-tours ; mot-clé principal : choisir une agence IA ; ~1 400 mots). Mot-clé du plan
  « agence IA Tours » remplacé : c’est le mot-clé principal de la page de service /agence-ia-tours/, l’article
  l’aurait concurrencée ; il le garde en mot-clé secondaire et renvoie vers la page. Anti-doublon : 6 articles
  existants, aucune PR ouverte. Sources : Insee Première n° 2120 (juillet 2026), Bpifrance (Diag Data IA),
  Commission européenne (article 50 du règlement IA, 2 août 2026). PR #39 fusionnée, en ligne vers 08:49 UTC.
  Audit : les 14 URL du sitemap en 200 ; un title, une meta description et un seul H1 par page (build) ;
  données structurées présentes (Organization, Service, BreadcrumbList, BlogPosting, FAQPage) ; liens internes
  sans erreur ; /mentions-legales/ volontairement en noindex et hors sitemap ; dernier IndexNow vert (15/11).
  Inchangé : directive `Host:` non standard dans robots.txt (sans risque). Note : fdastudio.fr est refusé par le
  proxy réseau de l’agent, audit en ligne fait via un service de lecture de pages.
- 2026-11-15 (suite, demande d'Antoine en autonomie) — 3 articles publiés : « Prix d'un site vitrine en 2026 »
  (PR #33 ; La Fabrique du Net, Agence Scroll, Kolonell), « Combien coûte une application mobile en 2026 ? »
  (PR #34 ; La Fabrique du Net, Lucas Fonseque), « Étude de cas : comment nous avons conçu le site fdastudio.fr »
  (PR #35 ; mesures internes du journal et des PR #15, #20, #29). Plafond de 2 articles par semaine dépassé à la
  demande d'Antoine : le prochain passage de l'agent (mardi 17/11) peut reprendre le rythme normal.
  Bug corrigé (PR #36) : sur mobile, le texte des articles était coupé à droite (colonne élargie par les tableaux,
  ~546 px sur un écran de 390 px) ; touchait aussi les articles déjà publiés. Vérifié en ligne.
- 2026-11-15 (suite) — Visibilité IA : tous les robots d'IA ont accès au site ; nom « FDA Studio » ambigu
  (FDA américaine, autres studios). PR #32 fusionnée à la demande d'Antoine : page /a-propos/ (identité,
  fondateur, groupe, produits, fiche d'identité ; AboutPage + Person), /llms.txt généré au build, hébergeur
  des mentions légales corrigé (Vercel et non GitHub Pages). Vérifié en ligne.
- 2026-11-15 — Audit SEO complet demandé par Antoine (domaine enregistré le 07/11 : visibilité quasi nulle
  attendue, 21 impressions sur 28 jours, requête de marque uniquement). Priorités côté Antoine : fiche Google
  Business Profile, sitemap dans Search Console, fiches annuaires (Sortlist, La Fabrique du Net en cours).
  PR #31 fusionnée à la demande d'Antoine : H1 de l'accueil « Agence web et IA à Tours : … », H2 propres à
  chaque page de service, auteur Person (Antoine Donabella) et image og.png dans le BlogPosting, signature
  visible des articles, téléphone 06 67 16 53 29 (pied de page + telephone), LinkedIn et Instagram en sameAs.
  Vérifié en ligne. Le numéro sera remplacé plus tard par celui de l'agent vocal : le changer aussi sur la fiche
  Google et les annuaires le même jour.
- 2026-11-13 (vendredi, passage agent) — Article « Combien coûte un chatbot IA pour le site d’une
  entreprise en 2026 ? » (slug prix-chatbot-ia-site-entreprise ; mot-clé : prix chatbot IA ; 1 338 mots).
  Anti-doublon : 2 articles existants (agent vocal), aucune PR ouverte, sujet distinct (chatbot écrit
  vs agent vocal ; lien interne vers l’article prix agent vocal). Sources : grille officielle Intercom,
  guide tarifaire eesel (juillet 2026), formules Crisp (DragApp, août 2026), Kolonell (septembre 2026).
  PR #25 fusionnée, en ligne à 08:47 UTC. Pas d’audit (vendredi).
- 2026-11-12 — Chantiers SEO demandés par Antoine, en PR à relire (hors périmètre de l'agent) :
  #15 vitesse de l'accueil (Lighthouse mobile 41-48 -> 62-68, LCP 13,7 s -> ~2,5 s) ;
  #18 pages de service enrichies (~650 -> 920-1 140 mots) et bloc « Pour aller plus loin » vers
  les articles du même service ; #19 image de partage propre à chaque article (/ressources/<slug>/og.png).
  Fusionnées et en ligne le 12/11 à la demande d'Antoine, avec #20 (entrée dans le vol dès le premier
  film chargé). Production après coup : Lighthouse mobile accueil 75-81 (avant 41), LCP ~2 s ;
  attente de la porte ~7 s mobile / ~9 s ordinateur (avant 25 s / 38 s, mesuré depuis le même serveur).
  Reste côté Antoine : fiche Google Business Profile reliée au site, sitemap déclaré dans Search Console.
- 2026-11-10 (mardi, passage agent) — Article « Agent vocal IA ou secrétariat téléphonique :
  que choisir pour votre PME ? » (mot-clé : secrétariat téléphonique IA ; sources : guides tarifaires
  Companeo, comparatif CloudTalk de septembre 2026). Premier article passé en `publié` dans le plan.
  Audit : les 8 URL du sitemap répondent en 200 (TTFB < 0,7 s), un seul H1, title et meta description
  partout, données structurées présentes (Organization, Service, BreadcrumbList, BlogPosting, FAQPage
  sur les services), 15 liens internes vérifiés sans erreur, accueil ~180 Ko HTML + ~260 Ko JS/CSS.
  Point mineur : `robots.txt` contient une directive `Host:` non standard (ignorée par Google, sans
  risque). Pas de rapport mensuel (premier mardi du mois = 3 novembre).
- 2026-11-10 — Création de la rubrique Ressources (`/ressources/`) et du premier article
  « Combien coûte un agent vocal IA pour une PME en 2026 ? ». Mise en place de l'agent SEO
  (2 articles par semaine, validation par Antoine avant publication).
