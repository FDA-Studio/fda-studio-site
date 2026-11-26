# Contrôle qualité du site (Playwright, Python)

Deux scripts réutilisables, lancés sur le site construit (`pnpm build`) servi en local :

```bash
pnpm build
(cd out && python3 -m http.server 4321 &)
find out -name index.html | sed 's#out##; s#index.html##' | sort > /tmp/pages.txt
python3 scripts/qa/audit-pages.py   # toutes les pages × mobile, tablette, ordinateur → audit.json
python3 scripts/qa/parcours.py      # navigation, ancres, menu mobile, formulaire (sans envoi), clavier
```

`audit-pages.py` relève pour chaque page et chaque format : statut, erreurs console et réseau, débordement horizontal, cibles tactiles < 24 px, titre, description, H1, canonique, Open Graph, images sans texte alternatif, champs sans étiquette, liens et ancres. Les appels à app.fdastudio.fr sont refusés en local (CORS) : c'est attendu.

`parcours.py` ne soumet jamais le formulaire : il vérifie seulement que les erreurs s'affichent et que rien n'est envoyé.
