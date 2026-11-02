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
