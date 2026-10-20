# Direction artistique V4 — ROTATION 001
Date : 20 octobre 2026 · Statut : branche de recette jusqu'à fusion et confirmation HTTP publique

## Pourquoi cette refonte
L'ancien accueil utilisait un split hero, une pile de documents rectangulaires, des pastilles et des grilles de produits. Ces éléments étaient techniques mais leur langage visuel restait interchangeable avec n'importe quel site généré, sans véritable lien sensible avec la conciergerie. L'utilisateur a explicitement rejeté cette direction en demandant de se rapprocher de https://www.igloo.inc/, https://studiomirage.io/, https://noomoagency.com/ et https://santalarch.com/.

## Intention : une rotation vécue, pas une pile de PDF
Un seul objet narratif original : un logement de location courte durée, rendu en vraie 3D (Three.js/WebGL2) avec chambre, linge, cuisine, salon, fenêtres, porte, contrôle, éclairage. Le scroll conduit la caméra en quatre états : départ, demande d'intervention/acceptation, vérification et méthode. Le texte se place comme un sous-titre de film plutôt qu'une succession de cartes.

Sources stylistiques, sans copie du code ni des assets :
- Igloo : grand univers 3D dominant la page, caméra associée au scroll, interface minimale et atmosphère.
- Studio Mirage : mise en scène et rythme cinématographique.
- Noomo : l'histoire dicte les interactions et les transitions.
- Santalarch : architecture, calme éditorial et matériaux.

## Implémentation
- `index.html` : nouvelle expérience en quatre chapitres, liens P01/Atelier/Avancement préservés, offre limitée au pré-lancement.
- `assets/cinematic.css` : directions typographiques, mise en espace et transitions. Contrastes automatisés WCAG AA corrigés ; sous-titres ajustés aux scènes.
- `assets/apartment-scene.js` : scène Three.js procédurale originale, texture parquet générée localement, matériaux PBR, éclairage, ombres, caméra par chapitre, hotspots métier. Chargement libre du module Three.js depuis jsDelivr. Sans réseau ou WebGL, l'illustration architecturale SVG de repli reste disponible : la dépendance CDN constitue un risque opérationnel à surveiller.
- `assets/experience.js` : navigation au clavier, menu, progression au scroll, décisions explicites. Aucun localStorage, cookie marketing, paiement ou formulaire.
- `tests/cinematic-browser.mjs` : Chromium HTTP, WebGL2 réel sur desktop/768/390, repli reduced-motion à 320px, menu, chapitres, scénarios, débordement, erreurs JS et captures.
- `.github/workflows/verify-cinematic.yml` : recettes indépendantes sur branche et après push main sur URL GitHub Pages réelle.
- Tests historiques du site document-pile retirés car obsolètes, remplacés par les recettes ci-dessus. `tests/home.test.mjs` et `tests/check_site.py` réécrits pour le nouveau concept ; tests de l'exemple P01 et audit axe-core conservés.

## Commerce et rigueur
- 15 procédures et 7 registres = produit pilote, non validé par un professionnel ; prix 49 € hypothétique. Aucun paiement, aucune promesse chiffrée d'économie, aucune vente.
- La page P01 gratuite et l'atelier interactif restent accessibles.
- Ne pas prétendre être exactement au niveau de production de sites très élaborés tels qu'Igloo : un diorama procédural est un jalon de la direction artistique, qui demandera des passes de finition sur matériaux, animations, optimisation et essais matériels.
- Ne pas réintroduire les anciennes piles de rectangles 3D, gradients génériques et dizaines de cartes. Toute nouvelle 3D doit représenter un objet métier et soutenir le parcours narratif.

## Recette avant fusion
1. WebGL2 et modèles réels chargés sur 1440, 768 et 390px Chromium CI ; alternative visible sous reduced motion à 320px.
2. Navigation par chapitres et menu clavier ; fermeture Esc ; décisions affichées sans invention de résultats.
3. 0 débordement horizontal, aucune exception JS.
4. Axe-core zéro violation automatique WCAG AA sur accueil et exemple ; contraste validé. Audit humain lecteur d'écran et GPU iPhone/Android encore ouvert.
5. Vérifier captures à deux positions de scroll et 4 largeurs ; corriger caméra, éclairage et lisibilité avant publication.
6. Après fusion, vérifier HTTP 200 et exécutabilité du site réellement servi par GitHub Pages. Ne pas confondre CI verte et effet visuel garanti sur tous les matériels.
