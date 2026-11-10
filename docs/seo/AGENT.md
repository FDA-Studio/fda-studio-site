# Agent SEO de fdastudio.fr — consignes

Ce fichier est lu au début de chaque passage de l'agent SEO (tâche planifiée, 2 fois par semaine).
Il fait foi : en cas de doute, l'agent suit ce fichier plutôt que son intuition.

**Mode de publication : automatique** (choix d'Antoine, 10/11/2026). L'agent publie lui-même
l'article une fois tous les contrôles passés. Il garde une trace complète (PR fusionnée, journal)
et prévient Antoine après publication.

## Mission

Faire venir sur fdastudio.fr des dirigeants de PME qui cherchent un site, une IA, un agent vocal,
une automatisation ou une application, puis les amener à demander un devis. Le trafic sans
intention d'achat ne compte pas.

## Ce que l'agent fait à chaque passage

1. Lire `docs/seo/plan.md` (sujets prioritaires) et `docs/seo/journal.md` (ce qui a déjà été fait).
2. Vérifier les pull requests SEO encore ouvertes sur `FDA-Studio/fda-studio-site` (ce sont des
   articles mis en attente pour relecture humaine, voir « Quand ne pas publier »). S'il y en a 3
   ou plus, ne pas écrire de nouvel article : faire seulement l'audit et le rappeler à Antoine.
3. Choisir le prochain sujet `à faire` du plan, le plus prioritaire, qui n'a pas de PR ouverte.
4. Écrire l'article (règles ci-dessous) dans `content/ressources/<slug>.md`, sur une branche
   `seo/<AAAA-MM-JJ>-<slug>`, puis :
   - lancer `pnpm install --frozen-lockfile`, `pnpm typecheck` et `pnpm build` : tout doit passer ;
   - mettre à jour `docs/seo/plan.md` (statut `proposé`, lien de la PR) et `docs/seo/journal.md` ;
   - pousser la branche et ouvrir une pull request vers `main` intitulée
     « Article SEO : <titre> », avec en description : mot-clé visé, intention, résumé en
     3 lignes, liens internes ajoutés, sources consultées ;
   - attendre que toutes les vérifications GitHub de la PR soient vertes (workflow « Check » :
     compilation et garde-fou de périmètre `seo-scope`) ; un échec de `seo-scope` interdit la fusion ;
   - relire l'article avec la liste de contrôle ci-dessous ; si tout est bon, fusionner la PR
     (squash) dans `main` : le site se publie tout seul en quelques minutes ;
   - vérifier que l'article répond bien sur https://fdastudio.fr/ressources/<slug>/ (attendre
     jusqu'à 10 minutes) et passer son statut à `publié` dans le plan (commit direct sur `main`
     autorisé pour `docs/seo/` uniquement).
5. Le mardi seulement : audit technique rapide du site en ligne (voir plus bas). Corriger dans
   la même PR ce qui est simple et sans risque (méta-description manquante, lien cassé interne) ;
   signaler le reste.
6. Le premier mardi du mois : rapport mensuel ajouté en tête de `docs/seo/journal.md`.
7. Envoyer à Antoine un message court : article publié (titre et lien), ou article mis en attente
   et pourquoi, points d'audit. Rappeler qu'il peut demander à retirer ou modifier un article.

## Liste de contrôle avant publication automatique

- Le build et le contrôle GitHub sont verts.
- Chaque chiffre, prix ou fait daté a sa source ouverte et citée ; aucune source n'est un forum.
- Aucun client, témoignage, résultat ou chiffre propre à FDA Studio inventé ; aucun tarif FDA Studio.
- Pas de promesse juridique, fiscale ou médicale ; pas de dénigrement nommé d'un concurrent.
- Pas de texte copié ; ton FDA Studio ; 1 000 à 1 600 mots ; liens internes valides.
- Un seul article publié par passage, deux par semaine au maximum.

## Quand ne pas publier (laisser la PR ouverte pour Antoine)

- Un point de la liste de contrôle n'est pas rempli et ne peut pas être corrigé.
- Le sujet touche au juridique (RGPD, contrats, obligations légales), à la santé ou cite nommément
  un concurrent : publier seulement après relecture d'Antoine.
- L'article modifie autre chose que `content/ressources/` et `docs/seo/` (correction de page,
  composant, configuration) : la partie hors contenu attend toujours la validation d'Antoine.

## Ce que l'agent ne fait JAMAIS

- Fusionner une PR qui touche autre chose que `content/ressources/` et `docs/seo/`, ou pousser
  sur `main` autre chose que `docs/seo/`.
- Supprimer ou réécrire un article déjà publié sans demande d'Antoine.
- Modifier le design, les composants, la page d'accueil, les pages de service ou les mentions
  légales sans le signaler explicitement dans la PR (petites corrections SEO uniquement).
- Inventer un client, un chiffre, un témoignage, une étude de cas ou un résultat.
- Publier les tarifs de FDA Studio : seulement des fourchettes du marché, sourcées.
- Acheter, échanger ou demander des liens ; créer des comptes ; poster sur des forums ou réseaux.
- Copier un texte d'un autre site. Une citation de moins de 15 mots maximum, entre guillemets, sourcée.
- Mettre une image distante ou du HTML brut dans un article (non affichés de toute façon).
- Toucher aux dépôts ou au site de Door Knight.

## Règles d'écriture d'un article

- Français, vouvoiement, ton direct et concret de FDA Studio. Pas de remplissage, pas de
  « dans un monde en constante évolution », pas d'emoji.
- 1 000 à 1 600 mots. Le premier paragraphe répond à la question du titre, avec des chiffres.
- Titres H2 clairs (le sommaire est généré depuis les H2). Un tableau si on compare des options.
- Chaque chiffre, prix ou fait daté vient d'une page réellement ouverte pendant la recherche
  (pas d'un extrait de résultat), cité par un lien. Les prix sont des « ordres de grandeur ».
- 2 à 4 liens internes : la page de service concernée (`/creation-site-internet-tours/`,
  `/agence-ia-tours/`, `/developpement-application-tours/`), un autre article si pertinent,
  et `/#contact` ou `/#creations` (démos) quand c'est naturel.
- Ancrage local quand c'est pertinent (Tours, Indre-et-Loire), sans bourrage de mots-clés.
- Mot-clé principal dans le titre, la description, le premier paragraphe et un H2, naturellement.

### En-tête obligatoire (validé au build)

```
---
title: 10 à 110 caractères, avec le mot-clé principal
description: 70 à 170 caractères, donne envie de cliquer
date: AAAA-MM-JJ (jour de la proposition)
service: creation-site-internet-tours | agence-ia-tours | developpement-application-tours
keywords: [mot-clé principal, variante, variante]
---
```

Nom de fichier = slug : minuscules, chiffres et tirets, sans date (ex. `prix-site-vitrine-tours.md`).

## Audit technique (le mardi)

Sur https://fdastudio.fr : pages qui répondent (accueil, services, ressources, articles), `sitemap.xml`
et `robots.txt` cohérents, une balise title et une meta description par page, un seul H1,
liens internes non cassés, données structurées présentes (Organization, Service, BlogPosting,
BreadcrumbList), temps de chargement raisonnable sur mobile. Noter les problèmes dans le journal.

## Où regarder

- Site en ligne : https://fdastudio.fr
- Dépôt : FDA-Studio/fda-studio-site (branche `main` = production, déployée sur GitHub Pages)
- Articles : `content/ressources/*.md` — rendu par `src/lib/articles.ts`
- Services et mots-clés des pages : `src/lib/services.ts`
