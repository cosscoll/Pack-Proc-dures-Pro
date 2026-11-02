# Plan d'exécution du cahier des charges — état contrôlé 02/11/2026
Version de travail liée à la PR #31 (DRAFT, non fusionnée).

## Portes et dépendances
| ID | Lot | État constaté | Preuve / critère de clôture | Priorité |
|---|---|---|---|---|
| SITE-01 | Accueil 3D préservé | **PRÉSERVÉ** | Aucun des fichiers approuvés n'est modifié dans la PR #31 | P0 |
| SITE-02 | Page produit clé → coffre | **PROTOTYPE** | Rendu WebGL / scrolling réversible / responsive validés en CI; revue esthétique propriétaire en attente | P0 |
| SITE-03 | Extraits P01/P05/P08 interactifs | **PROTOTYPE TESTÉ** | Onglets clavier et liens P01 testés en CI | P0 |
| SITE-04 | Navigation et hiérarchie H1 | **CORRIGÉ DANS PROTOTYPE** | coffre inclus dans main, H1 unique, tests automatiques | P0 |
| SITE-05 | Contrôle qualité sur Safari/iOS, Android GPU | **NON TESTÉ** | QA matérielle, lecteur d'écran, zoom et FPS sur appareils | P1 |
| SITE-06 | Anomalie collision/clé invisible dans l'accueil public (run 39790975753) | **À REPRODUIRE** | prouver visibilité et absence de chevauchement sans altérer trajectoire validée | P1 |
| MET-01 | Inventaire P01–P15/R01–R07 | **22 ENTRÉES INVENTORIÉES, MATRICE DE RELECTURE CRÉÉE** | data/validation-conciergerie.json, 22 titres et scénarios; 0/22 validés | P0 |
| MET-02 | Révisions par praticiens | **BLOQUÉ** | relecteurs qualifiés et preuves indépendantes sur 22 pièces | P0 |
| MET-03 | Scénarios croisés métier | **12/12 SOUS-TESTS SYNTHÉTIQUES VALIDÉS, 0/12 RECETTES MÉTIER COMPLÈTES** | 12/12 scénarios réels acceptés, correctifs fermés | P0 |
| MET-04 | Tests vrais formats DOCX/PDF/CSV/Excel | **PARTIEL** : DOCX V0.6 rendu (17 p.), PDF de consultation V0.6 produit (17 p., sélectionnable, sans erreur de préflight), 7 CSV cohérents sur exemples fictifs; Excel réel et PDF commercial final non validés | QA complète sur fichiers finaux et import Excel réel | P0 |
| MET-05 | Emballage du ZIP final sécurisé | **BROUILLON PRIVÉ V0.6.1** : ZIP intègre DOCX corrigé et CSV historiques inchangés; pas de livraison finale | archive finale validée métier/juridique, testée et versionnée | P1 |
| MARKET-01 | Entretiens conciergeries | **PROTOCOLE PRÉPARÉ** | 8–12 observations consenties, comptes rendus anonymisés | P1 |
| MARKET-02 | Prix de vente définitif | **NON DÉCIDÉ** | coûts, TVA, concurrence, test terrain, décision écrite | P0 |
| LEG-01 | Identité vendeur / conditions / licence | **NON VALIDÉ** | validation juridique documentée | P0 |
| LEG-02 | Parcours B2C rétractation en ligne | **SPÉCIFIÉ, NON DÉPLOYÉ** | champs, accusé et preuves conformes si B2C | P0 |
| LEG-03 | Facturation électronique 2026/2027 | **PÉRIMÈTRE À ARBITRER** | statut assujetti, canal, opérateur agréé, e-reporting | P0 |
| PAY-01 | Checkout & webhooks PSP | **SPÉCIFIÉ, NON BRANCHÉ** | tests sandbox 18/18, sécurité et approbation explicite | P0 |
| PAY-02 | Livraison automatique | **SPÉCIFIÉ, NON BRANCHÉ** | archives privées, jetons expirables, remboursement/reprise testés | P0 |
| LAUNCH-01 | Publication finale et mesure | **INTERDITE À CE STADE** | accord explicite après fermeture des portes précédentes | P0 |

## Ce qui peut avancer sans aucune intervention
- Démonstration non marchande du pack et corrections de code **dans le prototype isolé seulement**.
- Renforcer les tests HTTP / clavier / reduced-motion / scroll aller-retour / cohérence des poses 3D.
- Affiner les fiches de recette métier et rédiger les jeux de cas **fictifs**.
- Contrôler les nomenclatures, inventaires et intégrité sans exposer les archives premium.
- Préparer les formulaires d'entretiens et la documentation du parcours marchand, sans envoyer ni engager de dépense.

## Ce qui réclamera une décision ou une preuve extérieure
- Approbation finale du design produit.
- Audit par des praticiens réels de la conciergerie et tests logiciels annoncés.
- Identité et statut du vendeur, territoire, B2B/B2C, prix TTC et licence.
- Configuration d'un PSP et décision d'activer le sandbox puis le réel.
- Publication et prospection : pas d'initiative autonome sans autorisation commerciale.

## Critère de jalon 1 : « prototype de page produit à soumettre »
- [x] Clé et coffre au début, sur branche séparée.
- [x] 3 extraits interactifs.
- [x] WebGL2/320 reduced-motion, zéro débordement dans Chromium CI.
- [x] Ouverture 3D du coffre; fermeture inverse couverte par recette.
- [x] Accueil et fiche originale inchangés.
- [ ] Revue humaine des captures desktop/mobile.
- [ ] Vérification Safari/Android matériel.
- [ ] Réglage fin du tempo, des interactions hover et des zones de texte selon revue.

## Critère de jalon 2 : « pack pilote prêt pour validation professionnelle »
- [x] 22 références listées et associées à un scénario.
- [x] 12 cas transversaux de tests préparés.
- [ ] Inventaire des fichiers réels avec versions et SHA de chaque entrée.
- [ ] Couverture de 15 procédures et 7 registres par revue métier indépendante.
- [ ] Tests réels DOCX/PDF/CSV et tableur.
- [ ] Rapport correctifs + versions figées.

## Critère de jalon 3 : « autorisation de mise en vente »
- [ ] Qualité métier du produit attestée.
- [ ] Coût et prix final approuvés.
- [ ] Conformité vendeur/CGV/RGPD/rétractation/facturation validée selon champ.
- [ ] 18 cas PSP sandbox testés sur infrastructure autorisée.
- [ ] Licence, support, remboursement, livraison, emails contractuels prêts.
- [ ] Approbation écrite d'ouvrir les ventes.

**Avancement sans ambiguïté :** aucun de ces trois jalons n'est entièrement clos au 02/11/2026. Les validations métiers, juridiques et commerciales restent à réaliser, pas à inventer.

## Découverte vérifiée après analyse de la véritable archive V0.5.2
Le ZIP interne du 15 octobre a été récupéré en lecture seule, ouvert, et ses **26 fichiers vérifiés par SHA-256**. Le manuel contient 15/15 procédures ; les sept CSV historiques ont **88 colonnes mais zéro ligne métier**. Leurs en-têtes V0.3 ne sont **pas compatibles directement** avec le nouveau schéma R01–R07 conçu en branche.

- **Nouveau lot MET-06** : décider de la coexistence du CSV V0.3 historique et du contrat R01–R07 expérimental; préparer la migration sur copies contrôlées et tests de non-régression (NON VALIDÉ).
- **Nouveau lot MET-07** : révision de travail V0.6 des trois procédures P01/P05/P08; cinq passages corrigés; 17 pages Word rendues et vérifiées, sans validation professionnelle (PRÉPARÉ).
- **Nouveau lot MET-08** : exemples CSV séparés et fictifs pour sept registres, relations vérifiées sans double réservation; tests d'import dans les tableurs réels à faire (PARTIEL).
- **Preuves** : `docs/AUDIT_ARCHIVE_SOURCE_2026-11-02.md`, `data/legacy-v03-csv-contract.json` et `tests/legacy-v03-csv.test.mjs`. Les fichiers révisés complets restent hors GitHub public.
- **Décision de publication** : archive V0.6 privée et prototype en branche; accueil validé préservé, aucune vente.

## Lot de travail autonome — contrôle approfondi des CSV historiques et PDF
- **MET-09 / Réalisé techniquement** : ajout du validateur `scripts/legacy-v03-qa.mjs` (CSV historique réel à champs exacts, règles anti-injection, jointures R01/R02/R03/R05/R06/R07, recoupement des incidents, pas de double rotation). `tests/legacy-v03-qa.test.mjs` : **21/21 réussis**, dont C01–C12 partiellement.
- **MET-10 / Réalisé techniquement** : PDF de consultation issu du Word corrigé, **17 pages A4**, texte sélectionnable, préflight sans avertissement; paquet privé de pré-recette **V0.6.1** avec manifeste SHA-256 **26 fichiers vérifiés**, jamais publié dans GitHub.
- **MET-11 / Prêt à soumettre** : matrice de contrôle professionnelle pour P01–P15/R01–R07 dans `docs/MATRICE_REVUE_15_PROCEDURES_2026-11-02.md`; **0/22 relectures indépendantes** effectuées.
- **État des CSV fictifs testés** : zéro erreur, un avertissement volontaire sur une passation non accusée R05; cela illustre le contrôle attendu, sans prouver l'utilisation réelle d'une conciergerie.
- **Preuve technique** : run GitHub https://github.com/cosscoll/Pack-Proc-dures-Pro/actions/runs/41427069897 = **52/52 tests au vert**, prototype 3D et accessibilité automatisée au vert.
- **Aucune activation commerciale, automatisation, fusion de PR ou modification du site validé**.
