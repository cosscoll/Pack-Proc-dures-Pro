# Spécification technique des 7 registres — en cours de recette
02/11/2026 · Référence de schémas : `data/registry-contracts.json` · **Aucun CSV final généré ou validé**.

## 1. Choix de conception
- Un enregistrement = une information traçable, identifiée par `record_ref` et `updated_at` en ISO 8601 avec fuseau.
- Les références `*_ref` sont des pseudonymes opaques, pas des numéros de téléphone, codes d'accès, adresses ni identifiants de voyageurs.
- Les transitions et valeurs autorisées se fondent sur l'échantillon P01/P05/P08 du 15 octobre, sous réserve de relecture métier.
- **Aucune formule tableur ni macro** dans les schémas. Les champs `text` refusent une cellule commençant par `=`, `+`, `-` ou `@` (après espaces invisibles), afin de réduire les risques d'injection au CSV.
- Un journal unique de versions permet de tracer précisément quel document a été utilisé; ne pas afficher des documents de niveaux de version différents comme « pack complet prêt ».

## 2. Composition
| Registre | Rôle opérationnel | Champs spécifiques proposés (en complément de record_ref, updated_at) | Procédures liées |
|---|---|---|---|
| R01 | Fiches logements | property_ref, property_label, responsible_role, checklist_version | P04, P05, P07, P10, P13 |
| R02 | Suivi des rotations | rotation_ref, property_ref, checkout_at, checkin_at, assignment_ref, acceptance_state, work_state, inspection_state, availability_state, inspector_role, confirmation_ref, inspection_ref, inspection_at | P01, P02, P03, P05, P08, P11, P15 |
| R03 | Journal des anomalies | incident_ref, rotation_ref, severity, state, assigned_role, verified_at, description_code, blocks_arrival | P05, P08, P10, P12, P14, P15 |
| R04 | Suivi des stocks | stock_ref, property_ref, item_ref, quantity, alert_threshold, replenishment_state | P06, P07, P15 |
| R05 | Passation d'équipe | handoff_ref, rotation_ref, sender_role, receiver_role, pending_action_ref, ack_state, handoff_at, sender_actor_ref, receiver_actor_ref | P03, P08, P10, P11, P12, P13 |
| R06 | Objets trouvés | object_ref, property_ref, category, found_at, custody_role, custody_state, retention_rule_ref, resolved_at | P09 |
| R07 | Journal des versions | artifact_ref, version, sha256, approval_state, reviewer_role, revision_at | P01, P02, P03, P04, P05, P06, P07, P08, P09, P10, P11, P12, P13, P14, P15 |

## 3. Décisions de statut devant être cohérentes
### R02 — Suivi des rotations
Une rotation n'est **prête** que si toutes les preuves suivantes existent :
1. Affectation enregistrée (`assignment_ref`).
2. Acceptation explicite (`acceptance_state=confirmee`, `confirmation_ref`).
3. Intervention réellement terminée (`work_state=termine`).
4. Contrôle conforme (`inspection_state=conforme`).
5. Référence et horodatage du contrôle (`inspection_ref`, `inspection_at`) plus un rôle de contrôleur habilité.
6. Aucun incident lié bloquant encore non vérifié dans R03.

Les statuts disponibles proposés sont `non_evalue`, `a_corriger`, `bloque`, `pret`. Ils décrivent **une décision** et pas l'avancement de la prestation. Les statuts `proposee`, `confirmee` et `termine` concernent respectivement acceptation/intervention et ne valent pas décision de disponibilité.

### R03 — Journal des anomalies
- `severity` : `mineure`, `majeure`, `critique` (termes proches de l'échantillon DOCX P08).
- `blocks_arrival` : booléen de **blocage réel** de l'accueil selon les règles du site. Une gravité majeure peut bloquer; tout incident critique impose `true` dans la proposition.
- `state` : `ouverte → attribuee → en_cours → corrigee → verifiee`. Les transitions effectives nécessitent confirmation métier. La correction déclarée ne prouve pas la vérification.
- `verified_at` requis à l'état `verifiee`.
- `pret` interdit tant que `blocks_arrival=true` et `state≠verifiee`.

### R05 — Passation d'équipe
Les deux rôles peuvent être identiques (deux coordinateurs), mais les références anonymisées des deux **personnes** doivent être distinctes. Les exigences d'accusé de réception et de reprise seront vérifiées sur scénario C10.

### R07 — Versions
`artifact_ref`, `version`, `sha256`, `approval_state`, `reviewer_role` et `revision_at` permettent le suivi. L'état `approuve` exige au minimum un rôle de relecteur, mais **le simple rôle n'est pas une preuve** d'approbation réelle : le manifeste principal garde l'identité du relecteur indépendant, les preuves et la date de validation.

## 4. Règles de compatibilité CSV encore ouvertes
- Définir séparateur par type d'import (souvent `;` sur Excel configuré en FR, mais dépend des paramètres locaux).
- Tester encodage UTF-8 et accents sur Microsoft Excel réel et LibreOffice Calc; **tests non réalisés**.
- Préserver dates ISO en texte si nécessaire, ne pas laisser Excel interpréter arbitrairement fuseaux et zéros significatifs.
- Éviter l'injection de formule par contrôle des champs libres ET test d'ouverture réel.
- Clarifier les numéros d'articles et les quantités; distinguer nombres, références et dates.
- Ne pas diffuser un exemple CSV contenant de véritables identifiants, codes d'accès, photos ou informations voyageurs.

## 5. Matrice de qualité à remplir avant livraison
| Contrôle | Résultat actuel | Condition de fermeture |
|---|---|---|
| Schémas et colonnes R01–R07 | Spécifiés | validation professionnelle |
| Valeurs et transitions | Testées sur données fictives | essais métier réels + exceptions |
| Relations entre registres | Quelques contrôles automatisés | essai complet des 12 scénarios |
| CSV et formats livrables | Non créés dans cette branche | correspondance avec archives internes approuvées |
| Import Excel réel | Non testé | preuve de lecture/écriture sans perte |
| Import autre tableur | Non testé | preuve indépendante |
| Confidentialité et règles de conservation | Principe défini | revue RGPD/contrats |
| Versions/empreintes | Schéma proposé | manifeste SHA-256 du lot livré et signature |

## 6. Limite de la preuve technique
Les tests `tests/registry-contracts.test.mjs` vérifient des scénarios **synthétiques** et la cohérence des règles. Ils ne démontrent ni conformité légale ni validité professionnelle des sept registres. Toute règle produisant une fausse interdiction ou décision doit être revue avec un praticien avant commercialisation.

**Source métier examinée :** échantillon A4 P01/P05/P08 V03 du 15/10/2026 (Google Drive Business 01). Voir `docs/AUDIT_ECHANTILLON_DOCX_2026-11-02.md` pour E01–E05.
