# Audit vérifié de l'archive pilote V0.5.2 — 02/11/2026
**Audit de l'archive source réellement ouverte en environnement privé.** Aucun document complet destiné à la vente n'est commité dans ce dépôt GitHub public.

## Source et intégrité
- Fichier de référence Google Drive : `Business01_Pack_Pilote_V052_INTERNE_2026-10-15.zip` (329 618 octets).
- **SHA-256 archive** : `81e610819733ae03302e37359e64a1f2f62c428c44ee8f7226fa6abd3160022b`.
- Le fichier `MANIFEST_SHA256.json` de l'archive référence **26 fichiers** : **26/26** correspondances empreinte/taille vérifiées.
- Le manuel original DOCX comprend **15 procédures P01–P15 et 15 tableaux de versions**; les métadonnées des fiches indiquent V0.2.
- Les **sept CSV V0.3 sont des fichiers de modèles avec un unique en-tête**. Total : **88 colonnes**, **zéro enregistrement métier**. L'affirmation « sept registres prêts » doit donc être comprise comme sept *modèles vierges*, pas une base remplie et validée.
- L'archive comprend un classeur `Tableau_de_bord_operations_V05.xlsx` et des rapports de recettes fictives. **Le classeur n'a pas été ouvert ni modifié lors de ce contrôle**, et aucun essai Excel réel n'est attesté.
- Les PDF source ne sont pas modifiés; une nouvelle exportation PDF du DOCX corrigé nécessitera une recette visuelle distincte avant diffusion.

## Risque bloquant révélé : deux nomenclatures non compatibles
Les fichiers CSV V0.3 physiques **ne suivent pas** les colonnes prévues par le nouveau contrat expérimental `data/registry-contracts.json`. Un logiciel qui prendrait ces schémas expérimentaux pour les fichiers livrés n'importerait pas correctement les données.

Les **en-têtes d'origine, par registre**, et les correspondances directes possibles sont inventoriés sans publier les CSV dans :
- `data/legacy-v03-csv-contract.json` — sept jeux d'en-têtes réels, 88 champs, transformations explicites requises;
- `tests/legacy-v03-csv.test.mjs` — assertions pour empêcher de déclarer les deux formats identiques.

### Décisions à appliquer
1. **V0.3 reste le format actuellement livré dans l'archive pilote.** Ne pas remplacer ses en-têtes ni promettre une compatibilité sans essais.
2. Le contrat `R01–R07` déjà programmé sur branche reste un **schéma cible exploratoire**, pas le contrat du produit existant.
3. Mapper `R02` de façon conservatrice : `confirmation_mission_le` est un horodatage, pas un `confirmation_ref`; `controle_effectue_le` est un horodatage, pas une preuve `inspection_ref`; `anomalies_bloquantes_ouvertes` n'est pas un rapprochement indépendant avec `R03`.
4. En `R03`, distinguer la sévérité (`gravite`) de l'impact bloquant sur arrivée (`impact_arrivee`), puis de la vérification après résolution (`resolution_verifiee_le`).
5. En `R05`, conserver les références des deux personnes ; leur rôle commun ne prouve pas qu'il s'agit de la même personne.
6. En `R07`, l'ancienne structure ne contient pas d'empreinte SHA-256 ; preuve de validation et traçabilité de version nécessitent un contrôle documentaire indépendant.
7. La migration, les formats d'import et les libellés doivent être validés auprès d'utilisateurs métiers puis testés sur les vrais outils annoncés. **Aucune migration automatique n'est autorisée à ce stade.**

## Révision documentaire V0.6 créée hors GitHub public
Une **nouvelle copie de travail privée** du manuel a été produite :
- Procédures **P01, P05 et P08** corrigées de façon conservatrice sur **5 paragraphes** au total; données métier, délais et responsabilités spécifiques toujours à valider.
- Métadonnées des fiches corrigées : P01/P05/P08 = `0.6-r1` datées du 02/11/2026; les 12 autres restent `0.2`.
- Rendu du DOCX révisé inspecté sur **17 pages A4**; une page orpheline P08 détectée puis corrigée par mise en page.
- Sept CSV V0.3 **conservés octet pour octet**, plus sept exemples CSV de test avec références fictives, séparés des modèles vierges. Un exemple de rotation bloquée R02 est relié à un incident non vérifié R03.
- Archive de révision privée `Pack_Procedures_Pro_V06_BROUILLON_INTERNE.zip`, intégrité ZIP et manifeste SHA vérifiés. **Pas de publication de ses fichiers dans GitHub public, pas de vente.**
- Le rapport d'audit détaillé et sa trace sont enregistrés dans le Google Drive du projet.

## Feuille de route réordonnée
| Priorité | Action | Fermeture exigée |
|---|---|---|
| P0 | Valider les 15 fiches contre la révision exacte | Relecteur indépendant, versions, retours et traces, 15/15 |
| P0 | Vérifier 7 CSV **réels** et leurs noms de colonnes | Import manuel réussi sans perte, tests des cas exceptionnels |
| P0 | Concilier états R02/R03/P01/P05/P08 | Aucune rotation affichée prête avec incident bloquant non vérifié |
| P0 | Décider source historique V0.3 ou migration R01–R07 | Décision écrite + mapping revu + tests de non-régression |
| P1 | Refaire PDF à partir du DOCX approuvé | Mise en page identique et sélection accessible, preuves visuelles |
| P1 | Vérifier tableur client annoncé | Microsoft Excel réel + outil secondaire; **pas fait à ce stade** |
| P1 | Gel d'archive finale | Versions, SHA, licence et absence de données fictives mélangées |
| P1 | Tests offre, conformité et paiement | Portes séparées, jamais considérées fermées par l'audit documentaire |

**Conclusion probante :** source réelle retrouvée, intégrité 26/26 vérifiée, 15 SOP existantes et sept registres **vierges** constatés, incompatibilité entre V0.3 et schémas nouveaux mise en évidence. Révision de travail V0.6 prête à **être examinée**, **non** à être vendue.
