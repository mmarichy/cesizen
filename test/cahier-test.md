# Cahier de test — CESIZen

## 1. Informations générales


| Champ            | Valeur          |
| ---------------- | --------------- |
| Projet           | CESIZen         |
| Version testée   |                 |
| Date campagne    |                 |
| Testeur          |                 |
| Environnement    | local / préprod |
| Branche / commit |                 |


**Déroulement** : [`plan-de-test.md`](./plan-de-test.md) → campagne §7 → [`modele-pv-recette.md`](./modele-pv-recette.md).

## 2. Statuts

**OK** / **KO** / **BLOQUE** / **N/A** (hors périmètre ou données absentes, ex. archivés non seedés).

## 3. Prérequis

`npm run dev` ; PostgreSQL + `DATABASE_URL` ; **`npx prisma db seed`**. **Vitest** : 26 **TU** — détail [`plan-de-test.md`](./plan-de-test.md) §3.1 ; plages [§6](#6-tests-unitaires-vitest-plages-tu). Reste **§7** = manuel.

## 4. Comptes seed


| Rôle  | Email                 | Mot de passe |
| ----- | --------------------- | ------------ |
| ADMIN | `admin@cesizen.local` | `Admin123!`  |
| USER  | `user@cesizen.local`  | `User123!`   |


**Données** : 6 articles / 5 activités publiées ; pas d’archivé seed ; recherche articles sur titre + libellé catégorie.

## 5. Correspondance


| Type              | Réf. [`cahier-recette.md`](./cahier-recette.md) |
| ----------------- | ----------------------------------------------- |
| TU-01–26          | §3 plan + §8–10 recette                         |
| TC-FO-*           | FR-01–07 + smoke                                |
| TC-AUTH-*         | Auth                                            |
| TC-BO-*           | BO + dashboard / logs                           |
| TC-NG-*, TC-API-* | API-01–04                                       |
| TC-PREV-*         | Preview optionnel                               |


## 6. Tests unitaires Vitest (plages TU)

Détail nom par nom : [`plan-de-test.md`](./plan-de-test.md) §3.1.


| Plage    | Fichier `test/pages/...`             | Recette |
| -------- | ------------------------------------ | ------- |
| TU-01–05 | `articles/search.test.ts`            | FR-02   |
| TU-06–10 | `activities/search-filter.test.ts`   | FR-04   |
| TU-11–13 | `admin/layout-admin.test.tsx`        | BO-01   |
| TU-14–17 | `admin/articles-api-admin.test.ts`   | BO-03   |
| TU-18–21 | `admin/activities-api-admin.test.ts` | BO-04   |
| TU-22–26 | `admin/users-api-admin.test.ts`      | BO-02   |



| Contrôle                   | Valeur    |
| -------------------------- | --------- |
| `npm test` (date / commit) |           |
| 26 / 26 TU OK              | oui / non |


---

## 7. Grille manuelle

Statut **OK / KO / BLOQUE / N/A**. Contrôles : [`cahier-recette.md`](./cahier-recette.md) §8.

### 7.1 Front-office


| ID       | Réf.  | Intitulé                       | Statut | Commentaire |
| -------- | ----- | ------------------------------ | ------ | ----------- |
| TC-FO-01 | FR-01 | Liste / détail articles        | OK     | Conforme    |
| TC-FO-02 | FR-02 | Recherche article              | OK     | Conforme    |
| TC-FO-03 | FR-02 | Filtre catégorie article       | OK     | Conforme    |
| TC-FO-04 | FR-02 | Recherche + catégorie          | OK     | Conforme    |
| TC-FO-05 | FR-03 | Liste / détail activités       | OK     | Conforme    |
| TC-FO-06 | FR-04 | Recherche / filtres activités  | OK     | Conforme    |
| TC-FO-07 | FR-05 | Profil maj nominale            | OK     | Conforme    |
| TC-FO-08 | FR-05 | Profil validations KO          | OK     | Conforme    |
| TC-FO-09 | FR-06 | Favoris                        | OK     | Conforme    |
| TC-FO-10 | FR-07 | Contenus non publiés           | OK     | Conforme    |
| TC-FO-11 | —     | Accueil `/`                    | OK     | Conforme    |
| TC-FO-12 | FR-02 | URL partageable liste articles | OK     | Conforme    |


### 7.2 Authentification


| ID         | Intitulé                          | Statut | Commentaire |
| ---------- | --------------------------------- | ------ | ----------- |
| TC-AUTH-01 | Connexion OK                      | OK     | Conforme    |
| TC-AUTH-02 | Connexion KO                      | OK     | Conforme    |
| TC-AUTH-03 | Inscription OK                    | OK     | Conforme    |
| TC-AUTH-04 | Inscription email existant        | OK     | Conforme    |
| TC-AUTH-05 | Déconnexion                       | OK     | Conforme    |
| TC-AUTH-06 | Lien admin (ADMIN oui / USER non) | OK     | Conforme    |


### 7.3 Back-office


| ID       | Réf.  | Intitulé               | Statut | Commentaire |
| -------- | ----- | ---------------------- | ------ | ----------- |
| TC-BO-01 | BO-01 | Accès selon rôle       | OK     | Conforme    |
| TC-BO-02 | BO-02 | Utilisateurs CRUD      | OK     | Conforme    |
| TC-BO-03 | BO-03 | Articles cycle de vie  | OK     | Conforme    |
| TC-BO-04 | BO-04 | Activités cycle de vie | OK     | Conforme    |
| TC-BO-05 | —     | Dashboard              | OK     | Conforme    |
| TC-BO-06 | —     | Journaux audit         | OK     | Conforme    |


### 7.4 API manuel (curl / REST)


| ID        | Intitulé                  | Attendu       | Statut | Commentaire |
| --------- | ------------------------- | ------------- | ------ | ----------- |
| TC-NG-01  | POST user doublon         | 409           | OK     | Conforme    |
| TC-NG-02  | Admin sans session        | 401           | OK     | Conforme    |
| TC-NG-03  | Admin en USER             | 403           | OK     | Conforme    |
| TC-NG-04  | DELETE id invalide        | 400 / 404     | OK     | Conforme    |
| TC-NG-05  | Favoris payload KO        | 400 / 404     | OK     | Conforme    |
| TC-API-01 | GET articles & activities | 200           | OK     | Conforme    |
| TC-API-02 | Profil & favoris          | selon contrat | OK     | Conforme    |


### 7.5 Optionnel


| ID         | Intitulé          | Statut | Commentaire |
| ---------- | ----------------- | ------ | ----------- |
| TC-PREV-01 | Preview activités | OK     | Conforme    |


---

## 8. Scénarios détaillés (pas à pas)

Utiliser ces fiches pendant l'exécution de la grille §7.  
Statut à reporter dans la grille : **OK / KO / BLOQUE / N/A**.

### 8.1 Front-office

#### TC-FO-01 — Liste / détail articles (FR-01)

- **Prérequis** : seed exécuté, au moins 1 article publié.
- **Étapes** :
  1. Ouvrir `/articles`.
  2. Vérifier l'affichage d'une liste d'articles.
  3. Cliquer sur un article.
  4. Vérifier l'ouverture de la page détail.
- **Résultat attendu** : la liste charge sans erreur et le détail affiche un contenu cohérent (titre, contenu, catégorie, date éventuelle).

#### TC-FO-02 — Recherche article (FR-02)

- **Prérequis** : page `/articles` ouverte avec plusieurs articles.
- **Étapes** :
  1. Saisir un mot présent dans un titre d'article.
  2. Observer la liste filtrée.
  3. Effacer la recherche.
- **Résultat attendu** : seuls les articles correspondants sont visibles; après effacement, la liste complète revient.

#### TC-FO-03 — Filtre catégorie article (FR-02)

- **Prérequis** : des articles de catégories différentes existent.
- **Étapes** :
  1. Ouvrir `/articles`.
  2. Sélectionner une catégorie dans le filtre.
  3. Vérifier les cartes affichées.
- **Résultat attendu** : tous les articles affichés appartiennent à la catégorie choisie.

#### TC-FO-04 — Recherche + catégorie (FR-02)

- **Prérequis** : recherche et filtre disponibles sur `/articles`.
- **Étapes** :
  1. Saisir une recherche.
  2. Appliquer une catégorie.
  3. Tester une combinaison sans résultat.
- **Résultat attendu** : la combinaison est prise en compte; l'état vide est proprement affiché quand aucun résultat n'est trouvé.

#### TC-FO-05 — Liste / détail activités (FR-03)

- **Prérequis** : activités publiées seedées.
- **Étapes** :
  1. Ouvrir `/activites`.
  2. Vérifier la liste.
  3. Ouvrir une fiche activité.
- **Résultat attendu** : la liste et le détail s'affichent sans erreur, avec les informations attendues (titre, difficulté, durée, catégorie).

#### TC-FO-06 — Recherche / filtres activités (FR-04)

- **Prérequis** : plusieurs activités avec difficultés et durées différentes.
- **Étapes** :
  1. Ouvrir `/activites`.
  2. Rechercher un terme.
  3. Filtrer par difficulté puis durée.
  4. Tester une combinaison incompatible.
- **Résultat attendu** : les filtres se cumulent correctement; la combinaison incompatible retourne 0 résultat sans casser l'interface.

#### TC-FO-07 — Profil mise à jour nominale (FR-05)

- **Prérequis** : utilisateur connecté (`user@cesizen.local`).
- **Étapes** :
  1. Ouvrir la page profil/compte.
  2. Modifier un champ autorisé (ex: prénom).
  3. Enregistrer.
  4. Recharger la page.
- **Résultat attendu** : message de succès et données persistées après rechargement.

#### TC-FO-08 — Profil validations KO (FR-05)

- **Prérequis** : utilisateur connecté.
- **Étapes** :
  1. Saisir une valeur invalide (ex: email invalide ou champ requis vide).
  2. Tenter d'enregistrer.
- **Résultat attendu** : blocage de la sauvegarde et message de validation explicite.

#### TC-FO-09 — Favoris (FR-06)

- **Prérequis** : utilisateur connecté, au moins un contenu favorisable.
- **Étapes** :
  1. Ajouter un contenu aux favoris.
  2. Ouvrir la liste des favoris.
  3. Retirer le favori.
- **Résultat attendu** : ajout visible immédiatement, présence dans la liste, puis suppression effective.

#### TC-FO-10 — Contenus non publiés (FR-07)

- **Prérequis** : disposer d'au moins un contenu non publié (sinon statut N/A justifié).
- **Étapes** :
  1. Ouvrir les listes publiques concernées.
  2. Rechercher le contenu non publié.
  3. Tenter l'accès direct via URL.
- **Résultat attendu** : contenu non publié invisible côté front public; accès direct refusé ou redirigé.

#### TC-FO-11 — Accueil `/` (smoke)

- **Prérequis** : application démarrée.
- **Étapes** :
  1. Ouvrir `/`.
  2. Vérifier le rendu principal.
  3. Tester les liens majeurs (articles, activités, connexion).
- **Résultat attendu** : page sans erreur bloquante et navigation principale fonctionnelle.

#### TC-FO-12 — URL partageable liste articles (FR-02)

- **Prérequis** : filtres/recherche actifs sur `/articles`.
- **Étapes** :
  1. Définir une recherche et/ou un filtre.
  2. Copier l'URL.
  3. Ouvrir l'URL dans un nouvel onglet.
- **Résultat attendu** : l'état de la liste est restauré conformément aux paramètres d'URL.

### 8.2 Authentification

#### TC-AUTH-01 — Connexion OK

- **Prérequis** : compte valide.
- **Étapes** :
  1. Ouvrir la page de connexion.
  2. Saisir email + mot de passe valides.
  3. Valider.
- **Résultat attendu** : connexion réussie et redirection vers une page connectée.

#### TC-AUTH-02 — Connexion KO

- **Prérequis** : aucun.
- **Étapes** :
  1. Saisir des identifiants invalides.
  2. Valider le formulaire.
- **Résultat attendu** : refus de connexion avec message d'erreur clair.

#### TC-AUTH-03 — Inscription OK

- **Prérequis** : email non utilisé.
- **Étapes** :
  1. Ouvrir l'inscription.
  2. Saisir des données valides.
  3. Soumettre.
- **Résultat attendu** : compte créé et flux de connexion/session conforme au produit.

#### TC-AUTH-04 — Inscription email existant

- **Prérequis** : email déjà présent en base.
- **Étapes** :
  1. Tenter une inscription avec cet email.
- **Résultat attendu** : création refusée avec message explicite (conflit fonctionnel).

#### TC-AUTH-05 — Déconnexion

- **Prérequis** : être connecté.
- **Étapes** :
  1. Cliquer sur déconnexion.
  2. Tenter d'accéder à une page protégée.
- **Résultat attendu** : session fermée et accès protégé refusé/redirigé.

#### TC-AUTH-06 — Lien admin (ADMIN oui / USER non)

- **Prérequis** : un compte ADMIN et un compte USER.
- **Étapes** :
  1. Se connecter en USER et vérifier l'absence d'accès admin.
  2. Se connecter en ADMIN et vérifier la présence de l'accès admin.
- **Résultat attendu** : visibilité et accès conformes au rôle.

### 8.3 Back-office

#### TC-BO-01 — Accès selon rôle (BO-01)

- **Prérequis** : comptes ADMIN et USER disponibles.
- **Étapes** :
  1. Non connecté: accéder à `/admin`.
  2. Connecté USER: accéder à `/admin`.
  3. Connecté ADMIN: accéder à `/admin`.
- **Résultat attendu** : non connecté redirigé login, USER refusé/redirigé, ADMIN autorisé.

#### TC-BO-02 — Utilisateurs CRUD (BO-02)

- **Prérequis** : connecté ADMIN.
- **Étapes** :
  1. Créer un utilisateur.
  2. Modifier un champ du user créé.
  3. Supprimer ce user.
  4. Tester création avec email déjà existant.
- **Résultat attendu** : cycle CRUD OK, doublon email refusé (409 côté API).

#### TC-BO-03 — Articles cycle de vie (BO-03)

- **Prérequis** : connecté ADMIN.
- **Étapes** :
  1. Créer un article.
  2. Modifier l'article.
  3. Archiver/désarchiver selon l'UI.
  4. Supprimer l'article.
- **Résultat attendu** : opérations persistées; erreurs correctement gérées sur cas invalides (400/404).

#### TC-BO-04 — Activités cycle de vie (BO-04)

- **Prérequis** : connecté ADMIN.
- **Étapes** :
  1. Créer une activité.
  2. Modifier l'activité.
  3. Archiver/désarchiver.
  4. Supprimer.
- **Résultat attendu** : cycle complet opérationnel; cas invalides gérés (400/404).

#### TC-BO-05 — Dashboard

- **Prérequis** : connecté ADMIN; dashboard implémenté.
- **Étapes** :
  1. Ouvrir la page dashboard.
  2. Vérifier chargement des indicateurs.
- **Résultat attendu** : widgets/statistiques visibles sans erreur technique.

#### TC-BO-06 — Journaux audit

- **Prérequis** : connecté ADMIN; module de logs présent.
- **Étapes** :
  1. Réaliser une action admin (création/modification).
  2. Ouvrir les journaux.
  3. Rechercher la trace correspondante.
- **Résultat attendu** : trace d'audit créée et consultable.

### 8.4 API manuel (curl / REST)

#### TC-NG-01 — POST user doublon

- **Prérequis** : session ADMIN valide + email existant.
- **Étapes** :
  1. Envoyer `POST /api/admin/users` avec un email déjà présent.
- **Résultat attendu** : **409**.

#### TC-NG-02 — Admin sans session

- **Prérequis** : aucune session.
- **Étapes** :
  1. Appeler un endpoint `/api/admin/`*.
- **Résultat attendu** : **401**.

#### TC-NG-03 — Admin en USER

- **Prérequis** : session USER active.
- **Étapes** :
  1. Appeler un endpoint `/api/admin/`*.
- **Résultat attendu** : **403**.

#### TC-NG-04 — DELETE id invalide

- **Prérequis** : session ADMIN active.
- **Étapes** :
  1. Envoyer `DELETE` avec un id mal formé.
  2. Envoyer `DELETE` avec un id bien formé inexistant.
- **Résultat attendu** : **400** (id invalide) puis **404** (introuvable).

#### TC-NG-05 — Favoris payload KO

- **Prérequis** : session utilisateur si endpoint protégé.
- **Étapes** :
  1. Appeler l'endpoint favoris avec payload invalide.
- **Résultat attendu** : **400** (payload invalide) ou **404** (ressource absente), selon le cas.

#### TC-API-01 — GET articles & activities

- **Prérequis** : API publique disponible.
- **Étapes** :
  1. Appeler `GET /api/articles`.
  2. Appeler `GET /api/activities`.
  3. Vérifier schéma de réponse.
- **Résultat attendu** : **200**, payload exploitable, absence de données sensibles.

#### TC-API-02 — Profil & favoris

- **Prérequis** : session utilisateur pour cas authentifiés.
- **Étapes** :
  1. Tester GET/PATCH profil sans session puis avec session.
  2. Tester opérations favoris sans session puis avec session.
- **Résultat attendu** : codes conformes au contrat (401/200/400 selon cas).

### 8.5 Optionnel

#### TC-PREV-01 — Preview activités

- **Prérequis** : fonctionnalité preview activée.
- **Étapes** :
  1. Ouvrir une URL `/preview/activities/`*.
  2. Vérifier le rendu d'aperçu.
- **Résultat attendu** : aperçu correct, accès conforme aux règles de sécurité.

## 9. Bilan


| Indicateur             | Valeur  |
| ---------------------- | ------- |
| TU (§6)                | OK / KO |
| TC exécutés (§7)       |         |
| OK / KO / BLOQUE / N/A |         |
| Taux TC                |         |


**Synthèse** :

## 10. Anomalies


| ID      | Résumé | Sévérité | Statut |
| ------- | ------ | -------- | ------ |
| ANO-001 |        |          |        |


---

*CESIZen — condensé. Matrice recette : `[cahier-recette.md](./cahier-recette.md)` §10.*