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

## Recette publique Chromium et WebGL2 — 19 octobre 2026, 10h40 Paris

**Correction de l’état initial « GPU non vérifié » :** le premier environnement Chromium local renvoyait `getContext('webgl2') = null`, puis une recette navigateur sur **le site public** depuis GitHub Actions a validé **WebGL2 actif** en 1440, 768 et 390 px (Chromium avec SwiftShader), et un repli 2D volontaire avec `prefers-reduced-motion` en 320 px.

Preuve : https://github.com/cosscoll/Pack-Proc-dures-Pro/actions/runs/39224305285 . Le journal du job signale `PUBLIC_BROWSER_ACCEPTANCE_OK`, 0 erreur JavaScript, 0 débordement aux quatre largeurs, navigation Avancement disponible, accordéons métier et états du laboratoire validés. Les captures PNG sont attachées à cette exécution sous `captures-site-public` (7 jours). La PR #7 a été fusionnée : https://github.com/cosscoll/Pack-Proc-dures-Pro/pull/7 ; commit 54083fe20491cda76855641652b0d78c92129da6.

**Nuance :** SwiftShader n’est pas un test GPU physique Android/iPhone ; les seuils LCP et CLS sur mobile physique ainsi que l’audit WCAG 2.2 AA restent ouverts. Le site ne propose toujours pas de vente ; seuls des contenus de pré-lancement sont publics.

**Prochain sprint :** 1) mesure mobile LCP/CLS avec traces reproductibles ; 2) audit clavier/lecteur d’écran et Safari iPhone réel si accès ; 3) corrections UX selon preuves, sans nouveau module purement décoratif ni achat.

## Sprint P01 + accessibilité (19 octobre 2026)

**AVANT :** le site expliquait les procédures mais ne proposait pas de fiche consultable et manipulable. **APRÈS :** `exemple-procedure.html` — une seule procédure pilote P01 publique et gratuite, reliée depuis le catalogue et le laboratoire, avec sept étapes à cocher, indicateur de progression, réinitialisation et impression PDF via le navigateur. Aucun stockage ni envoi de la progression, aucune vente et aucun fichier premium exposé. Le brouillon ne vaut pas norme métier.

**Preuves fonctionnelles :** PR #8 fusionnée `f52b548c567788b36b4245268f23122f9d94e62b` ; GitHub Actions `39226393913` : quatre résolutions (320,390,768,1440), 0 débordement, 0 erreur JavaScript, étapes, réinitialisation et impression testées dans Chromium. PR #9 : HTTP 200 sur la page P01 ET sur l'accueil, lien vers l'échantillon vérifié depuis le HTML public ; run `39226628934`.

**Autocritique :** le premier audit axe-core sur le site public a révélé du contraste de petits textes sous le seuil WCAG AA (et l'outil exigeait un contexte navigateur dédié). Correctifs de contraste appliqués à l'accueil et à P01, script rectifié et cible de l'audit remplacée par la version PR réelle ; seconde passe de correction après diagnostics détaillés. PR #10 fusionnée `a76f01c12b6f317402883a69d9002ed897e76cc2`. GitHub Actions `39227519176` : axe-core WCAG 2 A/AA, 2.1 AA, 2.2 AA — **zéro violation automatique** sur accueil et échantillon (navigateur Chromium en CI), quatre workflows réussis. Le CLS en laboratoire ressort à 0, mais les chiffres LCP mesurés sur runner ne démontrent PAS la performance d'un mobile physique.

**Recette public supplémentaire :** PR #11 (à vérifier) exige que l'audit axe-core s'applique aussi aux URLs réellement servies par GitHub Pages, et pas uniquement au code de la branche. Garder les états CI/public distincts.

**Restent ouverts :** tests Safari iPhone et Android matériels, WCAG manuel (clavier, zoom 200–400 %, lecteur d'écran, navigation sans JavaScript selon fonctionnalité), métriques de terrain LCP/CLS/INP, stabilité GPU sur appareils modestes ; analyse de nom commercial et conformité avant vente. Priorité : corriger les éventuelles anomalies concrètes, puis affiner l'expérience de consultation produit sans diffuser le pack complet ni activer de paiement.
