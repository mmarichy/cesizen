# Cahier de test — CESIZen

## 1. Informations générales

| Champ | Valeur |
|--------|--------|
| Projet | CESIZen |
| Version testée | |
| Date campagne | |
| Testeur | |
| Environnement | local / préprod |
| Branche / commit | |

**Déroulement** : [`plan-de-test.md`](./plan-de-test.md) → campagne §7 → [`pv-recette.md`](./pv-recette.md).

## 2. Statuts

**OK** / **KO** / **BLOQUE** / **N/A** (hors périmètre ou données absentes, ex. archivés non seedés).

## 3. Prérequis

`npm run dev` ; PostgreSQL + `DATABASE_URL` ; **`npx prisma db seed`**. **Vitest** : 26 **TU** — détail [`plan-de-test.md`](./plan-de-test.md) §3.1 ; plages [**§6**](#6-tests-unitaires-vitest-plages-tu). Reste **§7** = manuel.

## 4. Comptes seed

| Rôle | Email | Mot de passe |
|------|--------|---------------|
| ADMIN | `admin@cesizen.local` | `Admin123!` |
| USER | `user@cesizen.local` | `User123!` |

**Données** : 6 articles / 5 activités publiées ; pas d’archivé seed ; recherche articles sur titre + libellé catégorie.

## 5. Correspondance

| Type | Réf. [`cahier-recette.md`](./cahier-recette.md) |
|------|--------------------------------------------------|
| TU-01–26 | §3 plan + §8–10 recette |
| TC-FO-* | FR-01–07 + smoke |
| TC-AUTH-* | Auth |
| TC-BO-* | BO + dashboard / logs |
| TC-NG-*, TC-API-* | API-01–04 |
| TC-PREV-* | Preview optionnel |

## 6. Tests unitaires Vitest (plages TU)

Détail nom par nom : [`plan-de-test.md`](./plan-de-test.md) §3.1.

| Plage | Fichier `test/pages/...` | Recette |
|-------|--------------------------|---------|
| TU-01–05 | `articles/search.test.ts` | FR-02 |
| TU-06–10 | `activities/search-filter.test.ts` | FR-04 |
| TU-11–13 | `admin/layout-admin.test.tsx` | BO-01 |
| TU-14–17 | `admin/articles-api-admin.test.ts` | BO-03 |
| TU-18–21 | `admin/activities-api-admin.test.ts` | BO-04 |
| TU-22–26 | `admin/users-api-admin.test.ts` | BO-02 |

| Contrôle | Valeur |
|----------|--------|
| `npm test` (date / commit) | |
| 26 / 26 TU OK | oui / non |

---

## 7. Grille manuelle

Statut **OK / KO / BLOQUE / N/A**. Contrôles : [`cahier-recette.md`](./cahier-recette.md) §8.

### 7.1 Front-office

| ID | Réf. | Intitulé | Statut | Commentaire |
|----|------|----------|--------|-------------|
| TC-FO-01 | FR-01 | Liste / détail articles | | |
| TC-FO-02 | FR-02 | Recherche article | | |
| TC-FO-03 | FR-02 | Filtre catégorie article | | |
| TC-FO-04 | FR-02 | Recherche + catégorie | | |
| TC-FO-05 | FR-03 | Liste / détail activités | | |
| TC-FO-06 | FR-04 | Recherche / filtres activités | | |
| TC-FO-07 | FR-05 | Profil maj nominale | | |
| TC-FO-08 | FR-05 | Profil validations KO | | |
| TC-FO-09 | FR-06 | Favoris | | |
| TC-FO-10 | FR-07 | Contenus non publiés | | |
| TC-FO-11 | — | Accueil `/` | | |
| TC-FO-12 | FR-02 | URL partageable liste articles | | |

### 7.2 Authentification

| ID | Intitulé | Statut | Commentaire |
|----|----------|--------|-------------|
| TC-AUTH-01 | Connexion OK | | |
| TC-AUTH-02 | Connexion KO | | |
| TC-AUTH-03 | Inscription OK | | |
| TC-AUTH-04 | Inscription email existant | | |
| TC-AUTH-05 | Déconnexion | | |
| TC-AUTH-06 | Lien admin (ADMIN oui / USER non) | | |

### 7.3 Back-office

| ID | Réf. | Intitulé | Statut | Commentaire |
|----|------|----------|--------|-------------|
| TC-BO-01 | BO-01 | Accès selon rôle | | |
| TC-BO-02 | BO-02 | Utilisateurs CRUD | | |
| TC-BO-03 | BO-03 | Articles cycle de vie | | |
| TC-BO-04 | BO-04 | Activités cycle de vie | | |
| TC-BO-05 | — | Dashboard | | |
| TC-BO-06 | — | Journaux audit | | |

### 7.4 API manuel (curl / REST)

| ID | Intitulé | Attendu | Statut | Commentaire |
|----|----------|---------|--------|-------------|
| TC-NG-01 | POST user doublon | 409 | | |
| TC-NG-02 | Admin sans session | 401 | | |
| TC-NG-03 | Admin en USER | 403 | | |
| TC-NG-04 | DELETE id invalide | 400 / 404 | | |
| TC-NG-05 | Favoris payload KO | 400 / 404 | | |
| TC-API-01 | GET articles & activities | 200 | | |
| TC-API-02 | Profil & favoris | selon contrat | | |

### 7.5 Optionnel

| ID | Intitulé | Statut | Commentaire |
|----|----------|--------|-------------|
| TC-PREV-01 | Preview activités | | |

---

## 8. Bilan

| Indicateur | Valeur |
|------------|--------|
| TU (§6) | OK / KO |
| TC exécutés (§7) | |
| OK / KO / BLOQUE / N/A | |
| Taux TC | |

**Synthèse** :

## 9. Anomalies

| ID | Résumé | Sévérité | Statut |
|----|--------|----------|--------|
| ANO-001 | | | |

---

*CESIZen — condensé. Matrice recette : [`cahier-recette.md`](./cahier-recette.md) §10.*
