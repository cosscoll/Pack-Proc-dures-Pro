# Spécification de la vente et de la livraison — cadrage technique (NON ACTIVÉ)
Version 2026-11-02 · Préparation seulement · Aucun prestataire de paiement branché

## Architecture visée
```text
Page produit publique
   -> récapitulatif du prix TTC / informations essentielles
   -> session de paiement PSP (mode test autorisé)
       -> page de retour informative (JAMAIS preuve de paiement)
       -> webhook signé côté serveur
           -> contrôle signature + fraîcheur + anti-rejeu
           -> idempotence par identifiant événement et commande
           -> état de commande "payée" UNIQUEMENT sur événement autoritatif
           -> émission d'un droit de téléchargement sur archive privée versionnée
           -> confirmation sur support durable et facture si applicable
               -> lien court et expirable (jeton haché au repos)
               -> journal d'accès minimisé
```

## Étapes et exigences
**Porte 0 — avant développement marchand** : statut légal du vendeur, public B2B/B2C, prix TTC, licences, CGV, politique de rétractation et médiation, pack P01–P15/R01–R07 validé. Pas de contournement.

**Paiement / commande :**
- ID de commande aléatoire opaque et unique, montant en centimes entier, devise EUR.
- Ne jamais se fier au prix transmis par le navigateur; vérifier prix côté serveur.
- Récapitulatif du contenu livré (versions, formats, licence d'utilisation), prix TTC, conditions, compatibilité, droit de rétractation éventuel.
- Pas de collecte de carte bancaire par le site; utiliser le PSP choisi avec exigences de sécurité adéquates.
- Ne pas activer de case de renoncement présélectionnée. Si la renonciation au délai de rétractation est légalement possible et pertinente, conserver **accord préalable exprès**, reconnaissance de perte du droit et confirmation contractuelle sur support durable. À faire valider juridiquement.

**Webhook / provisionnement :**
- Signature vérifiée contre le corps brut; secret par environnement, jamais en JS frontend.
- Événement dupliqué ignoré (idempotence), montant, devise, destinataire et commande recoupés.
- Événements dans le désordre => machine à états et transitions autorisées (jamais revenir « payée » depuis « remboursée »).
- Erreur transitoire => retries bornés et traces; aucune fuite du lien privé dans les logs.
- Jeton de livraison cryptographiquement aléatoire, hashé, durée/essais bornés; contrôles d'accès.
- Empreinte du ZIP vérifiée à l'upload et à la livraison; version figée par commande; ne jamais changer silencieusement son contenu.
- Page de succès indépendante du résultat du webhook : « Nous vérifions le paiement », pas « Votre achat est confirmé » sans preuve.

**Post-achat :**
- Reçu/facture selon obligations, confirmation du contrat, CGV applicables, contenu et conditions de rétractation.
- Contact de support, mécanisme de reprise si email invalide, téléchargement échoué, lien expiré.
- Remboursement : révoquer droits selon règles définies, journaliser l'événement, ne jamais effacer les pièces comptables.
- Suppression/anonymisation des données non nécessaires selon calendrier de conservation; ne pas promettre « aucune donnée ».

## Machine à états de commande proposée
| État | Événement | État cible | Effet |
|---|---|---|---|
| CRÉÉE | Session PSP validée | EN_ATTENTE | aucun accès |
| EN_ATTENTE | Paiement confirmé, montants concordants | PAYÉE | accès délivré |
| EN_ATTENTE | Expiration, abandon | EXPIRÉE | aucun accès |
| PAYÉE | Téléchargement réussi | LIVRÉE | tracer livraison sans exposer contenu |
| PAYÉE / LIVRÉE | Remboursement validé | REMBOURSÉE | révoquer accès futur selon conditions |
| TOUT ÉTAT | Webhook signature invalide | inchangé | journal sécurité, HTTP adapté |
| PAYÉE | Webhook identique répété | inchangé | aucune seconde livraison |
| REMBOURSÉE | Webhook ancien « payé » | inchangé | pas de résurrection d'accès |

## Matrice de recette sandbox (zéro paiement réel)
| ID | Scénario | Attendu |
|---|---|---|
| S01 | Paiement test abouti et webhook valide | 1 commande payée; 1 droit d'accès |
| S02 | Page retour ouverte sans webhook | aucune livraison |
| S03 | Webhook signé avec secret faux | rejet |
| S04 | Répétition du même événement | idempotent, aucun double envoi |
| S05 | Montant de la commande différent du PSP | aucune livraison, alerte |
| S06 | Devise incohérente | refus |
| S07 | Webhook hors ordre | état final sûr |
| S08 | Jeton périmé ou révoqué | accès refusé |
| S09 | Jeton altéré ou réutilisé au-delà de la limite | refus |
| S10 | Archive premium modifiée | livraison bloquée |
| S11 | Email ou notification en échec | reprise sûre, sans nouvel encaissement |
| S12 | Paiement remboursé | aucune création d'un nouveau droit |
| S13 | Téléchargement interrompu | reprise contrôlée |
| S14 | Deux utilisateurs simultanés | isolation stricte par commande |
| S15 | Cas légal de rétractation | respect du droit applicable, preuve datée |
| S16 | Site sans JavaScript, écran 320 px | informations précontractuelles et aides accessibles |
| S17 | Personne sans compte | parcours invité défini et sécurisé |
| S18 | Échec CDN/WebGL/animation réduite | parcours d'achat indépendant de la 3D |

**Statut de cette matrice : 0/18 cas testés.** Ne pas confondre les simulations HTTP locales historiques avec un webhook PSP officiel.

## Contrôles de sécurité prioritaires
- Aucun secret (clé PSP, jeton client, archive premium) dans GitHub public ou dans le navigateur.
- Préfixer domaines de staging/prod; interdire mode réel en environnement de test.
- Observabilité : événements webhook, demandes d'assistance, téléchargement, erreurs — sans données bancaires ni secrets.
- Politique de sauvegarde et de restauration du stock d'archives versionnées.
- Vérification de l'accessibilité et de la persistance des liens de support et d'informations légales.
- DPIA/RGPD si le traitement le justifie; minimisation par défaut et pas de cookies marketing sans base légale/consentement adéquat.

## Blocages décisionnels
1. **Statut du vendeur / immatriculation et fiscalité.**
2. **B2B seulement ou B2C aussi ?**
3. **Licence et prix TTC du produit.**
4. **Prestataire de paiement, hébergement serveur de webhook, stockage privé.**
5. **Choix de politique de livraison et de support.**
6. **Autorisation explicite de tester le PSP officiel, puis de lancer les paiements réels.**

Cette spécification ne crée aucun paiement, compte client, webhook, facture ni e-mail.
