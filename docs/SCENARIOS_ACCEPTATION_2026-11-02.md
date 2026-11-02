# Scénarios d'acceptation croisés — ROTATION 001
Version de préparation : 02/11/2026 · Jeu de données **100 % fictif** · Aucun test métier réel réalisé.

## Objectif
Vérifier que le manuel P01–P15 et les registres R01–R07 s'utilisent ensemble sans contradiction ni double saisie inutile. Une procédure peut être parfaitement rédigée et malgré tout inutilisable si son résultat ne se retrouve pas dans le bon registre.

## Règles transversales à tester
- **Statut fiable** : « programmé », « proposé », « confirmé », « terminé » et « contrôlé/prêt » sont distincts. Jamais « prêt » sur simple déclaration de fin d'intervention.
- **Responsable nommé** : toute action et tout statut bloquant ont une personne responsable ou un mécanisme d'escalade prévu.
- **Horodatage et version** : noter événement et source, date et version documentaire utilisée; utiliser les horaires locaux réels seulement sur des données autorisées.
- **Données minimales** : références anonymes, aucun code d'accès, aucune clé secrète, aucune information sensible du voyageur.
- **Plan B** : une non-réponse, un retard, un prestataire absent ou une impossibilité doit aboutir à une alerte explicite, pas à un statut favorable.
- **Traçabilité sans surcollecte** : réserver les coordonnées personnelles aux systèmes autorisés, pas aux exports CSV distribués comme exemples.
- **Périmètre contractuel** : toute décision engageant propriétaire, voyageur, sécurité, garantie ou prestataire exige la personne habilitée.

## Jeux d'essai métier à exécuter après validation des fichiers
| Cas | Situation fictive et action attendue | Sources | Preuves/registre attendu | Échec bloquant |
|---|---|---|---|---|
| C01 | Départ 10h, arrivée 16h : responsable attribue une mission et obtient la confirmation | P01, P03, P04 | R01 contexte logement; R02 heure et statut confirmé | « Confirmé » sans preuve de réponse |
| C02 | Arrivée avancée à 14h : recalcul du créneau, nouvelle affectation/accord, alerte si délai impossible | P01, P02, P03 | R02 événement de modification et décision responsable | Planning initial conservé sans signalement |
| C03 | Intervenant sans réponse : rappel/affectation alternative sous délai interne défini | P03, P11 | R02 statut « non confirmé »; R05 passation éventuelle | Passage automatique à « fait » |
| C04 | Ménage terminé, équipement en panne : ouvrir anomalie et attendre validation habilitée | P05, P08 | R03 gravité, action et contrôle; R02 « non prêt » | « Prêt » malgré écart bloquant |
| C05 | Impossible d'entrer dans le logement : sécuriser l'accès et escalader sans partager d'identifiant permanent | P10, P11 | R02 impact; R05 responsable de reprise | Publication d'un code dans CSV |
| C06 | Objet oublié signalé : prise en charge, conservation et restitution selon règles applicables | P09 | R06 référence et statut; données minimales | Données voyageurs inutiles ou objet non traçable |
| C07 | Linge manquant et stock sous seuil : décision d'approvisionnement avant arrivée | P06, P07 | R04 quantité/seuil; R02 impact sur rotation | Niveau de stock incohérent ou rupture non remontée |
| C08 | Maintenance à organiser : affecter un professionnel compétent et vérifier résolution | P08, P14 | R03 anomalie et résolution; R02 statut après recontrôle | Fermeture avant preuve de résolution |
| C09 | Propriétaire réclame une correction : recouper les faits, responsable du suivi et réponse autorisée | P12, P11 | R03 si anomalie; R05 si escalade | Réponse engageante sans habilitation |
| C10 | Changement de coordinateur en cours de journée : reprise des missions et décisions pendantes | P11, P03 | R05 passation, R02 statut des missions | Action sans propriétaire, doublon d'affectation |
| C11 | Nouvel intervenant reçoit ses consignes, responsabilités et règle d'escalade | P13, P04 | R01 référence de contexte, R05 suivi de consignes | Accès ou habilitation donnée hors périmètre |
| C12 | Fin de mois : synthèse des rotations, anomalies et décisions d'amélioration | P15 | R02 + R03 + R04 => synthèse sans secrets | Indicateur non reproductible ou total faux |

**Critères de décision par cas :**
1. Le relecteur métier identifie les bonnes procédures et registres sans indication supplémentaire.
2. Il accomplit le scénario nominal et un cas d'exception sur des copies de documents avec données fictives.
3. Le statut final correspond aux preuves disponibles; le cas bloquant ne peut pas donner un faux « prêt ».
4. Une autre personne peut reprendre les pièces et savoir qui intervient ensuite.
5. Les champs n'exigent pas de collecte de données non nécessaires ni de secret dans un fichier partagé.

## Livrables de recette par cas
```text
CAS : C__
DATE / RELECTEUR / QUALIFICATION :
VERSIONS DES PROCÉDURES UTILISÉES :
VERSIONS DES REGISTRES UTILISÉS :
SCÉNARIO NOMINAL : [NON TESTÉ / CONFORME / NON CONFORME]
EXCEPTION : [NON TESTÉ / CONFORME / NON CONFORME]
TEMPS MESURÉ (SI OBSERVATION RÉELLE) :
ERREURS OBSERVÉES / VERBATIM ANONYMISÉ :
CORRECTIF DEMANDÉ / PROPRIÉTAIRE / DATE :
PREUVE / EMPREINTES DES FICHIERS :
DÉCISION : [NON TESTÉ / REFUSÉ / ACCEPTÉ]
```

## Critères de sortie globale
- **12/12 cas** exécutés sur les fichiers livrables réels, aucun scénario bloquant non corrigé.
- Chaque P01–P15 apparaît au moins dans un scénario, avec audit indépendant distinct pour les étapes non couvertes.
- Les sept R01–R07 sont vérifiés individuellement (R07 via le journal des changements de version sur chaque scénario).
- Tous les exports importés/restitués correctement dans Excel réel et au moins un autre logiciel tableur annoncé.
- Tous les documents partagent la même numérotation et version du manifeste de livraison.
- Rapport final signé, écarts classés et limites communiquées avant l'offre commerciale.

**État au 02/11 : 0/12 cas exécutés.** Ceci est un protocole, non une attestation de conformité.
