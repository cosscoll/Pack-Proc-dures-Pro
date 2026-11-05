# Ateliers de recette terrain — P01, P05, P08 (édition pilote V0.6.1)

**5 novembre 2026 — script prêt à faire exécuter, NON EXÉCUTÉ, NON VALIDÉ.**

Public visé : coordinateur de conciergerie, responsable qualité, gestionnaire multi-logements. Un professionnel indépendant de la rédaction anime la recette **sur une copie privée des vrais fichiers DOCX/PDF/CSV**, jamais sur les extraits du site. Tous les noms, logements et faits utilisés ci-dessous sont fictifs. Aucun accès réel, numéro de client, voyageur, code ou donnée personnelle.

## Matériel, rôle et conservation
- Remettre au testeur : archive V0.6.1, la version des 15 procédures, les 7 CSV V0.3 **inchangés**, le PDF de 17 pages ; conserver les SHA-256 de chaque fichier testé.
- Distinguer un **coordinateur A**, un **intervenant B**, un **contrôleur C**, un **validateur D** et un **observateur métier indépendant E**. Les rôles peuvent être joués, pas besoin de cinq personnes réelles.
- Enregistrer les observations et les preuves dans le stockage **privé** du projet. Sur GitHub public, conserver uniquement l'ID de preuve, une empreinte cryptographique et le statut non personnel.
- Noter les actions non couvertes et les champs obligatoires trop compliqués. Ne jamais transformer un refus en réussite « après explication du développeur ».

## Atelier P01 — Planifier sans confondre « envoyée » et « confirmée »

**Situation :** logement fictif `LOG-PILOT-01`, départ le 12 novembre 2026 à 10 h, arrivée à 16 h (heure de Paris). L'intervenant n'a pas encore répondu. Le coordinateur dispose de P01, P03 et de R02 V0.3.

1. Ouvrir la P01 réelle et expliquer à voix haute le responsable, le créneau et la preuve attendue. Le testeur ne doit pas consulter la page commerciale.
2. Saisir une rotation `ROT-PILOT-01` dans une **copie** de R02. État initial : proposition non confirmée, `confirmation_mission_le` vide, contrôle et validation finale vides. **Ne pas inscrire PRET.**
3. L'observateur joue une confirmation explicite à 09 h 15 le jour de la rotation. Saisir la date de confirmation uniquement dans `confirmation_mission_le` ; conserver `controle_effectue_le` vide tant qu'aucune inspection n'a eu lieu.
4. Exception : l'intervenant ne répond pas avant le seuil défini par l'exploitant. Le testeur doit conserver l'état non confirmé, écrire une prochaine action, un responsable et déclencher le plan de repli (seuil et personne habilitée **à définir par le professionnel**, pas par le document).
5. Comparer les deux fichiers sauvegardés : avant confirmation / après confirmation. Vérifier que le logiciel tableur conserve les dates, accents et horodatages et que l'export CSV garde l'ordre des 19 colonnes historiques R02.

**Acceptation :** aucun « confirmé » sans réponse, aucune date de contrôle créée avant contrôle, un plan B et son responsable, résultat reproductible par une deuxième personne.

**Blocage majeur :** saisie d'un code d'accès, usage d'un statut « prêt » sans inspection, changement silencieux des colonnes R02.

## Atelier P05 — Préparation terminée ≠ logement prêt

**Situation :** le ménage est déclaré terminé. Le contrôleur constate une fuite d'eau à traiter avant arrivée ; un signalement est enregistré en R03.

1. Sur la rotation fictive `ROT-PILOT-02`, enregistrer `statut_preparation=TERMINE` et `statut_controle=NON_CONFORME`. Ne pas rendre le logement disponible.
2. Ouvrir R03 V0.3 : enregistrer `id_incident=INC-PILOT-01`, le logement et la rotation, `gravite=majeure` selon la définition validée sur site et `impact_arrivee=BLOQUE` si la personne habilitée le juge bloquant. **La gravité et l'incidence sont deux décisions distinctes.**
3. Inscrire la décision, la personne chargée de l'action et un délai. Une réparation « annoncée » ne vaut pas `resolution_verifiee_le`.
4. Exception : l'intervenant déclare la fuite réparée sans recontrôle. Le testeur doit laisser l'incident ouvert/bloquant et R02 non prêt.
5. Lorsque le contrôleur habilité vérifie réellement la résolution (simulation datée), remplir `resolution_verifiee_le`, puis seulement les éventuelles dates de clôture. Autoriser l'état prêt uniquement **après** inspection conforme, absence d'incident bloquant et validation finale habilitée.

**Acceptation :** la première version de R02 reste non prête ; la preuve de contrôle est séparée de la preuve d'exécution ; la date de validation finale suit l'inspection ; aucune correction n'efface l'incident.

**Blocage majeur :** « terminé » entraîne automatiquement « prêt », clôture R03 sans preuve, déclaration de remise à disposition par une personne non habilitée.

## Atelier P08 — Incident avant arrivée, critique sans faux apaisement

**Situation :** une anomalie fictive est découverte deux heures avant l'arrivée. Elle impose une décision de sécurité par une personne compétente.

1. À partir de P08, classer la gravité **et** son impact sur l'arrivée ; les distinguer explicitement dans R03 V0.3.
2. Identifier la personne habilitée à sécuriser la situation, décider de l'action et déclencher l'escalade. Ne pas prescrire de réparation technique risquée à un personnel non qualifié.
3. Enregistrer le responsable, la prochaine action, le délai et la communication à valider. R02 reste bloqué si l'incident l'exige.
4. Exception A : la réparation est commencée, sans preuve de conformité. L'incident reste ouvert ; le testeur doit justifier son refus de clore.
5. Exception B : deux responsables se transmettent la suite. Compléter R05 avec `coordinateur_sortant_ref`, `coordinateur_entrant_ref` distincts, `id_rotation`, une action et un accusé de réception simulé ; absence d'accusé = alerte, pas succès.
6. Reprise par un second lecteur sans briefing : doit-il retrouver la nature du problème, le décideur, l'état actuel et la prochaine action dans les seuls documents ?

**Acceptation :** aucun statut favorable sans preuve de résolution vérifiée, aucune personne sans compétence chargée de lever une restriction de sécurité, la passation laisse une action attribuée.

**Blocage majeur :** fermeture sur simple déclaration, gravité utilisée comme synonyme d'impact, absence de responsable ou d'accusé sans alerte.

## Formulaire d'observation utilisable pour chaque atelier

Copier la fiche trois fois (P01, P05, P08). Conserver les réponses et scans dans le stockage privé.

| Question | Réponse attendue |
|---|---|
| ID / versions testées / SHA-256 | ID et empreintes exactes des fichiers |
| Testeur indépendant | Identifiant interne + expérience métier, sans identité publique |
| Peut-il choisir la bonne procédure sans aide ? | Oui / Non + étape de blocage |
| Le scénario nominal aboutit-il sans intervention du créateur ? | Conforme / Non conforme + preuve |
| Une exception déclenche-t-elle un état sûr ? | Conforme / Non conforme + preuve |
| Un deuxième lecteur comprend-il le prochain responsable ? | Oui / Non + preuve |
| Les dates / accents / colonnes survivent-ils à l'ouverture et export Excel + autre tableur ? | Conforme / Non conforme ; logiciels + versions |
| Donnée inutile ou secret demandé ? | Aucun / description anonymisée du problème |
| Défaut critique / correction prioritaire | ID, responsable, date, nouvelle version |
| Décision du professionnel | Non testé / Refusé / Accepté |
| Preuves privées | ID stockage + SHA-256 des supports de résultat |

## Interdictions de validation prématurée

- Des **tests de code réussis** ne démontrent pas qu'un professionnel a suivi la procédure dans la pratique.
- Les sept CSV V0.3 sont le format réel de l'archive V0.6.1. Les nouveaux schémas R01–R07 décrits sur GitHub sont **expérimentaux** : ne pas les substituer ni migrer automatiquement.
- Ne pas écrire « produit testé » ni afficher un prix actif tant que l'ensemble des **22 validations** et **12 scénarios** ne sont pas clos avec des preuves privées, puis que les conditions commerciales ne sont pas approuvées.

## Rapports d'avancement reproductibles

`node scripts/qualify-pack.mjs` — affiche le nombre de pièces validées, de cas acceptés et les raisons qui bloquent la vente. Les manifestes sont des **états de suivi**, pas une copie des produits. Les preuves restent privées, aucune identité client ne doit être ajoutée aux manifestes publics.
