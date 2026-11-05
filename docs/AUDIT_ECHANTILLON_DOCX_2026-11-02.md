# Audit de concordance avec le document source — échantillon A4 V03
Date d'audit : 02/11/2026 · Source Drive consultée en lecture seule : **Business01_Echantillon_3_Procedures_A4_V03.docx**, fichier modifié le 15/10/2026.

## Périmètre réellement lu
Le DOCX source donne le texte complet de **P01, P05 et P08**, avec objectifs, prérequis, responsabilités, étapes, contrôles, exceptions et résultats attendus. Il annonce en couverture « échantillon gratuit 3 procédures », **V0.1** pour les fiches, alors que le fichier est nommé **V03** (édition du document A4, pas nécessairement version fonctionnelle). Aucun contrôle visuel du rendu Word/PDF réel n'a été effectué ici. Les archives « V0.2/V0.52 » répertoriées dans le journal Drive n'ont pas été ouvertes : aucune affirmation de synchronisation des versions.

## Concordances vérifiées
| Objet | Document source du 15/10 | Spécification en branche | État |
|---|---|---|---|
| P01 | Sept étapes : horaires, fenêtre, affectation, acceptation, contrôle assigné, changement, traçabilité | `RELECTURE_P01_P05_P08` : sept étapes et registre R02 | Alignement de principe, pas validation métier |
| P05 | Sept étapes, état prêt / à corriger / bloqué, anomalies documentées, contrôle final par personne habilitée | Registres R02/R03 et règle « non prêt tant que bloquant » | Ajustement des états nécessaire |
| P08 | Huit étapes ; sévérité critique / majeur / mineur, escalade et décision finale | R03 utilisait mineure / majeure / bloquante | **Incohérence de nomenclature à corriger** |
| Confidentialité | Ne pas partager de secrets d'accès ni données voyageurs inutiles | R01-R07 : identifiants opaques et colonnes sensibles interdites | Alignement de principe |
| Preuve de contrôle | Responsable et heure de décision, incident vérifié | R02 inspecteur + confirmation ; R03 vérification datée | Alignement à compléter avec référence du contrôle |

## Écarts à résoudre (pas de modifications automatiques des documents sources)
**E01 — Niveaux d'incident.** Le DOCX P08 emploie « critique » (sécurité/accueil impossible), « majeur », « mineur », mais R03 initial employait « bloquante », « majeure », « mineure ». **Décision de conception proposée :** distinguer la **gravité** (`mineure`, `majeure`, `critique`) et le **blocage concret de l'arrivée** (`blocks_arrival: boolean`). Un incident « majeur » peut également bloquer une arrivée selon les contrats; tout incident « critique » est bloquant par défaut dans la proposition. R02 « prêt » interdit si un incident bloquant n'est pas vérifié.

**E02 — États de préparation du logement.** P05 décrit `prêt`, `à corriger`, `bloqué`; R02 binaire `prêt/non prêt` perd cette distinction. Proposer `non_evalue`, `a_corriger`, `bloque`, `pret` et préserver `non_pret` seulement si nécessaire pour importer de vieux fichiers. La nomenclature définitive dépend du relecteur métier et de la compatibilité avec les CSV V0.2 existants.

**E03 — Étape 7 P01 « date du dernier contrôle ».** Le document P01 enregistre « statut confirmé, responsable, date du dernier contrôle » à la clôture de la *planification*. Ce dernier contrôle est potentiellement antérieur à la prestation, donc la formulation est ambiguë. Proposer « date/heure de dernière confirmation de la planification » pour P01 ; réserver l'heure de contrôle qualité à P05. **Aucune modification du DOCX source sans validation.**

**E04 — Références et versions.** Nom fichier V03 vs couverture SOP V0.1, tandis que journal Drive indique manuel V0.2 et pack V0.52. Les versions **document / procédure / archive** doivent être des champs séparés du manifeste de livraison et avoir leurs propres empreintes SHA-256. Une fiche n'est « validée » qu'après audit de sa version exacte.

**E05 — Terminologie du contrôle.** P05 « faire corriger et recontrôler » puis « autoriser clôture ». Le schéma R03 doit distinguer `corrigee` de `verifiee`. La validation `pret` nécessite une preuve datée de contrôle et un responsable habilité, plus l'absence d'incidents qui bloquent une arrivée.

## Corrections techniques proposées dans la branche
- Normaliser R03 gravité selon P08, ajouter indicateur de blocage de l'arrivée, et vérifier la transition R03 → R02.
- Ajouter les statuts opérationnels de disponibilité de P05.
- Conserver les libellés d'origine dans les exemples et le contenu commercial jusqu'à validation métier de la nouvelle nomenclature.
- Exécuter tests du validateur avec données fictives : incident critique, majeur bloquant, mineur non bloquant, défaut de contrôle, correction non vérifiée.

## Livrables et preuves manquantes pour la fermeture
1. Ouvrir et vérifier le ZIP interne V0.52 et le manuel V0.2, sans les exposer à GitHub public.
2. Réconcilier les fiches P01/P05/P08 contre **la version réellement destinée à la vente**.
3. Vérifier visuellement DOCX et PDF A4, avec mise en page, pages et checklists (non réalisé ici).
4. Vérifier la structure des sept CSV originaux et leur import réel dans logiciels annoncés (non réalisé).
5. Recueillir l'accord d'un praticien de conciergerie sur terminologies et rôles.

**Conclusion : comparaison documentaire faite pour trois procédures sources; écarts E01 à E05 identifiés; 0 validation métier indépendante.**
