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
brand/                    kit de marque officiel
```

### Ajouter un projet

Ajouter un objet dans `src/lib/projects.ts`. La page `/work/<slug>`, la liste, le sitemap et (si `featured`) la page d'accueil se mettent à jour. Règle : aucun client, chiffre ou résultat inventé ; `nature: "concept"` pour un démonstrateur interne.

## Formulaire de contact

- En production, les demandes partent vers l'outil interne FDA Studio (`https://app.fdastudio.fr/api/public/leads`, dépôt `fda-studio-internal`), qui crée la fiche client, l'opportunité et le rappel, puis prévient l'équipe. Adresse surchargeable par la variable de dépôt `NEXT_PUBLIC_CONTACT_ENDPOINT`.
- En développement, sans variable : le formulaire valide la saisie puis ouvre un e-mail pré-rempli vers `contact@fdastudio.fr`.
- Captcha Cloudflare Turnstile (clé publique dans `src/lib/site.ts`, clé secrète uniquement sur Vercel, côté outil interne).

Protections, côté outil interne : validation Zod, contrôle d'origine, taille maximale, champ piège et délai minimal anti-robots, captcha vérifié côté serveur, limite de 5 demandes par heure et par visiteur, accusé de réception à texte fixe (une fois par adresse et par jour).

## Expérience sonore

- Coupée par défaut : bouton dans l'en-tête et invitation dans le hero. Aucun son avant un geste du visiteur (règles d'autoplay, WCAG 1.4.2).
- À l'activation : impact « power-on », puis nappe ambiante en boucle qui s'ouvre progressivement (filtre passe-bas) et s'atténue en descendant dans la page. Petits sons d'interface (onglets, scénarios IA, expertises) et grincement des portes Door Knight.
- Sons générés avec ElevenLabs Sound Effects (flux « FDA Studio — sons du site »), puis découpés, normalisés et bouclés : `public/sounds/` (≈ 140 Ko au total), téléchargés uniquement à l'activation. Moteur : `src/lib/sound.ts`.
- Remplacer un son : déposer un MP3 du même nom dans `public/sounds/`.

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
3. Domaine : `fdastudio.fr` configuré dans *Settings → Pages* ; DNS chez IONOS (`@` → 4 A `185.199.108.153` à `185.199.111.153`, `www` → CNAME `fda-studio.github.io`, configuré le 7 nov. 2026, enregistrements e-mail inchangés). Aperçu en sous-dossier possible via la variable de dépôt `PAGES_BASE_PATH`.

## Contenus

- Informations légales : société FDA (nom commercial FDA Studio), reprises des mentions publiées sur doorknight.games et fdaholding.fr. Modifiables dans `src/lib/site.ts`.
- Univers Door Knight : textes et visuels officiels de doorknight.games (`src/lib/doorknight.ts`), servis depuis ce site.
- Portfolio : captures réelles dans `public/work/` ; les concepts internes gardent une composition générée et sont signalés comme tels.
- Avant tout dépôt de marque : recherche d'antériorité (INPI / EUIPO), voir `brand/README.md`.
