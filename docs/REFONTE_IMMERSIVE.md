# REFONTE IMMERSIVE — Business 01 / Pack Procédures Pro

**Lot :** 2026-10-19 · **Statut :** code livré sur branche de travail, en attente de recette CI et de contrôle de publication.  
**Périmètre :** vitrine publique exclusivement, pas de vente ni de publication de documents premium.

## Vision « L’atelier des processus »

La page montre la transformation d’opérations fragmentées en procédure cohérente. Direction artistique éditoriale : papier ivoire, encre et vert profond, accent champagne, titrages serif et rythme précis. Aucun asset ou code repris d’un site de référence. L’expérience est intentionnellement distincte de Business 02.

## Architecture du premier lot

- `index.html` autonome : CSS et JavaScript intégrés pour que GitHub Pages puisse servir la page directement, sans npm, CDN, build ni coût.
- **Scène 3D WebGL2 réelle** : 4 maillages cuboïdes de documents (faces et épaisseur), caméra en projection perspective, matrices de transformation, profondeur, rotations et mouvements interpolés en fonction du scroll ; liaisons entre les étapes lors de l’assemblage. Canvas différé jusqu’à proximité du chapitre ; limite de pixel ratio selon le terminal.
- **Repli** : scène documentaire HTML/CSS en l’absence de WebGL2, d’IntersectionObserver ou avec `prefers-reduced-motion: reduce`. Le contenu, les appels à l’action et le simulateur sont indépendants de WebGL.
- **Démonstrateur métier** : trois scénarios fictifs (rotation conforme, mission non confirmée, incident bloquant), libellés, état, décisions et `aria-pressed` accessibles au clavier.
- **Offre** : « Rotation Sérénité » reste le **nom provisoire** du premier produit (15 procédures + 7 registres). Prix de 49 € **hypothétique** ; aucune vente possible, aucun téléchargement du contenu premium.
- Lien **Avancement** conservé aussi sur mobile, autres accès à la vision, aux solutions et au laboratoire.
- Aucun paiement, formulaire, analytics, dépôt de données personnelles ni dépendance JavaScript externe. Polices système pour éviter les requêtes externes.

## Réalisation et autocritique du sprint

1. **Avantage métier :** le document 3D illustre les décisions qui se connectent, plutôt qu’un objet décoratif aléatoire.
2. **Réparation effectuée :** menu mobile initial cachait le lien Avancement ; il est maintenant visible et utilisable de 320 à 1440 px.
3. **Réparation effectuée :** la police Google distante pouvait ralentir le chargement ; supprimée et remplacée par une pile locale.
4. **Performance :** la scène ne s’initialise qu’au besoin. Le véritable contexte GPU WebGL2 ne peut pas être vérifié dans le navigateur local disponible (API présente, contexte nul) ; le site affiche alors une alternative visuelle.
5. **Contrôle Chromium :** rendu DOM injecté (l’accès à localhost et file:// est bloqué dans cet environnement) ; tests 320, 390, 768, 1440 px : 0 débordement, 0 erreur JS, menu Avancement visible, scénario incident renvoie BLOQUÉ et repli reduced motion visible. Ces tests ne prouvent pas HTTP public, compatibilité Safari ou performance réelle.
6. **Limites restantes :** QA GPU WebGL sur appareil réel, LCP/CLS et contraste WCAG mesurés, relecture éditoriale, tests multiplateformes, audit clavier/Safari, dispositif d’acquisition et tunnel marchand encore non ouverts.

## Reprise à la prochaine exécution XXh10

1. Lire `main`, les branches ouvertes et PR avant toute modification. **Finir le sprint en cours et résoudre ses éventuels échecs avant d’en ouvrir un autre.**
2. Contrôler le workflow de vérification dans `tests/check_site.py` et la CI ; compléter les tests de rendu navigateur.
3. Si les tests passent, vérifier absence de conflit, fusionner seulement après recette, contrôler la version publique et noter preuves/limitations.
4. Exécuter une nouvelle autocritique et corriger les écarts (navigation, WebGL, accessibilité, CLS/LCP) avant les prochains enrichissements métier.
5. Préserver les restrictions : **zéro dépense**, aucun Work/Codex ni quotas limités pour automatisations, aucune vente réelle et aucun document premium exposé.

**La présence d’un commit, d’une PR ou d’un statut CI vert ne vaut pas preuve de disponibilité HTTP publique.**

## Correction de continuité et vérifications CI — 19 octobre 2026

- **Régression traitée :** le guide « S’orienter » du site précédent est conservé sous forme de trois accordéons éditoriaux accessibles et sans collecte, avec des conseils métier, en plus du laboratoire 3D.
- **Navigation mobile :** liens « Les solutions », « S’orienter », « Le laboratoire » et « Avancement » accessibles sans débordement ; le menu s’adapte en lignes sur petit écran.
- **Tests Chromium locaux DOM injecté :** 320/390/768/1440 px, aucun débordement, aucune exception JS, ouverture des trois questions, statut EN ATTENTE et Avancement visible.
- **GitHub Actions PR #4 :** workflow historique « Verify public preview » (run 39222747269, success) et « Vérification site immersif — Business 01 » (run 39222747424, success). Le premier échec temporaire concernait les assertions codant l’ancien site sans JavaScript ; celles-ci ont été réécrites pour vérifier la nouvelle UX et sa conformité, pas neutralisées.
- **Limites résiduelles :** rendu WebGL GPU non prouvé dans Chromium local où getContext('webgl2') retourne null ; tests HTTP 200 GitHub Pages, Safari mobile, LCP et CLS réels requis pour recette complète.
