# Matrice de recette métier — pack conciergerie (travail préparatoire)
Créée le 02/11/2026 · **Aucune ligne métier n'est encore validée.**

## Méthode
Pour chaque pièce P01–P15 et R01–R07 : auteur identifié; version; relecteur **professionnel indépendant**; exemple métier fictif; vérification du scénario nominal **et** de l'exception; corrections; preuve (nom/version du document, date, trace); décision signée. Aucun statut « testé » à partir de l'existence du fichier.

**Barème :** [ ] À contrôler · [ ] En correction · [ ] Validé avec preuve. Cocher seulement après la recette; rester prudent sur les règles de location courte durée qui changent selon la commune et le mandat. L'opérateur n'est pas automatiquement responsable des obligations du loueur.

## Procédures (15 fiches)
| Ref | Intitulé repéré sur le site | Scénario de recette obligatoire | Statut | Preuve |
|---|---|---|---|---|
| P01 | Planifier une rotation entre deux séjours | Deux horaires, intervenant, créneau; confirmation explicite; plan B si refus ou retard | **NON VALIDÉ** | — |
| P02 | Surveiller les changements de réservations | Modification de réservation => identification des rotations à revalider et notification au responsable | **NON VALIDÉ** | — |
| P03 | Confirmer une mission à un intervenant | Accord explicite horodaté ou escalade si absence de réponse avant le seuil interne | **NON VALIDÉ** | — |
| P04 | Préparer la fiche opérationnelle d’un logement | Instructions spécifiques utiles, non diffusion de secrets ou codes permanents dans un CSV partagé | **NON VALIDÉ** | — |
| P05 | Vérifier qu’un logement est prêt | Points de contrôle, écarts, personne habilitée à valider la remise en disponibilité | **NON VALIDÉ** | — |
| P06 | Suivre le linge après chaque départ | Traçabilité des lots et quantités, manquants, action de réapprovisionnement | **NON VALIDÉ** | — |
| P07 | Contrôler et réapprovisionner les consommables | Seuils et stocks convenus, preuve de relevé, alerte et responsable | **NON VALIDÉ** | — |
| P08 | Traiter un incident avant l’arrivée | Criticité, sécurisation sans action risquée, escalade et validation de résolution | **NON VALIDÉ** | — |
| P09 | Gérer un objet oublié | Signalement, garde, preuve de restitution, données minimales et durée de conservation décidée | **NON VALIDÉ** | — |
| P10 | Traiter une difficulté d’accès au logement | Distinguer cause, escalade vers personne habilitée, ne pas publier de code/clé maître | **NON VALIDÉ** | — |
| P11 | Passer la main entre deux coordinateurs | Liste des missions en cours, décisions en attente, propriétaire de la suite | **NON VALIDÉ** | — |
| P12 | Traiter une réclamation de propriétaire | Faits vs hypothèses, preuves limitées, interlocuteur autorisé, délais de retour | **NON VALIDÉ** | — |
| P13 | Accueillir un nouvel intervenant | Consignes et responsabilités, vérification de compréhension, accès proportionnés | **NON VALIDÉ** | — |
| P14 | Planifier une intervention de maintenance | Qualification, prestataire compétent, créneau, compte rendu, contrôle après action | **NON VALIDÉ** | — |
| P15 | Faire le bilan mensuel des rotations | Indicateurs sources, incidents récurrents, actions correctives attribuées | **NON VALIDÉ** | — |

## Registres (7 fiches)
| Ref | Intitulé | Champs/contrôles de recette suggérés | Statut | Preuve |
|---|---|---|---|---|
| R01 | Fiches logements | Identifiant interne, équipements et rôles; interdiction d'identifiants de serrure et de secrets | **NON VALIDÉ** | — |
| R02 | Suivi des rotations | Référence, fenêtres départ/arrivée, affectation, confirmation, contrôleur, statut | **NON VALIDÉ** | — |
| R03 | Journal des anomalies | Référence rotation, sévérité, responsable, délai, preuve de clôture | **NON VALIDÉ** | — |
| R04 | Suivi des stocks | Référence logement, produit, niveau, seuil, commande, validation | **NON VALIDÉ** | — |
| R05 | Passation d'équipe | Date, reprise, éléments en attente, décision et destinataire | **NON VALIDÉ** | — |
| R06 | Objets trouvés | Référence objet, date, responsable, remise; minimisation données des voyageurs | **NON VALIDÉ** | — |
| R07 | Journal des versions | Fichier, date, auteur, version, modification, approbateur | **NON VALIDÉ** | — |

## 6 essais de bout en bout (à faire sur un logement fictif)
1. Départ 10 h, arrivée 16 h : affecter ménage, obtenir la confirmation, ajouter contrôleur et statut, tracer la passation.
2. Modification d'arrivée à 14 h : réévaluer le délai, demander nouvel accord, signaler immédiatement l'impossibilité; ne pas afficher « prêt » à tort.
3. Mission non confirmée : seuil d'escalade défini, responsable de la décision, option de repli si possible, trace explicite.
4. Logement avec défaut critique : consigner anomalie, suspendre la validation, faire intervenir un professionnel habilité, recontrôler.
5. Objet oublié : signalement et remise sans conserver inutilement des données personnelles.
6. Coordination multi-intervenants : départ du coordinateur, reprise par une personne différente sans perdre responsables, priorités et créneaux.

## QA des fichiers : critères bloquants
- **DOCX** : styles de titres structurés, titres et version visibles, champs de saisie identifiés, tableaux avec en-têtes répétées, numérotation stable, impression A4 sans rognage.
- **PDF** : provenance versionnée du DOCX approuvé, liens et caractères accentués lisibles, pagination, mise en page et sélection du texte.
- **CSV** : encodage UTF-8 (BOM ou information d'import si nécessaire), séparateur testé FR et EN, champs non ambigus, absence de macros, aucune formule prise par surprise, ouverture Excel **et** LibreOffice avec caractères accentués et dates correctes. **Aucun essai réel attesté à ce stade.**
- **Sécurité** : au minimum test d'injection de formule CSV pour cellules débutant par `=`, `+`, `-`, `@` lorsque valeurs libres proviennent d'un utilisateur; ne pas stocker clés, codes ou identifiants sensibles dans les supports distribués.
- **Archive** : manifest SHA-256, numéro de version uniforme, nomenclature stable, contenu premium privé et livraison avec preuve cryptographique.
- **Protection des données** : recenser base légale/finalité/durée des informations saisies par le client; informer de ne jamais importer des données voyageurs réelles dans les démonstrations.
- **Applicabilité** : si une consigne porte sur sécurité, accès, assurances, fiscalité ou réglementation locale, relecture professionnelle et source en vigueur obligatoire.

## Fiche de validation à remplir pour chaque pièce
```text
ID / NOM :
Version / empreinte SHA256 :
Responsable du contenu :
Relecteur métier indépendant / fonction :
Cas nominal observé :
Exception simulée :
Logiciel de lecture / versions :
Observations / corrections :
Statut : NON VALIDÉ / A CORRIGER / VALIDÉ
Date et preuve :
```

## Décisions métier à instruire
- Les attentes du responsable d'une petite conciergerie sont-elles suffisamment communes pour un pack générique ?
- Quels champs des sept registres sont utilisés chaque jour et lesquels génèrent de la surcharge ?
- Dans quelles situations la fiche P05 « prêt » doit être bloquée sans ambiguïté ?
- Qui a légalement ou contractuellement le droit de communiquer l'accès au logement ?
- Quels contrôles sont contractuels, quels contrôles sont seulement recommandés ?

## Source publique utile (non assimilation à une validation professionnelle)
Service Public, règles de location meublée de tourisme (20/08/2026) : https://www.service-public.fr/particuliers/vosdroits/F2045

**Résultat actuel : 0/22 validations métier attestées.** L'existence des 22 fichiers brouillons ne constitue pas un produit prêt à vendre.
