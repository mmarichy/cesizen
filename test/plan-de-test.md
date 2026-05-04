# Plan de test — CESIZen

| Élément | Détail |
|---------|--------|
| Application | CESIZen |
| Version du document | 1.3 |
| Date | 04/05/2026 |

Ce document fixe la **stratégie**, l’**organisation** et les **règles de décision** pour la validation avant livraison ou soutenance. Les scénarios métier sont dans le [`cahier-recette.md`](./cahier-recette.md) ; l’**exécution** cas par cas et les statuts OK/KO se notent dans le [`cahier-test.md`](./cahier-test.md) ; le **compte rendu** de séance dans le [`pv-recette.md`](./pv-recette.md).

---

## 1. Objet et périmètre

Formaliser la **recette fonctionnelle et technique** pour qu’elle soit **reproductible** et **traçable**, sur le périmètre décrit dans le cahier de recette (front-office, back-office, API).

---

## 2. Documents de référence

| Document | Usage |
|----------|--------|
| [`cahier-recette.md`](./cahier-recette.md) | Référence métier : périmètre, scénarios FR / BO / API, critères d’entrée et de sortie, matrice de traçabilité |
| [`cahier-test.md`](./cahier-test.md) | Grille d’exécution : résultat obtenu, statut, commentaires par cas (TC-*) |
| [`pv-recette.md`](./pv-recette.md) | Procès-verbal : synthèse, anomalies, décision |

---

## 3. Stratégie de test

| Niveau | Objectif | Preuve |
|--------|----------|--------|
| Tests automatisés | **Vitest** : logique liste / recherche + routes & layout admin (voir §3.1) | `npm test` au vert idéalement avant recette manuelle |
| Tests manuels | Conformité aux scénarios du cahier de recette | Cahier de test rempli + PV complété |
| Recette / décision | Go / no-go formalisé | PV de recette signé ou validé |

### 3.1 Couverture actuelle de `npm test` (Vitest)

Configuration : `vitest.config.ts`, motif `test/**/*.{test,spec}.{ts,tsx}`.  
Identifiants **TU-xx** (test unitaire automatisé) : alignés sur le [`cahier-test.md`](./cahier-test.md) §6 et la matrice [`cahier-recette.md`](./cahier-recette.md) §10.

| TU | Fichier | Intitulé du `it` (Vitest) | Scénario recette |
|----|---------|---------------------------|------------------|
| TU-01 | `articles/search.test.ts` | recherche texte : titre ou libellé de catégorie | FR-02 |
| TU-02 | idem | normalise casse et espaces pour la recherche | FR-02 |
| TU-03 | idem | sans filtre : recherche vide et catégorie null retournent la liste complète | FR-02 |
| TU-04 | idem | filtre par catégorie sélectionnée | FR-02 |
| TU-05 | idem | articleMatchesCategory reflète la catégorie active | FR-02 |
| TU-06 | `activities/search-filter.test.ts` | recherche texte et normalisation casse / espaces | FR-04 |
| TU-07 | idem | filtre par catégorie et par difficulté | FR-04 |
| TU-08 | idem | filtre par durée | FR-04 |
| TU-09 | idem | combine recherche et filtres | FR-04 |
| TU-10 | idem | retourne 0 si la combinaison de filtres est incompatible | FR-04 |
| TU-11 | `layout-admin.test.tsx` | affiche la page admin sans redirection | BO-01 |
| TU-12 | idem | redirige vers login si non connecté | BO-01 |
| TU-13 | idem | redirige vers profil si utilisateur non admin | BO-01 |
| TU-14 | `articles-api-admin.test.ts` | retourne 401/403 si accès refusé | BO-03 |
| TU-15 | idem | GET renvoie pagination | BO-03 |
| TU-16 | idem | PATCH archive et crée un audit | BO-03 |
| TU-17 | idem | DELETE gère succès + 400 + 404 | BO-03 |
| TU-18 | `activities-api-admin.test.ts` | retourne 401/403 si accès refusé | BO-04 |
| TU-19 | idem | GET renvoie pagination | BO-04 |
| TU-20 | idem | PATCH archive et crée un audit | BO-04 |
| TU-21 | idem | DELETE gère succès + 400 + 404 | BO-04 |
| TU-22 | `users-api-admin.test.ts` | retourne 401/403 si accès refusé | BO-02 |
| TU-23 | idem | GET renvoie pagination | BO-02 |
| TU-24 | idem | POST crée un user, ou retourne 409 si déjà existant | BO-02 |
| TU-25 | idem | PATCH met à jour, ou retourne 400/404 sur erreurs | BO-02 |
| TU-26 | idem | DELETE supprime, ou retourne 400/404 sur erreurs | BO-02 |

**Total : 26 TU, 6 fichiers.** Hors périmètre Vitest : routes publiques `/api/articles` et `/api/activities`, `/api/account/*`, pages front React, auth réelle, PWA — **recette manuelle**.

---

## 4. Rôles et responsabilités

| Rôle | Responsabilité |
|------|----------------|
| **Exécutant (testeur)** | Préparer l’environnement, exécuter les cas du cahier de test, consigner les écarts (cahier + PV) |
| **Validateur** | Arbitrer les anomalies, confirmer le **go / no-go** |
| **Développeur** (si besoin) | Corriger les anomalies bloquantes ou planifier les correctifs |

Les rôles peuvent être cumulés (ex. contexte pédagogique).

---

## 5. Prérequis avant de commencer

1. **Code** : branche / commit identifié (noter la référence dans le PV).
2. **Environnement** :
   - Node.js et dépendances (`npm install`)
   - PostgreSQL, `DATABASE_URL` dans `.env`
   - Migrations appliquées (`npx prisma migrate dev` ou équivalent)
   - **Seed exécuté** : `npx prisma db seed` (données dans `prisma/seed.ts`)
3. **Application** : `npm run dev` (ou URL de préproduction).
4. **Tests automatisés** : `npm test` — inventaire §3.1 ; dépendances **mockées** (Prisma, session admin, etc.) ; en cas d’échec, consigner dans le PV si écart accepté ou non.
5. **Navigateur** : version récente ; cookies autorisés pour la session.

---

## 6. Déroulement recommandé

### 6.1 Préparation

1. Vérifier les **critères d’entrée** du [`cahier-recette.md`](./cahier-recette.md) (§5).
2. Ouvrir le [`cahier-test.md`](./cahier-test.md) et le [`pv-recette.md`](./pv-recette.md) : renseigner en-têtes (date, testeur, environnement).

### 6.2 Exécution

1. Enchaîner les cas du cahier de test (front-office, authentification, back-office, API si test manuel).
2. Pour chaque cas : **OK**, **KO**, **BLOQUE** ou **N/A** (légende §2 du cahier de test).
3. Reporter la **synthèse** dans le [`pv-recette.md`](./pv-recette.md).
4. En cas de **KO** : consigner une anomalie (résumé, sévérité, reproduction courte).

### 6.3 Clôture

1. Finaliser le **bilan** du cahier de test (totaux OK / KO / BLOQUE / N/A) et la **synthèse** du PV.
2. Compléter le [`pv-recette.md`](./pv-recette.md) : **décision** et suites.
3. Vérifier les **critères de sortie** du cahier de recette (§6) : scénarios P1, anomalies bloquantes / critiques.

---

## 7. Règles de décision (go / no-go)

| Situation | Décision type |
|-----------|----------------|
| Tous les scénarios **P1** en **OK** (ou N/A justifié) ; aucune anomalie **bloquante** ou **critique** ouverte | **Go** — recette acceptée |
| Anomalies **bloquantes** ou **critiques** sans correctif ni dérogation | **No-go** — recette refusée ou reportée |
| Uniquement anomalies **majeures** ou **mineures** avec plan de correction ou acceptation du validateur | **Go avec réserves** |

La décision finale est **écrite** dans le PV (signatures ou courriel selon le contexte).

---

## 8. Traçabilité

- Conserver le **cahier de test rempli** et le **PV de recette** complétés (export PDF ou commit daté) avec la date de séance.
- Mention type : *« Validation selon `test/plan-de-test.md`, scénarios `test/cahier-recette.md`, exécution `test/cahier-test.md`, compte rendu `test/pv-recette.md`. »*

---

## 9. Historique

| Version | Date | Modification |
|---------|------|--------------|
| 1.0 | — | Fusion ancienne procédure de validation + plan de test |
| 1.1 | — | Suppression du cahier de tests : exécution consignée dans le PV |
| 1.2 | — | Réintroduction du `cahier-test.md` : exécution détaillée + synthèse PV |
| 1.3 | 04/05/2026 | Alignement sur la couverture Vitest actuelle (§3.1) |
| 1.4 | 04/05/2026 | Traçabilité **TU-01 … TU-26** : plan §3.1, cahier-test §6, recette §10 |
| 1.5 | 04/05/2026 | Condensation `cahier-recette.md` et `cahier-test.md` ; fichier unique recette `cahier-recette.md` |
