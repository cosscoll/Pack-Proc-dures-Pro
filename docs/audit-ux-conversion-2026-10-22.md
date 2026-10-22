# Audit UX/UI & conversion — Procédures Pro

**Date :** 22 octobre 2026  
**Périmètre :** accueil cinématique, fiche du pack conciergerie et procédure gratuite P01.  
**Méthode :** Playwright en Chromium + axe-core WCAG 2.2 (tests automatiques) sur le site public, 1440 × 900 px et 390 × 900 px, avec captures par étape. Première exécution : [GitHub Actions — UX audit](https://github.com/cosscoll/Pack-Proc-dures-Pro/actions/runs/39783280487). Images et rapports JSON dans l'artifact `ux-audit-screenshots` (rétention 7 jours). Les mesures ne sont pas une observation d'acheteurs réels.

## Parcours audité

| Étape | État avant modification | Diagnostic |
| --- | --- | --- |
| 01. Découverte / accueil | Lien direct vers la fiche visible dans le premier écran ; accueil long (~9 730 px bureau / ~8 144 px mobile) | Une expérience immersive est volontaire, mais il faut pouvoir aller directement au produit ; titre très conceptuel |
| 02. Fiche produit | Premier écran accessible ; ~8 201 px bureau et ~9 632 px mobile | Forte densité mobile, promesse trop abstraite, un seul aperçu statique de P01 |
| 03. Compréhension du contenu | 15 procédures annoncées ; P01/P05/P08 décrites, 7 registres énumérés | La preuve doit être manipulable ; ne pas inventer la description de P02–P15 tant que la relecture métier n'est pas terminée |
| 04. Vérification par le prospect | Exemple P01 gratuitement accessible sans compte | Point positif ; rendre son accès primaire, avant de demander une décision |
| 05. Achat éventuel | 49 € envisagés, pas de prix définitif ni de paiement actif | Ne pas simuler d'achat, d'avis clients ou de garanties ; la validation métier et le lancement commercial restent bloquants |

### Indicateurs automatiques de la ligne de base
- HTTP 200 sur les 3 pages aux 2 largeurs.
- Aucun débordement horizontal détecté à 1440 ou 390 px, ni erreur JS lors de ce premier parcours.
- Aucun lien d'ancre local cassé.
- **axe-core :** 1 problème de contraste sérieux sur l'accueil bureau (`.offer-stamp > small`) ; 7 occurrences sur les numéros des registres en fiche produit aux deux largeurs. Aucun axe issue détecté sur P01 dans cet échantillon.
- Cibles légères de hauteur ~22–23 px sur quelques liens ; des corrections de zone de clic ont été ajoutées. Les règles WCAG 2.2 ont des exceptions de taille et d'espacement : une mesure de 22 px n'implique pas à elle seule une non-conformité.

## Corrections publiées sur `main`
1. Accueil : texte centré sur les bénéfices réels (confirmations, contrôle, transmission) et les livrables `15 procédures / 7 registres` ; lien produit rendu visible en permanence dans l'en-tête mobile.
2. Offre : formats DOCX, PDF, CSV explicités ; bénéfices rendus plus concrets sans taux de réussite ni témoignages inventés.
3. Fiche produit : titre et introduction plus directs, un bouton d'essai gratuit prioritaire, deuxième lien vers le détail des 22 documents.
4. Preuve : présentoir interactif P01 / P05 / P08, trois séquences d'étapes factuelles par cas, commandes `aria-pressed`, interactions locales sans collecte.
5. Longueur : espaces et marges de la fiche resserrés, avec conservation de la direction artistique éditoriale.
6. Accessibilité : renforcement du contraste des petits textes identifiés et augmentation de la zone de clic des liens concernés.
7. Préservation totale des scripts `assets/apartment-scene.js` et `assets/experience.js` : ni clé, ni coffre, ni leur chronologie n'ont été modifiés pour ce chantier commercial.

## À contrôler avant de vendre

1. Faire valider sur le terrain les 15 procédures, les sept registres et leurs adaptations ; publier ensuite le sommaire final détaillé.
2. Fixer un prix et un cadre contractuel réels ; juridiction, statut vendeur, facturation, TVA, CGV, propriété intellectuelle, livraison et rétractation applicables.
3. Connecter un paiement et une livraison après autorisation explicite ; aucun encaissement en production aujourd'hui.
4. Vérifier avec de vrais utilisateurs la compréhension de l'offre en moins de 10 secondes, la qualité de P01 et la décision de poursuivre vers la fiche produit.
5. Lorsque la commercialisation sera possible, mesurer *clic accueil → fiche*, *clic fiche → essai P01*, puis *intention → commande réelle* avec un dispositif conforme et documenté. Aucun suivi comportemental nouveau n'est installé.

### Limites
Les captures Playwright et vérifications axe sont automatiques ; elles ne prouvent pas la qualité visuelle subjective, ni la conformité RGAA/WCAG, ni un taux de conversion ou des ventes. Les résultats comparatifs post-correctifs sont à lire dans les exécutions ultérieures du workflow. Les pages utilisent des éléments 3D qui nécessitent aussi une recette WebGL spécifique.

### Références
- [Nielsen Norman Group — Product pages](https://www.nngroup.com/articles/ecommerce-product-pages/) : description utile, détails, disponibilité et transparence.
- [W3C WAI — WCAG 2.2](https://www.w3.org/TR/WCAG22/) : contraste, focus et taille des cibles interactives.
