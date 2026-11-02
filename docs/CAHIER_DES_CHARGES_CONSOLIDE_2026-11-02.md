# Cahier des charges consolidé — Pack Procédures Pro
Version de travail : 2026-11-02 · **Non validée commercialement** · Branche de préparation : `work/cdc-pack-pro-2026-11-02`

## 0. Règles de continuité et périmètre
- **Un seul business :** packs de procédures professionnelles téléchargeables. Les modèles, registres, checklists et guides sont des composants du pack, pas une boutique de produits génériques.
- **Accueil approuvé gelé.** Ne pas modifier `index.html`, `assets/cinematic.css`, `assets/apartment-scene.js` ni `assets/experience.js` sans validation expresse de l'expérience par le propriétaire du projet.
- Le template de page produit demandé **commence par la clé existante qui ouvre le coffre**, puis développe l'offre. Même bronze/ivoire/vert-noir, même rythme cinématique, hover et transition lente; aucune 3D aléatoire.
- Nouveaux prototypes isolés, sur branche de travail. Ne pas connecter la boutique ni publier automatiquement ces propositions.
- **Zéro vente, achat, paiement actif, dépense ou automatisation.** Prix indicatif 49 € non validé.
- Conserver la possibilité de revenir au dernier commit approuvé `366463f626d2f691645c9b16ae44e626b6a4cb3d`.

## 1. Produit pilote : conciergerie/location courte durée
**Public prioritaire :** gérant ou coordinateur de petite conciergerie ayant plusieurs intervenants/logements; coopération avec ménage, linge, maintenance et propriétaires.

**Promesse testable et prudente :** rendre explicites l'attribution d'une rotation, la confirmation, le contrôle, les anomalies et le passage de relais. **Aucune promesse chiffrée d'économie de temps ou de résultat.**

**Composition déclarée à contrôler :**
- P01 à P15 : quinze procédures en brouillon (DOCX modifiable + PDF de lecture envisagés).
- R01 à R07 : sept registres en CSV envisagés.
- Notice d'adaptation et limites d'usage : documents à personnaliser aux contrats et contraintes locales.
- Extrait gratuit P01 déjà public, mais ne doit pas être présenté comme version validée.
- Archives internes, variantes et tableur Excel doivent être réconciliés par SHA/numéro de version avant gel du produit.

**Périmètre exclu :** outil de réservation, conseil juridique ou sécurité certifiée, accès à des serrures, traitement de secrets de logement, logiciel SaaS, garantie de conformité métier.

## 2. Page produit immersive — exigences de recette
| ID | Exigence non négociable | Critère de validation |
|---|---|---|
| UI-01 | Intro = clé et coffre 3D, pas une page catalogue standard | Clé déjà présente; le scroll anime insertion, rotation, ouverture du couvercle réel |
| UI-02 | Cohérence avec accueil approuvé | Réemploi **du modèle** de clé, matériaux et mouvements lents; aucune nouvelle pose imposée au modèle |
| UI-03 | Découverte de l'offre | En quelques secondes, le visiteur identifie cible, composition 15+7, bénéfice concret et statut pilote |
| UI-04 | Preuve tangible | Bascules P01/P05/P08, contenus précis, procédure P01 complète en accès libre |
| UI-05 | Survol accessible | Hover, focus clavier et boutons clairement identifiables; absence d'information disponible seulement au survol |
| UI-06 | Mobile | 320, 390, 768 et 1440px sans débordement, texte jamais caché par clé/coffre, aucun menu verrouillé |
| UI-07 | Mouvement réduit | Alternative statique claire, liens et texte utilisables sans WebGL/CDN |
| UI-08 | Performance | Canvas limité en DPR; images/JS minimisés; mesure LCP, CLS et INP en situation réelle avant validation |
| UI-09 | Architecture | Prévisualisation isolée sans remplacer `pack-conciergerie.html` ni l'accueil |
| UI-10 | Réversibilité | Aucun checkout, aucune ressource privée du pack dans le dépôt public ou prototype |

**Important :** un test WebGL/SwiftShader ne remplace pas la validation visuelle sur iPhone/Android réel et l'appréciation artistique du propriétaire.

## 3. Validations métier — porte de sortie
**Aucun pack vendable tant que les quinze fiches et sept registres n'ont pas :**
1. Un propriétaire de contenu et une version identifiée.
2. Une revue par un professionnel pratiquant la conciergerie, avec scénario concret et critères d'acceptation.
3. Des rôles/acteurs, déclencheurs, entrées, étapes, cas d'exception, sortie attendue et traces clairement documentés.
4. Des adaptations aux contrats réels, sans règles réglementaires inventées.
5. Un contrôle RGPD/minimisation des données pour les registres (aucun code d'accès, secret, donnée sensible inutile).
6. Une vérification des modèles DOCX/PDF/CSV et de leur impression, ainsi qu'un vrai essai dans les logiciels annoncés.

Détail et matrice : `docs/RECETTE_METIER_CONCIERGERIE_2026-11-02.md`.

## 4. Parcours marchand futur (interdit d'activation tant que les portes 1–5 ne sont pas fermées)
1. Page produit => preuve P01 => prix définitif TTC / informations précontractuelles => commande.
2. Paiement via prestataire de paiement, **webhook signé côté serveur**, idempotence, anti-rejeu, secret hors dépôt.
3. Validation de paiement par webhook faisant autorité, pas via une simple URL de succès.
4. Délivrance d'un fichier versionné et contrôlé SHA-256 à l'acheteur, lien temporaire à portée et durée limitées.
5. Email transactionnel de confirmation/contrat sur support durable, facture selon règles applicables.
6. Traitement des téléchargements expirés, incidents, remboursements et rétractations; journal de preuves sans exposer de données.
7. Essais PSP **sandbox officiels** puis autorisation expresse pour tout mode réel.

## 5. Juridique, fiscalité, données : revue obligatoire
- Identité du vendeur, statut, coordonnées, mentions légales, CGV et information précontractuelle (prix TTC, formats, compatibilité, livraison, garanties, réclamations).
- Segment B2B/B2C à décider : les obligations applicables ne sont pas identiques.
- Si vente à un consommateur : droit de rétractation et ses exceptions; consentement exprès + reconnaissance expresse de perte du droit **et confirmation durable** si commencement anticipé de livraison numérique, selon les conditions légales. La fonctionnalité de rétractation en ligne est obligatoire depuis le 19/06/2026 pour les contrats conclus en ligne dans son champ.
- Médiateur de la consommation si applicable, règles de TVA/facturation et mentions obligatoires.
- Traitement de données limité, politique de confidentialité documentée, traceurs et consentement si nécessaire.
- Propriété intellectuelle et licences des documents/images/polices/CDN; éviter d'exposer l'archive premium dans un dépôt public.

**Sources officielles, à vérifier à la date de mise en vente :**
- DGCCRF, rétractation (02/10/2026) : https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/delais-de-reflexion-ou-de-retractation-comment-sappliquent-t-ils
- DGCCRF, contrat et informations : https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/le-contrat-un-accord-entre-des-parties-bien-informees-au-prealable?language=fr
- DGCCRF, prix TTC : https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/linformation-sur-les-prix
- CNIL, mesure d'audience : https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience
Ces sources n'équivalent pas à une validation juridique.

## 6. Architecture & sécurité — jalons
- J1 : préserver l'accueil, disposer d'un **prototype produit privé à la publication** sur branche et testable par lecteur HTML.
- J2 : rendre le prototype réellement conforme au mouvement clé/coffre et à la navigation accessible.
- J3 : statiques, navigateur HTTP, WebGL, hover/focus, zoom, reduced-motion; QA visuelle 320/390/768/1440.
- J4 : validation métier P01–P15/R01–R07, tests DOCX/PDF/CSV et Excel réel, contrôle juridique.
- J5 : prix/offre validés, tunnel sandbox & livraison, tests incident et remboursement, décision d'ouverture.
- J6 : publication et mesures de conversion seulement après accord explicite.

## 7. Défauts relevés et état probant au 02/11/2026
| ID | Problème | État | Suite |
|---|---|---|---|
| BUG-001 | Run public `39790975753` en échec malgré Pages vert | **Ouvert** : à 1440px, 2 croisements détectés avec `.offer-bottom` pendant le footer alors que l'opacité de la clé est rapportée à 0 | Confirmer seuil visible et collision réelle; ne jamais modifier les mouvements approuvés pour contourner le test |
| UX-001 | `pack-conciergerie.html` sans clé/coffre, trop éloignée de l'accueil | Ouvert | Préparer une maquette distincte, sans remplacer la fiche existante |
| PROD-001 | 15 procédures et 7 registres non validés métier | Bloquant | Revue avec preuves |
| PROD-002 | Tests Microsoft Excel réels non attestés | Bloquant | Recette manuelle et compatibilité |
| LEG-001 | Statut vendeur, prix, CGV et rétractation non finalisés | Bloquant | Décisions avant paiement |
| PAY-001 | Aucun checkout ou webhook officiel en production | Bloquant pour vente, **conforme au pré-lancement** | Spécifier et tester en sandbox après validation |

## 8. Définition de « terminé »
- **Page produit validée :** conforme aux 10 critères UI, approuvée explicitement par le propriétaire, sans dégrader l'accueil.
- **Pack validé :** matrice 22/22 signée, toutes réserves bloquantes corrigées et archives vérifiées.
- **Boutique opérationnelle :** revue juridique complète, prix validé, sandbox de bout en bout, puis autorisation expresse d'activer le réel.
- **Vente vérifiée :** commande réelle autorisée, paiement confirmé, facture/confirmation et livraison tracées, demande de remboursement/retrait testée.

## 9. Traçabilité vérifiable du cahier des charges — complément du 02/11
Les exigences préparées sont documentées dans les ressources **de travail**, non dans une offre commercialisable.

| Sujet | Source de travail | Critère de clôture |
|---|---|---|
| Roadmap / priorités | `docs/PLAN_REALISATION_CDC_2026-11-02.md` | jalons 1, 2 et 3 et dépendances fermés |
| Inventaire des pièces | `data/validation-conciergerie.json` | P01–P15, R01–R07; relecteur, version, SHA, preuve et tests formats |
| Test automatisé de l'inventaire | `tests/validation-manifest.test.mjs` | tout statut « valide » exige preuves de version et formats |
| Matrice métier | `docs/RECETTE_METIER_CONCIERGERIE_2026-11-02.md` | revue professionnelle 22/22 |
| Cas end-to-end | `docs/SCENARIOS_ACCEPTATION_2026-11-02.md` | 12/12 scénarios testés sur fichiers finaux |
| Marché et prix | `docs/VALIDATION_OFFRE_PRIX_2026-11-02.md` | besoins et tarifs vérifiés avant décision |
| Obligations légales | `docs/CONFORMITE_COMMERCE_NUMERIQUE_2026-11-02.md` | statut B2B/B2C, rétractation, facturation, RGPD et licence validés |
| Paiement et livraison | `docs/SPEC_PAIEMENT_LIVRAISON_NON_ACTIVE_2026-11-02.md` | 18 tests sandbox officiels, aucune activation sans autorisation |
| Contrôle UX technique | `tests/product-preview-browser.mjs` | clé/coffre/WebGL réversibles, tests responsive, clavier, modes de repli |

**Règle de preuve :** une suite de tests réussie ne ferme que les critères qu'elle couvre. Elle ne valide ni la qualité métier des documents, ni le rendu visuel sur téléphone réel, ni la conformité juridique, ni l'acceptation du propriétaire.

## 10. Lot complémentaire — contrats métier, sources et recette accessibilité (02/11)
Ce lot ne change **ni les originaux**, ni le statut non marchand du projet.

- **Comparaison avec l'échantillon réel DOCX V03** : `docs/AUDIT_ECHANTILLON_DOCX_2026-11-02.md`, cinq écarts E01–E05 identifiés, dont sévérité P08, états de disponibilité P05 et ambiguïté à l'étape 7 P01. Le document original n'a pas été modifié.
- **Contrats des sept registres** : `data/registry-contracts.json` (structure des champs, énumérations, références et protection des données) + `docs/CONTRATS_REGISTRES_R01_R07_2026-11-02.md`. Ce sont des schémas de recette, **pas les CSV définitifs**.
- **Validateur synthétique** : `scripts/registry-contracts.mjs` et `tests/registry-contracts.test.mjs`. Contrôle un état « prêt » seulement si affectation, accord, intervention terminée, inspection et absence d'incident bloquant non vérifié. Distingue gravité (mineure/majeure/critique) et blocage de l'arrivée.
- **Contenu commercial du prototype** : un inventaire progressif en quatre familles présente les **15 procédures et 7 registres**, en plus des cas P01/P05/P08, sans exposer les archives premium.
- **Accessibilité** : tests `tests/product-preview-a11y.mjs` sur 3 sections × 3 formats, avec correction de la transparence persistante en fin d'offre et des contrastes du repère de chapitre et du sceau, dans le CSS/JS du prototype seulement.
- **Preuve CI** : workflow `41417747815` du 02/11/2026 : 25/25 tests statiques réussis, WebGL2 validé à 1440/768/390, fallback à 320, coffre 3D réversible, 0 débordement/erreur JS sur parcours testé, 9 scans axe-core **sans violation automatique**.
- **Lien de preuve** : https://github.com/cosscoll/Pack-Proc-dures-Pro/actions/runs/41417747815

### À ne pas inférer des tests
Un audit axe-core sans violation ne certifie pas la conformité RGAA/WCAG, les lecteurs d'écran, la lisibilité visuelle réelle, les performances GPU iPhone/Android ou la qualité de vente. La matrice R01–R07 reste non validée par des utilisateurs métiers; les CSV et Excel réels n'ont pas été testés, l'ancien manuel V0.2/ZIP V0.52 doit encore être confronté aux nouvelles spécifications, le tarif n'est pas approuvé et la boutique n'est pas autorisée.

**Décision de diffusion :** prototype en PR brouillon, accueil officiel et fiche officielle inchangés. Toute intégration nécessite validation explicite du propriétaire.

## 11. Contrôle des véritables livrables et correctif V0.6 — 02/11/2026

L'archive source interne a été récupérée en lecture seule depuis Google Drive : `Business01_Pack_Pilote_V052_INTERNE_2026-10-15.zip` (SHA-256 `81e610819733ae03302e37359e64a1f2f62c428c44ee8f7226fa6abd3160022b`). **26/26 fichiers** du manifeste interne ont passé la vérification de taille et d'empreinte.

**Constat :** manuel **15/15** procédures V0.2, sept modèles CSV V0.3 **entièrement vierges**, soit **88 colonnes et 0 donnée métier**. Le contrat expérimental `data/registry-contracts.json` est **incompatible en import direct** avec les modèles V0.3. Toute page commerciale devra dire « sept modèles de registres à remplir », pas suggérer un outil déjà connecté aux données du client.

**Correctif de travail hors du dépôt public :** manuel DOCX V0.6 avec cinq corrections de formulation et de traçabilité dans P01, P05, P08. P01/P05/P08 portent la version `0.6-r1`, les 12 autres restent `0.2`; document rendu et inspecté sur **17 pages**. Les sept CSV existants ont été conservés **octet pour octet**. Sept jeux d'exemples fictifs ont été contrôlés par leurs en-têtes et références croisées ; aucune utilisation dans Excel réel.

Le paquet `Pack_Procedures_Pro_V06_BROUILLON_INTERNE.zip` est un **livrable privé d'examen**, pas un produit approuvé : aucun PDF V0.6, aucune certification, aucun chargement sur GitHub public, aucun paiement.

**Trace durable :**
- Audit des résultats et des risques : `docs/AUDIT_ARCHIVE_SOURCE_2026-11-02.md`.
- Contrat source des 7 CSV : `data/legacy-v03-csv-contract.json`.
- Tests anti-migration implicite : `tests/legacy-v03-csv.test.mjs`.
- Audit interne également archivé dans le Drive Business 01 :
  https://docs.google.com/document/d/1mkZfp5byvoileQgg1zXSTvnfu9y34gB2qIAuSNBOuyY/edit

**Nouvelles portes obligatoires avant vente :**
1. Comparer les fichiers finalisés aux véritables formats V0.3/V0.6, et décider des transformations de données avec un praticien.
2. Tester les imports et exports sur les logiciels réellement annoncés, dont Excel si promis.
3. Faire valider chacune des 15 procédures, chacun des sept modèles, leurs statuts et leurs exceptions par les personnes compétentes.
4. Finaliser les versions, la licence, les PDF et les tests de délivrance **avant** de considérer le pack marchand.
