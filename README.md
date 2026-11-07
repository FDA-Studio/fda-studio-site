# FDA Studio — site officiel

Site de la marque FDA Studio (studio technologique du groupe FDA) : sites internet, intelligence artificielle, applications et jeux vidéo.

## Stack

| Couche | Choix | Pourquoi |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript strict, **export statique** | SEO par page, composants réutilisables, hébergement statique gratuit |
| Style | Tailwind CSS v4 + design system maison (`src/app/globals.css`) | Tokens de marque centralisés, aucun thème générique |
| 3D | Three.js (shader GLSL sur mesure), chargé à la demande | Sculpture temps réel du hero, hors du bundle initial |
| Animations | CSS natif + IntersectionObserver | Aucune dépendance d'animation : GSAP / Framer Motion non nécessaires ici |
| Validation | Zod (schéma partagé navigateur / serveur) | Une seule source de vérité pour le formulaire |
| Contact | Supabase Edge Function + Resend + Upstash (rate-limit) | Clés côté serveur uniquement, données en UE |
| Hébergement | GitHub Pages (workflow `.github/workflows/deploy.yml`) | Standard FDA pour les sites du groupe |

Dépendances de production : `next`, `react`, `react-dom`, `three`, `zod`. Polices auto-hébergées dans `public/fonts` (Inter, IBM Plex Mono — licence OFL).

## Identité de marque

Identité « Monogramme » validée le 7 novembre 2026. Fichiers officiels dans `brand/` (SVG, tokens, règles d'usage) ; composant `src/components/brand/Logo.tsx`.
Noir / argent / blanc, bleu électrique `#2F5BFF` en accent d'interface uniquement, violet `#6E4BFF` réservé aux univers produits et gaming.

## Démarrer

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # export statique dans out/
pnpm typecheck
```

## Structure

```
src/
  app/                    pages (accueil, services/[slug], work/[slug], gaming, about, contact, légal), sitemap, robots, manifest
  components/
    brand/Logo.tsx        logo officiel (tracés vectoriels)
    hero/                 sculpture WebGL (HeroCanvas) et shaders GLSL
    demos/                démonstrateurs interactifs (agent IA, produit, responsive, portes, mesures live)
    sections/             sections de la page d'accueil
  lib/
    site.ts               coordonnées, navigation, endpoint du formulaire
    services.ts           contenu et SEO des 4 expertises
    projects.ts           portfolio (ajouter un objet = nouvelle page projet)
    validations/contact.ts schéma Zod du formulaire
supabase/                 fonction `contact` et migration de la table `contact_requests`
brand/                    kit de marque officiel
```

### Ajouter un projet

Ajouter un objet dans `src/lib/projects.ts`. La page `/work/<slug>`, la liste, le sitemap et (si `featured`) la page d'accueil se mettent à jour. Règle : aucun client, chiffre ou résultat inventé ; `nature: "concept"` pour un démonstrateur interne.

## Formulaire de contact

- Sans configuration : le formulaire valide la saisie puis ouvre un e-mail pré-rempli vers `contact@fdastudio.fr` (fonctionnel, sans serveur).
- Avec la fonction serveur (recommandé avant la mise en production) :
  1. Créer un projet Supabase en région **eu-west-3 (Paris)** et appliquer `supabase/migrations/`.
  2. `supabase secrets set RESEND_API_KEY=… CONTACT_TO=contact@fdastudio.fr CONTACT_FROM="FDA Studio <site@fdastudio.fr>" ALLOWED_ORIGIN=https://fdastudio.fr UPSTASH_REDIS_REST_URL=… UPSTASH_REDIS_REST_TOKEN=…`
  3. `supabase functions deploy contact --no-verify-jwt`
  4. Définir la variable de dépôt GitHub `NEXT_PUBLIC_CONTACT_ENDPOINT` (URL de la fonction).

Protections : validation Zod côté serveur, contrôle d'origine, taille maximale, champ piège et délai minimal anti-robots, rate-limit 5/h/IP, échappement HTML, table protégée par RLS sans politique publique.

## Sécurité et RGPD

- Aucun cookie, aucun traceur, polices auto-hébergées (aucun appel à Google Fonts).
- CSP en balise `<meta>` (GitHub Pages n'autorise pas d'en-têtes HTTP). `script-src 'unsafe-inline'` est requis par l'hydratation de l'export statique Next.js.
- Aucune clé secrète dans le frontend ; seule l'URL publique de la fonction est exposée.

## Performance et accessibilité

- La sculpture 3D démarre après le chargement (idle), s'adapte à l'appareil, se met en pause hors écran et onglet masqué.
- Sans accélération matérielle, économie de données ou mémoire ≤ 2 Go : visuel statique, Three.js n'est pas téléchargé. Ajouter `?force3d` à l'URL pour forcer la 3D.
- `prefers-reduced-motion` respecté (une image fixe, aucune transition).
- Lighthouse mobile mesuré en local (serveur sans compression) sur l'accueil : performance 91, accessibilité 100, bonnes pratiques 100, SEO 100.

## Mise en ligne (GitHub Pages)

1. Dépôt `FDA-Studio/fda-studio-site` (ou nom validé), *Settings → Pages → Source : GitHub Actions*.
2. Pousser sur `main` déclenche build + déploiement ; les autres branches ne font qu'une compilation de contrôle.
3. DNS chez IONOS (`@` → A `185.199.108.153` à `185.199.111.153`, `www` → CNAME `fda-studio.github.io`), puis forcer HTTPS. `public/CNAME` contient `fdastudio.fr`.

## À compléter avant la production

- Mentions légales : raison sociale, SIRET, adresse, TVA, directeur de publication (éléments surlignés dans la page).
- Confidentialité : confirmer la liste des sous-traitants selon la configuration du formulaire.
- Captures réelles des projets (`ProjectCover` affiche des visuels générés en attendant).
- Recherche d'antériorité de la marque (INPI / EUIPO), voir `brand/README.md`.
