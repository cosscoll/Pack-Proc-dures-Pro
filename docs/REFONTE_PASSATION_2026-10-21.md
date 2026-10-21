# Pack Procédures Pro — Refonte « Les clés passent » (21 octobre 2026)

## Objectif de la refonte

Créer une vitrine distincte de la Banque Outils IA, qui **vend une méthode de travail**, plutôt qu'un effet technique. Priorité à une vraie histoire métier : qui attribue une rotation, qui confirme une intervention, qui contrôle le logement, qui transmet l'information.

## Direction artistique

- Univers d'atelier de conciergerie : encre vert-noir, ivoire, bronze, typographie éditoriale Instrument Serif et petites références d'archive.
- Objet principal identifiable : une **clé usinée** avec anneau métallique et porte-clés en cuir « ROTATION / 001 ».
- Pas de pile de cartes, pas de sculpture abstraite ou de chambre en cubes à la Une.
- 4 mouvements continus coordonnés au scroll : passation, attribution, contrôle, transmission.
- Survol lié au pointeur avec raycast Three.js sur l'objet, légère réaction de la caméra, interactions cliquables sur le déclencheur, simulations métier.
- Page offre en premier plan après l'expérience : 15 procédures et 7 registres, toujours présentés comme **pilote à valider**.
- Pas de vente active. Prix de 49 € seulement hypothétique.

## Livrables et architecture

- `index.html` : page complète, récit en quatre étapes, proposition de valeur et liens vers les autres pages.
- `assets/cinematic.css` : direction artistique de l'accueil, navigation, responsive, animations et modes réduits.
- `assets/apartment-scene.js` : conserve ce nom technique historique pour ne pas casser les jobs CI. Le contenu est maintenant une modélisation originale clé + porte-clés en Three.js.
- `assets/experience.js` : séquençage du scroll, clavier, menu, modales, interactions et scénario alternatif quand WebGL est absent.
- `assets/subpages.css` : harmonisation des pages `exemple-procedure.html`, `atelier-decisions.html`, `avancement.html`.
- `atelier-decisions.html` : remplacement de la pile de documents pseudo-3D par un cadran des trois décisions ; jeu existant conservé.
- `tests/home.test.mjs`, `tests/cinematic-browser.mjs` et workflow de recette atelier adaptés aux contenus réellement servis.

## Ressources issues du dépôt Studio Web 3D

- `skills/studio-web-3d/SKILL.md`, `docs/SELECTION-TECHNIQUE-2026.md`, `docs/METHODE-PRODUCTION-PREMIUM-V2.md` et `research/2026-10-21/ENQUETE-4-REFERENCES.md` lus avant implémentation.
- **Three.js r180**, moteur WebGL — licence MIT ; chargé depuis jsDelivr uniquement côté navigateur.
- Aucun modèle 3D tiers, shader propriétaire, asset de studio ou texture photographique repris.
- Interaction scroll et transitions réalisées en JavaScript natif, pas de bibliothèque supplémentaire GSAP/Lenis imposée.
- Polices utilisées : Instrument Serif, DM Sans, DM Mono via Google Fonts ; repli système.
- Aucune API marchande, paiement, formulaire collectant des données, dépense ajoutée volontairement.

## Niveaux de preuve à distinguer

- Le code sur `main` ne garantit pas une qualité artistique comparable à Igloo, Studio Mirage, Noomo ou Santal.
- Des tests navigateur Chromium/SwiftShader via GitHub Actions vérifient le vrai rendu WebGL2, survol, scénarios, navigation, 320/390/768/1440 px, erreurs JS et débordements. Les logs et captures sont associés à chaque exécution.
- Le mode `prefers-reduced-motion` et l'échec CDN/WebGL utilisent un visuel SVG de secours.
- L'audit axe-core WCAG AA automatisé vérifie l'accueil et la procédure gratuite. Un audit lecteur d'écran physique et une revue visuelle humaine restent à faire.
- Matériel iOS/Android et GPU physique, métriques terrain et look-dev Blender/GLB ne sont pas validés par ces tests. Ne pas confondre rendus SwiftShader et contrôle artistique humain.
- En cas de cache GitHub Pages de l'ancienne version, les scripts/CSS de l'accueil portent un paramètre de révision explicite.

## Prochain contrôle qualité visuel

Regarder sur un écran desktop et un téléphone physique : lisibilité du métal (reflets, silhouette, découpe), visibilité du porte-clés, transitions du scroll dans les deux sens, positionnement mobile de la clé, absence de contraste faible et cohérence de toutes les sous-pages. Si l'objet manque de qualité visuelle, reprendre la modélisation et les matières avant d'ajouter des effets décoratifs.
