---
title: Étude de cas : comment nous avons conçu le site fdastudio.fr
description: Design immersif, vitesse sur mobile, référencement local et démonstrations d’IA : les choix, les erreurs et les mesures derrière notre propre site.
date: 2026-11-15
service: creation-site-internet-tours
keywords: [étude de cas site internet, site internet immersif, site rapide sur mobile, création site agence Tours]
---

Le site fdastudio.fr est notre premier projet, et nous l’avons traité comme celui d’un client : un objectif commercial, des contraintes, des mesures avant et après. Il a été mis en ligne en novembre 2026. En quelques jours d’optimisation, la note de performance mobile de sa page d’accueil est passée de **41 à 75-81 sur 100** et l’affichage de son élément principal de **13,7 s à environ 2 s**. Voici les choix que nous avons faits, ce qui n’a pas marché du premier coup, et ce que vous pouvez en retenir pour votre propre site.

## Le point de départ : un objectif, pas une liste de pages

Le site devait faire trois choses :

1. **Montrer plutôt que décrire.** Une agence qui vend de l’IA et des expériences interactives doit le prouver dès l’accueil.
2. **Faire venir des demandes de devis** de dirigeants de PME, à Tours et ailleurs en France.
3. **Être trouvé sur Google** sur des recherches précises : création de site, agence IA, développement d’application, à Tours.

Ces trois objectifs se contredisent en partie. Une page d’accueil spectaculaire est lourde ; une page lourde est lente sur mobile ; une page lente perd des visiteurs et des positions sur Google. Tout le projet a consisté à arbitrer entre les trois.

## Les choix de conception

### Une page d’accueil qui se parcourt comme un film

L’accueil est un film en six scènes qui avance au défilement, avec une porte d’entrée animée. Le contenu de chaque scène existe aussi en texte dans la page, rendu côté serveur : Google et les lecteurs d’écran lisent le même contenu que ce que voient les visiteurs.

### Des démonstrations utilisables, pas des captures d’écran

Plutôt que de décrire nos agents IA, nous les avons mis en ligne : un agent vocal à qui l’on peut parler, un assistant écrit qui enregistre réellement une demande et propose un créneau, une démonstration de CRM. Un prospect peut juger par lui-même en deux minutes.

### Une page par service, pensée pour la recherche locale

Chaque service a sa page : [création de site internet à Tours](/creation-site-internet-tours/), [agence IA à Tours](/agence-ia-tours/), [développement d’applications à Tours](/developpement-application-tours/). Chacune répond aux questions d’un prospect : ce que nous réalisons, pour qui, comment se déroule un projet, ce qui est inclus, questions fréquentes.

### Une technique simple à exploiter

Le site est développé avec Next.js et publié en pages statiques sur Vercel. Il n’y a ni base de données ni serveur à maintenir pour les pages : elles sont générées à l’avance, ce qui les rend rapides et peu exposées aux attaques. Chaque modification validée est mise en ligne automatiquement en quelques minutes.

## Ce qui n’a pas marché du premier coup

### La vitesse sur mobile

À la mise en ligne, la page d’accueil obtenait une note Lighthouse mobile de 41 sur 100, et son élément principal mettait 13,7 secondes à s’afficher. Les pages de service, elles, étaient déjà à 99. Trois causes, trouvées en analysant le chargement :

- le navigateur prenait pour élément principal une image cachée sous l’écran d’arrivée, qui dépendait de tout le JavaScript ;
- la première image visible était chargée en différé, en concurrence avec les quelque 1 200 images du film ;
- l’écran d’arrivée était redessiné environ 1 200 fois pendant le chargement.

Une fois ces trois points corrigés, l’élément principal s’affichait en 2,4 à 2,9 secondes. Restait l’attente avant d’entrer : la porte attendait que les six scènes du film soient chargées, soit environ 34 Mo sur mobile, ce qui prenait 25 secondes sur mobile même avec une bonne connexion. Nous avons donc ouvert la porte dès la première scène chargée, les suivantes arrivant pendant la visite. Les mesures en production du 12 novembre 2026 donnaient alors une note de **75 à 81** et un élément principal affiché en **2 secondes environ**.

### Un compromis à assumer

Cette deuxième correction a créé un autre problème, signalé en testant sur de vrais téléphones : sur une connexion moyenne, le visiteur arrivait à une scène avant son film, qui restait figé puis sautait. Nous avons choisi la fluidité : le site mesure désormais le débit réel et n’ouvre la porte que lorsque chaque scène sera prête à temps. Sur une connexion rapide, l’entrée prend 2 à 6 secondes d’après nos mesures sur ordinateur ; sur une connexion lente, l’attente est plus longue, mais le film n’est jamais figé.

C’est un choix assumé pour une agence qui vend des expériences interactives. Pour un artisan ou un commerce, nous ferions l’arbitrage inverse : une page légère qui s’affiche instantanément passe avant tout. Le détail des mesures est consigné dans le [journal public du projet](https://github.com/FDA-Studio/fda-studio-site/blob/main/docs/seo/journal.md).

### Des pages de service trop courtes

À la mise en ligne, chaque page de service comptait environ 650 mots. C’est peu pour répondre aux questions d’un prospect, et peu pour que Google comprenne précisément le sujet de la page. Nous les avons enrichies pour atteindre 920 à 1 140 mots, avec des sections « pour qui » et des liens vers les articles du même sujet.

### Des titres trop génériques

Les trois pages de service partageaient les mêmes intertitres (« Ce que nous réalisons », « Pour qui »). Pour un visiteur, cela passe inaperçu. Pour un moteur de recherche, ces titres n’apportent rien. Chaque page a désormais ses propres intertitres, qui disent de quoi parle chaque section.

## Le référencement mis en place dès le départ

- **Données structurées** sur toutes les pages : l’entreprise, chaque service, le fil d’Ariane, les questions fréquentes et chaque article, avec un auteur identifié.
- **Plan du site et robots** générés automatiquement à chaque mise en ligne.
- **Signalement immédiat aux moteurs** compatibles avec IndexNow, comme Bing, à chaque publication.
- **Une rubrique [Ressources](/ressources/)** qui répond aux questions concrètes des prospects : prix, comparatifs, méthode. Chaque chiffre y est sourcé.
- **Une page [À propos](/a-propos/)** et des informations identiques partout (nom, adresse, téléphone), pour que Google et les assistants IA identifient l’entreprise sans ambiguïté.

Un point reste vrai pour tout nouveau site : la technique ne remplace pas l’ancienneté. Un domaine créé il y a quelques semaines n’apparaît pas tout de suite sur les recherches concurrentielles, même avec des pages irréprochables. Les premiers résultats se mesurent en mois.

## Ce que vous pouvez en retenir pour votre site

- **Partez de l’objectif commercial**, pas de la liste des pages. Que doit faire un visiteur, et qu’est-ce qui le convaincra ?
- **Mesurez sur un vrai téléphone**, pas seulement sur l’écran de l’ordinateur qui a servi à concevoir le site.
- **Montrez votre travail.** Une démonstration, une photo de chantier ou une réalisation commentée valent mieux qu’un paragraphe de promesses.
- **Une page par service et par question importante** : c’est ainsi que l’on est trouvé sur des recherches précises.
- **Prévoyez la suite** : un site s’améliore après sa mise en ligne, à partir de mesures réelles.

Vous voulez un site qui soit à la fois beau, rapide et trouvé sur Google ? Découvrez notre approche de la [création de site internet à Tours](/creation-site-internet-tours/), ou [parlez-nous de votre projet](/#contact).
