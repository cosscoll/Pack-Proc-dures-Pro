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

## Complément — poursuite du travail sur le cahier des charges (02/11/2026)
Nouveaux livrables **non commerciaux**, tous dans la même PR #31 DRAFT :
- `docs/CONFORMITE_COMMERCE_NUMERIQUE_2026-11-02.md` : matrice juridique B2B/B2C, fonctionnalité de rétractation en ligne en vigueur depuis juin 2026, calendrier DGFIP de facturation électronique applicable selon statut, source officielles et décisions laissées en attente.
- `data/validation-conciergerie.json` : **22 entrées** P01–P15/R01–R07, chacune avec scénario, statut, relecteur/version/preuve/format; toutes `a_valider`.
- `tests/validation-manifest.test.mjs` : vérifie le nombre et l'unicité des 22 pièces, interdit une validation sans preuve/empreinte/source/relecteur et assure l'absence d'archives premium.
- `docs/SCENARIOS_ACCEPTATION_2026-11-02.md` : 12 cas transversaux P/R, dont non-confirmation, réservation avancée, logement non prêt et passation multi-intervenants. **0/12 exécutés**.
- `docs/PLAN_REALISATION_CDC_2026-11-02.md` : 19 lots/portes, jalons et responsabilités identifiés.
- `docs/CAHIER_DES_CHARGES_CONSOLIDE_2026-11-02.md` : annexe de traçabilité vers tous les tests et documents ci-dessus.
- Page prototype : le coffre d'ouverture est désormais **dans la balise `main`**, avec un H1 unique en première scène. Styles typographiques préservés.
- Test Playwright enrichi : ouverture **et fermeture inverse** au scroll, contrôle des **sept positions originales** de la clé.

### Dernière recette entièrement achevée et vérifiée
GitHub Actions : https://github.com/cosscoll/Pack-Proc-dures-Pro/actions/runs/41414829048
- **7/7 tests statiques réussis**, y compris la matrice 22/22.
- **WebGL2** : 1440, 768 et 390px; **repli reduced-motion** : 320px.
- **Ouverture puis fermeture inverse du coffre réussies** sur les trois largeurs WebGL2.
- **0 débordement horizontal et 0 erreur JavaScript** relevés pendant ce parcours automatisé.
- **Pas de validation visuelle humaine**, de qualité métier, de compatibilité mobile physique, de prix ni de conformité juridique à déduire de ces résultats.

### Invariants de sécurité et publication
Comparaison `main` → branche de travail effectuée : l'accueil `index.html`, `assets/cinematic.css`, `assets/apartment-scene.js`, `assets/experience.js` et la fiche officielle `pack-conciergerie.html` restent inchangés. La PR #31 demeure un **brouillon non fusionné**, sans vente, checkout ni publication du prototype sur le site d'origine. Aucune automatisation ChatGPT créée ou réactivée.

## Session complémentaire — consolidation métier et page produit (02/11/2026)
**Objectif :** réduire l'écart entre cahier des charges, documents sources réels et prototype commercial, sans toucher à la version validée.

### Source métier confrontée
- Document Drive original `Business01_Echantillon_3_Procedures_A4_V03.docx` consulté en lecture seule : P01, P05 et P08, tous indiqués SOP V0.1, édités le 15/10. La nomenclature V03 du contenant n'établit pas la version métier du pack.
- **5 écarts E01–E05** documentés, notamment gravité « critique/majeur/mineur » P08, états « prêt/à corriger/bloqué » P05 et mention du « dernier contrôle » dans la clôture de planification P01.
- Archive V0.52 et manuel V0.2 non ouverts dans ce lot; aucune validation métier déduite de l'échantillon.

### Produit : travail nouveau
- `data/registry-contracts.json` : structure proposée des sept registres R01–R07, types/énumérations et liens P01–P15.
- `scripts/registry-contracts.mjs` + `tests/registry-contracts.test.mjs` : gardes sur affectation, confirmation, inspection, incident bloquant, stock, passation, version, données minimales et injection de formule.
- `docs/CONTRATS_REGISTRES_R01_R07_2026-11-02.md` : usage des champs et limites.
- `docs/RELECTURE_P01_P05_P08_2026-11-02.md` et `docs/AUDIT_ECHANTILLON_DOCX_2026-11-02.md` : dossier de validation et divergences.
- Prototype: nouveau sommaire natif en **quatre familles (15 procédures et 7 registres)**, toujours sans les fichiers premium.
- Contrôle axe-core ajouté à l'intégration continue; corrections d'animations d'opacité et de contrastes faites uniquement dans les CSS/JS du prototype.

### Recette finale de ce lot
**GitHub Actions réussi :** https://github.com/cosscoll/Pack-Proc-dures-Pro/actions/runs/41417747815

- **25 tests statiques passés**, 0 échec ;
- WebGL2 / clé-coffre sur 1440, 768 et 390 px; mode réduit à 320 px ;
- vérification de l'ouverture et de la fermeture réversible du coffre ;
- inventaire interactif 22/22, bascule de P01/P05/P08 et clavier contrôlés ;
- aucun débordement horizontal ni erreur JavaScript dans les parcours automatisés ;
- **9 audits axe-core WCAG ciblés sans violation détectée** : 3 sections (coffre, inventaire, extraits) × 3 largeurs (1440, 390, 320).

Les premiers contrôles axe-core sur les nouveautés ont échoué à cause de l'opacité d'un ancien groupe, du contraste du sceau et de la transition du repère actif. Les trois causes ont été corrigées **dans le prototype** avant la recette verte; ne pas cacher les anciens échecs de l'historique Actions.

### Restent ouverts
1. Relecture graphique humaine du prototype et appareils iOS/Android réels.
2. 22/22 validations métier indépendantes et 12/12 scénarios fonctionnels sur les **fichiers finaux**.
3. Import/export réel des CSV et contrôle Microsoft Excel, PDF/DOCX finaux et manifestes SHA.
4. Prix, B2B/B2C, identité fiscale/juridique, contrats et paiements sandbox à valider.
5. Intégration du prototype : **pas de fusion de la PR #31**, pas de publication commerciale.

**Statut : progrès vérifié sur la spécification et le prototype, lancement toujours bloqué.**
