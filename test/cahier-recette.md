# Cahier de recette — CESIZen

Référence métier condensée. **Exécution / statuts** : [`cahier-test.md`](./cahier-test.md). **Synthèse / décision** : [`pv-recette.md`](./pv-recette.md). **Processus** : [`plan-de-test.md`](./plan-de-test.md).

---

## 1. Informations documentaires

| Élément | Détail |
|---------|--------|
| Application | CESIZen |
| Version / lot | (à renseigner) |
| Rédacteur / Validateur / Date cible | |

---

## 2. Objectif

Valider front-office (consultation, compte, favoris), back-office admin (utilisateurs, articles, activités), et **contrats API** (codes HTTP, pas de fuite de données sensibles côté public).

---

## 3. Périmètre et automatisé

- **Front** : articles (liste, détail, recherche titre + catégorie, URL), activités (liste, détail, filtres), compte, favoris.
- **Admin** : accès par rôle, CRUD utilisateurs / articles / activités, dashboard & journaux si présents.
- **API** : `/api/articles`, `/api/activities`, `/api/account/*`, `/api/admin/*`.
- **Vitest** : **26** tests **TU-01 … TU-26** — **source unique** : [`plan-de-test.md`](./plan-de-test.md) **§3.1** ; grille campagne [`cahier-test.md`](./cahier-test.md) **§6 bis** (plages). Hors auto : API publiques réelles, compte, UI navigateur, auth cookie, PWA.
- **Hors périmètre** : charge, SEO poussé, WCAG détaillé, navigateurs legacy ; **FR-07** (non publiés) sans jeu de données adapté.

---

## 4. Environnement

`npm run dev` ou préprod ; PostgreSQL + migrations + **`npx prisma db seed`** ; `.env` avec `DATABASE_URL`. Comptes : `admin@cesizen.local` / `Admin123!`, `user@cesizen.local` / `User123!`. Seed : **6** articles, **5** activités publiées, pas d’archivé par défaut.

---

## 5. Critères d’entrée

Build OK ; seed OK ; **`npm test` au vert** (26 TU, §3.1 plan) ; le reste en manuel selon [`cahier-test.md`](./cahier-test.md) §7.

---

## 6. Critères de sortie

Scénarios **P1** exécutés et statués ; **0** bloquant/critique ouvert sans plan ; validation métier tracée (PV).

---

## 7. Légende

**ID** FR-xx, BO-xx, API-xx ; **P1** obligatoire, **P2** recommandé, **P3** si données. **TU** = Vitest ; **TC** = manuel §7 cahier-test. Détail pas-à-pas : improviser selon les tableaux §8 ou le code / produit.

---

## 8. Scénarios (synthèse exécutable)

| ID | P | Contrôles essentiels | TU | TC (manuel) |
|----|---|----------------------|----|-------------|
| FR-01 | P1 | `/articles` liste + détail, contenus publiés | — | TC-FO-01 |
| FR-02 | P1 | Recherche, filtre cat., combinaison, URL ; état vide OK | TU-01–05 | TC-FO-02,03,04,12 |
| FR-03 | P1 | `/activites` liste + détail, données seed | — | TC-FO-05 |
| FR-04 | P1 | Recherche + filtres (difficulté, durée), combinaison vide OK | TU-06–10 | TC-FO-06 |
| FR-05 | P1 | Profil : maj OK, validations KO, mdp si prévu | — | TC-FO-07,08 |
| FR-06 | P1 | Favoris ajout / liste / retrait | — | TC-FO-09 |
| FR-07 | P2 | Non publiés invisibles front (préparer données) | — | TC-FO-10 |
| — | — | Accueil `/`, smoke | — | TC-FO-11 |
| BO-01 | P1 | `/admin` : redirect login, USER refusé, ADMIN OK | TU-11–13 | TC-BO-01, TC-AUTH-06 |
| BO-02 | P1 | Users CRUD + email dupliqué (409) | TU-22–26 | TC-BO-02, TC-NG-01 |
| BO-03 | P1 | Articles cycle vie + erreurs 400/404 | TU-14–17 | TC-BO-03 |
| BO-04 | P1 | Activités idem BO-03 | TU-18–21 | TC-BO-04 |
| — | P2 | Dashboard, journaux admin | — | TC-BO-05,06 |
| API-01 | P1 | `GET` articles/activities **200**, DTO, pas de secrets | — | TC-API-01 |
| API-02 | P1 | Profil GET/PATCH (401, 200, 400) | — | TC-API-02 |
| API-03 | P1 | Favoris 401 + nominal + 400 | — | TC-API-02 |
| API-04 | P1 | Admin 401 / 403 / OK ; DELETE id invalide 400/404 | — | TC-NG-02,03,04 |
| — | opt. | Preview `/preview/activities/*` | — | TC-PREV-01 |

---

## 9. Anomalie (modèle)

| ID | Date | Scénario | Env | Sévérité | Statut |
|----|------|----------|-----|----------|--------|
| | | FR/BO/API | | | |

---

## 10. Matrice recette → tests

| ID recette | Intitulé | Vitest | Fiches manuelles |
|------------|----------|--------|------------------|
| FR-01 | Articles liste / détail | — | TC-FO-01 |
| FR-02 | Articles rech. / filtres | TU-01–05 | TC-FO-02,03,04,12 |
| FR-03 | Activités liste / détail | — | TC-FO-05 |
| FR-04 | Activités rech. / filtres | TU-06–10 | TC-FO-06 |
| FR-05 | Profil | — | TC-FO-07,08 |
| FR-06 | Favoris | — | TC-FO-09 |
| FR-07 | Non publiés | — | TC-FO-10 |
| BO-01 | Accès admin | TU-11–13 | TC-BO-01, TC-AUTH-06 |
| BO-02 | CRUD utilisateurs | TU-22–26 | TC-BO-02 |
| BO-03 | Articles admin | TU-14–17 | TC-BO-03 |
| BO-04 | Activités admin | TU-18–21 | TC-BO-04 |
| API-01–04 | Contrats API | — | TC-API-01,02, TC-NG-* |

---

*Version condensée — à versionner avec le projet.*
