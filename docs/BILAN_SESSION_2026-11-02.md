# Compte rendu de session — 2 novembre 2026

## Périmètre effectué
Développement **sur branche séparée** `work/cdc-pack-pro-2026-11-02`, PR #31 **en brouillon**. Aucun des quatre fichiers de l'accueil approuvé ni la fiche produit officielle n'ont été modifiés. Aucun paiement réel, vente, prospection ni automatisation ChatGPT déclenchés.

## Livrables ajoutés
1. `docs/CAHIER_DES_CHARGES_CONSOLIDE_2026-11-02.md` — définition de terminé, exigences UI-01 à UI-10, portes métier, technique et juridique.
2. `docs/RECETTE_METIER_CONCIERGERIE_2026-11-02.md` — matrice P01–P15 / R01–R07, cas d'exception et critères de formats.
3. `docs/VALIDATION_OFFRE_PRIX_2026-11-02.md` — 8–12 entretiens proposés, 5 tests d'usage proposés et protocole de prix (aucun recrutement réalisé).
4. `docs/SPEC_PAIEMENT_LIVRAISON_NON_ACTIVE_2026-11-02.md` — PSP webhook signé, idempotence, ZIP privé et 18 scénarios de tests à faire.
5. `prototype-pack-conciergerie-3d.html` — proposition de page produit **isolée** : coffre dès le début, même clé Three.js que l'accueil, présentation pilote, exemples P01/P05/P08.
6. `assets/experience-product-preview.js`, `assets/product-preview.js`, `assets/product-preview.css` — chorégraphie d'introduction et onglets accessibles.
7. `tests/product-preview-static.mjs`, `tests/product-preview-browser.mjs`, `.github/workflows/verify-product-prototype.yml` — QA locale sur PR sans publication.

## Résultats de tests confirmés
- Première tentative : échec installation Playwright car runner `ubuntu-latest` = Ubuntu 26.04 non supporté par Playwright 1.56.1. Corrigé en fixant `ubuntu-24.04`.
- Deuxième tentative : test de placement utilisant `offsetTop` relatif à des parents distincts, faux négatif. Remplacé par un contrôle de l'ordre DOM.
- **Dernière recette : succès** — https://github.com/cosscoll/Pack-Proc-dures-Pro/actions/runs/41413512235
  - 3/3 contrôles statiques validés ;
  - Chromium WebGL2 1440 / 768 / 390 px ;
  - repli `prefers-reduced-motion` à 320 px ;
  - 0 débordement horizontal, 0 erreur JavaScript détectée;
  - cycle d'ouverture du coffre 3D testé sur les trois largeurs WebGL ;
  - onglets P01/P05/P08 et clavier (flèches, Home) vérifiés ;
  - lien vers l'exemple P01 accessible en HTTP ;
  - captures navigateur dans l'artefact (rétention 7 jours) :
    https://github.com/cosscoll/Pack-Proc-dures-Pro/actions/runs/41413512235/artifacts/13126298555
- Workflow « Verify public preview » de la PR : succès sur le dernier passage.

## Limites non résolues
- Les captures **n'ont pas encore été approuvées visuellement par le propriétaire**. L'ouverture 3D automatique testée ne suffit pas à juger les matières, le rythme et la cohérence artistique.
- Safari iOS / Android GPU physique et audit manuel d'accessibilité non testés.
- Aucun audit d'utilisateurs réels ni mesure de conversion.
- Les 15 procédures et 7 registres ne sont **pas validés** métier; les tests Microsoft Excel réels ne sont pas attestés.
- Prix 49 € non validé, statut vendeur, obligations légales, PSP et livraison réelle non résolus.
- Le vieux workflow public en échec du 22/10 (run 39790975753) détecte deux croisements avec `.offer-bottom` alors que le log signale une opacité de clé à zéro. À reproduire sur la version approuvée sans changer la chorégraphie pour calmer un test possiblement trop strict.

## Prochaines opérations de développement, sans décision commerciale
1. Revue des captures 1440/768/390/320 et correction de la lisibilité du prototype sans toucher à l'accueil.
2. Vérification de la chorégraphie aller-retour de la clé et du coffre au scroll, y compris variations de vitesse, ancrages, focus et rotation mobile.
3. Réduction de la surcharge de texte sur la page prototype, si les captures l'exigent; améliorer hover/focus utile.
4. Vérifier le produit pilote sur des documents **réels** et uniformiser les versions, sans révéler l'archive premium.
5. Préparer l'entretien métier par scénarios P01/P05/P08; décisions de validation à recueillir plus tard.
6. Corriger ou qualifier le workflow public BUG-001 sur la version approuvée, **sans modification visuelle non validée**.

## Règle de mise en production
La PR #31 reste DRAFT, ne doit pas être fusionnée avant approbation explicite. Le prototype n'est pas disponible sur le site public GitHub Pages.
