# Contrôles juridiques et fiscaux pré-lancement — Pack Procédures Pro
Révision de travail : 02/11/2026 · Juridiction de référence : France · **Diagnostic documentaire, pas conseil juridique individualisé ni validation**.

## 1. Choix structurels : décisions obligatoires
| Question | Options à examiner | Impact produit | État |
|---|---|---|---|
| Qui vend ? | Personne physique ou morale immatriculée ; identification complète du vendeur | Facturation, mentions légales, CGV, paiement | NON DÉCIDÉ |
| À qui vend-on ? | Professionnels uniquement (B2B), consommateurs (B2C), ou les deux | Rétractation, garanties et médiation, information précontractuelle | NON DÉCIDÉ |
| Où vend-on ? | France, UE, pays tiers | TVA et territorialité des ventes numériques; obligations de collecte | NON DÉCIDÉ |
| Prix ? | 49 € = hypothèse de test, ni TTC définitif ni tarif engagé | Marge et présentation du prix, TVA, PSP | NON DÉCIDÉ |
| Quelle licence ? | Usage interne une organisation, nombre de sites, nombre d'utilisateurs, droits de modification et de partage | Contrat, PDF/DOCX/CSV et support | NON DÉCIDÉ |
| Quelle durée ? | Achat unitaire et accès pérenne ou téléchargement à durée limitée avec possibilité de récupération | Service après vente et conformité numérique | NON DÉCIDÉ |
| Quelle information est stockée ? | Commande, facture, preuve contractuelle et données support; aucune donnée voyageur requise | RGPD, conservation, sécurité | NON DÉCIDÉ |

## 2. Droit de la consommation : segment B2C
Le contrat conclu à distance avec un **consommateur** ouvre en principe un délai de rétractation de 14 jours, sauf exceptions légales. Pour un contenu numérique **sans support matériel**, la perte du droit suppose notamment que l'exécution ait commencé après accord préalable exprès du consommateur et reconnaissance expresse de la perte du droit. À contrôler avec juriste avant de définir les cases/étapes ; ne jamais présélectionner les accords.

Depuis le **19 juin 2026**, pour les contrats conclus en ligne entrant dans son champ, une fonctionnalité de rétractation visible, simple et accessible sur le site/application doit être fournie pendant la période applicable; les déclarations reçues via ce moyen nécessitent un accusé durable avec date/heure. Cette fonctionnalité n'est pas à assimiler automatiquement au simple e-mail de support et ne peut pas être supprimée en généralisant abusivement l'exception des contenus numériques.

**Scénarios à valider :**
- C01 : visiteur consommateur peut lire avant commande le contenu, formats, compatibilité et restrictions.
- C02 : prix total et éventuels coûts supplémentaires clairement identifiés, pas de supplément implicite.
- C03 : bouton de commande caractérisant explicitement une obligation de paiement.
- C04 : cases de consentement requises distinctes, non précochées, journal de preuve daté si légalement nécessaires.
- C05 : confirmation des éléments contractuels sur support durable (pas seulement URL temporaire).
- C06 : droit de rétractation exercé, refusé à bon droit ou non applicable selon situation réelle, et accusé conforme.
- C07 : parcours de réclamation et garanties légales du contenu numérique examinés.
- C08 : possibilité de signaler contenu non conforme et d’obtenir une réponse réelle sans service fictif.

**Vérification réglementaire officielle :**
- DGCCRF (02/10/2026), délais et interface en ligne : https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/delais-de-reflexion-ou-de-retractation-comment-sappliquent-t-ils
- DGCCRF, informations précontractuelles dont contenus numériques, fonctionnalité/compatibilité : https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/le-contrat-un-accord-entre-des-parties-bien-informees-au-prealable?language=fr
- Code de la consommation, articles L221-5, L221-13, L221-18 et L221-28 : vérification de la version applicable à la date de lancement à réaliser.

## 3. B2B : ne pas confondre « professionnels » et absence de protections
Décider si l'offre est exclusivement vendue dans le cadre professionnel et documenter le parcours de preuve de la qualité du client. Certaines dispositions particulières peuvent aussi concerner des professionnels dans des circonstances spécifiques ; une simple case « je suis professionnel » ne suffit pas pour écarter automatiquement toutes les obligations. Contrats, facturation, responsabilité, propriété intellectuelle et RGPD restent pertinents.

## 4. Facturation électronique : obligations déjà entrées en vigueur au 02/11/2026
La DGFIP indique un déploiement progressif :
- **1er septembre 2026 : réception** des factures électroniques pour les entreprises assujetties à la TVA entrant dans le champ, y compris celles en franchise en base.
- **1er septembre 2026 : émission** pour grandes entreprises et ETI.
- **1er septembre 2027 : émission et e-reporting** pour PME et microentreprises, selon opérations et champ d'application.
- Les flux B2B domestiques, B2C et internationaux n'empruntent pas nécessairement le même canal ; étudier l'e-reporting et l'opérateur agréé selon le statut du vendeur et le type de client.
- Une facture PDF par e-mail ne constitue pas automatiquement une « facture électronique » répondant aux nouvelles obligations.
- Choisir une **plateforme agréée** compatible et vérifier le calendrier exact et les exemptions avec l'expert-comptable.

**Sources fiscales officielles :**
- DGFIP, calendrier modifié 16/01/2026 : https://www.impots.gouv.fr/professionnel/questions/partir-de-quand-suis-je-concerne-par-la-reforme-de-la-facturation
- DGFIP, micro et franchise en base (28/09/2026) : https://www.impots.gouv.fr/professionnel/questions/franchise-en-base-micro-entrepreneur-ou-auto-entrepreneur-suis-je-concerne
- DGFIP, plateformes agréées : https://www.impots.gouv.fr/professionnel/questions/dans-le-cadre-de-la-reforme-de-la-facturation-electronique-comment-devrais
- BOFiP (30/09/2026), e-reporting : https://bofip.impots.gouv.fr/bofip/15176-PGP.html/ACTU-2026-00145

## 5. Traitement des données et sécurité
Le site est une vitrine de pré-lancement sans paiement. Le futur tunnel doit expliquer : responsables de traitement, finalités, données et durées de conservation, sous-traitants, transfert hors UE s'il y a lieu, base légale, droits, contact et sécurité. Minimiser données et logs de webhook; aucun identifiant de serrure, code de logement ou fichier voyageur dans les registres de démonstration. Pas de suivi marketing ou de cookies non nécessaires ajoutés par défaut.

**Risques spécifiques :**
- Les CSV peuvent déclencher l'interprétation de formules lors d'un import dans un tableur; neutraliser les champs libres avant export selon le logiciel cible, sans casser les données.
- Un exemple gratuit ne doit contenir aucun nom, adresse ou téléphone de client réel.
- Les documents modifiables doivent préciser qu'ils ne constituent pas un avis juridique et doivent être adaptés au mandat, à l'activité et à la réglementation locale.

## 6. Porte de validation à compléter AVANT vente
| Livrable | Responsable réel | Attendu | État |
|---|---|---|---|
| Identité vendeur / statut / SIREN | Fondateur + conseil | justificatifs et mentions légales | EN ATTENTE |
| Public B2B/B2C et territoire | Direction | décision écrite | EN ATTENTE |
| TVA et régime/facturation électronique | Expert-comptable | analyse écrite et solution compatible | EN ATTENTE |
| CGV, propriété intellectuelle et licence | Juriste | documents finalisés | EN ATTENTE |
| Retractation B2C / exceptions applicables | Juriste | UX et preuves conformes | EN ATTENTE |
| RGPD et sous-traitants | Responsable de traitement | registre, notices, contrats et sécurité | EN ATTENTE |
| Prix TTC et politique de support | Direction | décision et test de marge | EN ATTENTE |
| Recette PSP sandbox | Technique + direction | tests documentés puis autorisation d'activation | EN ATTENTE |

**Statut : aucune obligation marquée validée.** Ne pas activer le paiement en anticipant la décision.
