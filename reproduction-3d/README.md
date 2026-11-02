# Laboratoire : reproduction de la clé 3D et du coffre

## Objectif
Ce mini-site est un **test indépendant de reproductibilité**, pas une modification de la page d'accueil Pack Procédures Pro ni une proposition de nouveau site commercial.

La page `index.html` a été rédigée de zéro, avec son propre `demo.css` et son propre `demo.js`. La **seule** source métier réutilisée pour l'apparence et l'animation 3D est le fichier d'origine `sources_exactes/assets/apartment-scene.js`, copié à l'identique depuis le commit `e7270110d73b54d45c4d4ca1dfb14337c10edab7`.

## Voir le site
- En ligne après publication sur GitHub Pages : `https://cosscoll.github.io/Pack-Proc-dures-Pro/reproduction-3d/`
- Sur un ordinateur : depuis la racine du dépôt, `python -m http.server 8000`, puis ouvrir `http://localhost:8000/reproduction-3d/`.
- La 3D charge **Three.js r180 via jsDelivr** et exige une connexion Internet au premier chargement. En cas de contexte WebGL manquant ou de préférence « animations réduites », un dessin de secours prend le relais.

## Reproduire depuis le kit original
1. Reprendre le dossier `OUTIL_REPRODUIRE_CLE_3D_ET_COFFRE_PACK_PRO.zip` sauvegardé dans le Drive du projet.
2. Lire `GUIDE_TECHNIQUE_DETAILLE.md` et `MANIFEST_SOURCES.json`.
3. Le sous-dossier `outils_kit/` de cette démonstration contient une copie des **trois programmes et du manifeste** du dossier outil.
4. Pour les tester depuis ce dépôt connecté : `python reproduction-3d/outils_kit/outil_scripts/recuperer_sources.py`, puis `python reproduction-3d/outils_kit/outil_scripts/verifier_sources.py`, enfin `python reproduction-3d/outils_kit/outil_scripts/tester_mathematiques.py`.
5. Les huit sources exactes récupérées sont aussi conservées séparément dans `sources_exactes/` pour comparaison ; leur contenu n'a **pas été modifié**.
6. `demo.js` reconstruit la relation scroll → sept poses et coffre d'après les principes du guide. `demo.css` dessine un parcours complètement différent autour de la même animation.

## Distinguer les deux preuves
**Intégrité** : toutes les sources `sources_exactes/` ont les mêmes empreintes Git blob SHA-1 que celles inscrites dans le dossier. La CI revérifie les huit empreintes et exécute les scripts du kit.

**Réutilisation** : une page HTML/CSS nouvelle pilote sans modification le module 3D d'origine et vérifie sur 1440, 768 et 390 px : WebGL actif, 7 poses, scroll en avant et arrière, vrai couvercle 3D ouvert puis refermé, zéro exception Javascript et zéro débordement horizontal. Un format 320 px avec « réduire les animations » vérifie la vue de secours.

Le test **ne prouve pas** qu'on saurait sculpter un nouveau modèle à partir de zéro sans réutiliser l'implémentation existante ; il prouve que le dossier permet de **récupérer et réemployer la cinématique exacte** dans un autre site. Un test sans Internet échoue au téléchargement des sources et au chargement Three.js, comportement documenté.

## Garantie de non-régression
Toute la démonstration reste confinée au répertoire `reproduction-3d/` et à un workflow de test indépendant. Aucun des fichiers approuvés `/index.html`, `/pack-conciergerie.html`, `/assets/cinematic.css`, `/assets/apartment-scene.js` ou `/assets/experience.js` n'est modifié.
