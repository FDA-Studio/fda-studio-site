# FDA Studio — Kit logo pour le site web

Identité « Monogramme » validée le 7 novembre 2026. Tous les SVG sont des **tracés vectoriels** : aucune police n'est nécessaire pour afficher le logo (STUDIO a été vectorisé depuis Inter Medium).

## Contenu

| Dossier | Contenu | Usage |
|---|---|---|
| `svg/symbol/` | Symbole seul : noir, blanc, `currentColor`, coupe micro | Favicon, avatar, petits espaces |
| `svg/horizontal/` | Logo principal : noir, blanc, `currentColor`, `on-light`, `on-dark` | En-tête du site, signatures |
| `svg/compact/` | Logo compact (empilé) : noir, blanc, `currentColor`, `on-dark` | Pied de page, formats carrés |
| `png/` | Symbole 512/1024 px et logo horizontal 2000 px, fond transparent | Outils qui refusent le SVG |
| `web/` | Favicons, icônes, manifest, image de partage, extrait `<head>` | Site statique / Vite (GitHub Pages) |
| `nextjs/` | Fichiers `app/` + composant `Logo.tsx` | Site Next.js (App Router) |
| `tokens/` | Variables CSS + thème Tailwind v4 | Couleurs et polices de la charte |

## Intégration

### Site statique ou Vite (GitHub Pages)
1. Copier le contenu de `web/` à la racine publique du site (`public/` pour Vite).
2. Coller `web/head.html` dans le `<head>`. Vérifier l'URL de `og:image` (domaine définitif).
3. Logo dans l'en-tête : `svg/horizontal/fda-studio-horizontal-on-dark.svg` (fond sombre) ou `-on-light.svg` (fond clair).

### Next.js (App Router)
1. Copier `nextjs/app/*` dans `src/app/` : Next génère automatiquement favicon, icône, apple-icon et manifest.
2. Copier `web/icon-192.png`, `web/icon-512.png`, `web/icon-maskable-512.png` et `web/og-image.png` dans `public/`.
3. Copier `nextjs/components/brand/Logo.tsx` dans `src/components/brand/` :

```tsx
import { Logo } from "@/components/brand/Logo";

<Logo variant="horizontal" className="h-10 w-auto text-fda-white" studioColor="var(--fda-silver)" />
<Logo variant="symbol" decorative className="h-6 w-auto" />
```

4. Importer `tokens/tokens.css` (et `tokens/tailwind-theme.css` sous Tailwind v4). Polices via `next/font` : Inter (`--font-inter`) et IBM Plex Mono (`--font-plex-mono`), auto-hébergées.

## Règles d'usage

- **Zone de protection** : autour du logo, laisser au moins la largeur du fût du F.
- **Tailles minimales** : logo horizontal 120 px de large ; symbole 24 px. En dessous de 24 px, utiliser la **coupe micro** (`fda-studio-symbol-micro-black.svg`, `favicon.svg`).
- **Couleurs** : une seule encre (noir, blanc ou graphite). STUDIO peut passer en argent sur fond sombre. Le bleu électrique et le violet sont des accents d'interface, **jamais dans le symbole**.
- **Interdit** : déformer, pivoter, ajouter ombre, dégradé, contour ou effet 3D, recolorer une partie du symbole, recomposer les éléments, placer le logo sur une photo chargée sans aplat.

## Contrastes (WCAG)

| Combinaison | Ratio | Verdict |
|---|---|---|
| Argent `#A7ABB2` sur noir | 8,6:1 | Texte courant OK |
| Gris clair `#C9CBD0` sur noir | 12,2:1 | Texte courant OK |
| Graphite `#2B2D31` sur `#F4F4F2` | 12,5:1 | Texte courant OK |
| Blanc sur bleu `#2F5BFF` | 5,2:1 | Boutons OK |
| Bleu `#2F5BFF` sur noir | 3,8:1 | Grand texte et éléments d'interface uniquement, **pas de texte courant** |

## À faire avant mise en production

- Recherche d'antériorité de la marque (INPI / EUIPO) avant dépôt.
- `favicon.ico` : le symbole est noir sur transparent. Sur un onglet sombre, les navigateurs modernes utilisent `favicon.svg`, qui passe automatiquement en blanc.
