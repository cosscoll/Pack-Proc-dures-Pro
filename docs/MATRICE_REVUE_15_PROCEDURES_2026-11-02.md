# Matrice de relecture opérationnelle — 15 procédures et 7 registres
**État : préparation à la validation métier, 02/11/2026.** Cette matrice est une grille de contrôle, pas une certification ni une transcription des procédures commerciales. Archive source V0.5.2, correctif privé V0.6, PDF de consultation V0.6 dans conditionnement V0.6.1.

## Règles de relecture avant toute mise en vente
1. La personne qui relit **doit avoir une expérience du métier** et être indépendante de la rédaction. Elle doit pouvoir refuser une étape ou imposer une exception.
2. Tester sur **une copie vierge, puis une copie à données fictives**, en respectant les colonnes exactes des CSV historiques V0.3. Les schémas R01–R07 expérimentaux de GitHub ne sont **pas** encore le format de livraison.
3. Une opération achevée n'est **pas** un logement « prêt ». Vérifier la chaîne confirmation, intervention, inspection, incident bloquant, preuve, habilitation, validation finale.
4. Ne jamais inscrire code permanent, identité complète du voyageur, donnée de paiement ou document sensible dans un CSV de suivi partageable.
5. Tout acteur non répondant, temps dépassé, conflit de responsabilité ou impossibilité déclenche un **état non validé** puis une escalade. Ne jamais masquer un cas incertain par une réussite.
6. Les délais, niveaux de gravité, durées de conservation et pouvoirs de décision dépendent de l'exploitant, des accords contractuels et du droit local; les champs de personnalisation ne constituent pas une règle déjà validée.

## Grille de revue et preuve finale attendue
| Fiche | Objet | Registres concernés | Risque à tester impérativement | Trace attendue et question au relecteur |
|---|---|---|---|---|
| P01 | Planification d'une rotation | R01, R02 | Date d'inspection renseignée avant inspection ; double créneau | Confirmation datée et référence de logement ; qui arbitre deux rotations simultanées ? |
| P02 | Changement de réservation | R02, R05 | Horaire modifié sans réévaluer la marge ni l'intervenant | Historique ancien/nouveau et décision; que faire si arrivée avancée rend le délai impossible ? |
| P03 | Confirmation d'intervenant | R02, R05 | Absence de réponse assimilée à une acceptation | Réponse positive, horodatage et repli ; combien de tentatives sont autorisées ? |
| P04 | Fiche logement | R01 | Informations de sécurité ou d'accès publiées dans les CSV | Consignes minimales à jour ; qui décide des personnes habilitées à voir les accès ? |
| P05 | Contrôle logement prêt | R02, R03 | « Terminé » = « Prêt », incident non résolu | Inspection distincte, statut et validation ; qui peut déclarer le logement prêt ? |
| P06 | Suivi du linge | R04, R02 | Quantité insuffisante non remontée avant arrivée | Inventaire, seuil, action et propriétaire ; quel niveau bloque réellement l'arrivée ? |
| P07 | Approvisionnement | R04 | Seuil franchi sans réassort, unités incohérentes | Quantité, unité et réapprovisionnement ; qui valide le seuil local ? |
| P08 | Incident | R03, R02 | Gravité confondue avec incidence sur l'arrivée | Gravité, impact bloquant et contrôle de résolution ; qui a la compétence de lever un blocage critique ? |
| P09 | Objet trouvé | R06 | Perte d'objet, données personnelles inutiles, conservation non définie | Référence, garde, statut, décision, conservation ; quelle durée et quelles preuves selon contrat ? |
| P10 | Difficulté d'accès | R02, R05, R03 si incident | Secret révélé ou improvisation hors habilitation | Incident d'accès sans code, décision de reprise ; qui autorise l'intervention ? |
| P11 | Passation de coordinateurs | R05, R02 | Absence d'accusé de réception, action sans responsable | Deux références d'acteurs différentes et preuve de prise en charge ; que faire en cas de non-réponse ? |
| P12 | Réclamation propriétaire | R03, R05 | Engagement commercial/juridique non autorisé | Faits vérifiés, rôle habilité, décision tracée ; quand transmettre à un gestionnaire ? |
| P13 | Nouvel intervenant | R01, R05 | Formation ou habilitation supposées acquises | Consignes reçues, droits vérifiés, contact d'escalade ; quelles formations/assurances sont obligatoires ? |
| P14 | Intervention de maintenance | R03, R02 | Réparation « faite » sans contrôle final | Preuve de l'action, contrôle, état disponibilité ; qui certifie la sécurité après travaux ? |
| P15 | Bilan mensuel | R02, R03, R04 | Indicateurs gonflés, mauvais mois/fuseau, incident omis | Comptages reproductibles; définir les dénominateurs et vérifier les exceptions de période |

## Écarts techniques fermés et non fermés
- **52/52 tests Node + interface au vert** dans le run GitHub #41427069897 : inclut **21 tests nouveaux** ciblant l'ancien format CSV.
- **12 cas C01–C12 couverts partiellement par des assertions synthétiques**, pas par des exercices complets avec acteurs réels. **Recette professionnelle complète : 0/12.**
- Les sept exemples fictifs V0.6 sont cohérents ensemble : **zéro erreur**, **un avertissement intentionnel** sur l'absence d'accusé de réception de passation R05.
- PDF de consultation basé sur le Word V0.6 : **17 pages A4**, texte sélectionnable, rapport de préflight sans avertissement ; couverture 15/15 procédures. Pas d'attestation de conformité pour Word/Excel de l'acheteur.
- **22 livrables / 22 encore sans validation indépendante** ; aucun prix, licence, juridique ou paiement n'est validé pour la mise en vente.

## Protocole de fermeture
Pour chaque fiche, obtenir : rôle et qualification du relecteur, version exacte, cas nominal avec preuve, cas d'exception avec preuve, observation, correction, date, décision **accepté/refusé**, et empreinte SHA-256 du document revu. Toute correction qui change une règle métier exige une nouvelle version et une nouvelle recette ciblée.

**Décision à prendre avant migration :** garder les CSV historiques V0.3, ou créer un nouveau format après mapping intégral, essais d'import et approbation. **Aucune conversion tacite.**

Les documents premiums restent dans l'archive privée V0.6.1, pas dans le dépôt GitHub public.
