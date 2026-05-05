# Procès-verbal de recette — CESIZen

> PV de synthèse de campagne. Scénarios : [`cahier-recette.md`](./cahier-recette.md). Exécution : [`cahier-test.md`](./cahier-test.md). Processus : [`plan-de-test.md`](./plan-de-test.md).

## 1) En-tête de campagne

| Date       | Lieu / support    | Version / commit | Branche | Environnement (URL)     |
| ---------- | ----------------- | ---------------- | ------- | ----------------------- |
| 2026-05-05 | Local (poste dev) | `97b9b75`        | `main`  | `http://localhost:3000` |

## 2) Participants et responsabilités

| Nom            | Rôle           | Responsabilité recette                                |
| -------------- | -------------- | ----------------------------------------------------- |
| Mathis MARICHY | Développeur    | Préparation environnement, corrections et stabilité   |
| Mathis MARICHY | Testeur        | Exécution du cahier de test et consolidation évidences |
| Mathis MARICHY | Chef de projet | Arbitrage des réserves et décision de recette         |

## 3) Références documentaires

| Document                            | Chemin                      | Version/Date |
| ----------------------------------- | --------------------------- | ------------ |
| Plan de test                        | `test/plan-de-test.md`      | 2026-05-05   |
| Cahier de recette                   | `test/cahier-recette.md`    | 2026-05-05   |
| Cahier de test (évidence exécution) | `test/cahier-test.md`       | 2026-05-05   |
| Présent PV                          | `test/modele-pv-recette.md` | 2026-05-05   |

## 4) Périmètre validé

- **Inclus** : front-office (articles, activités, compte, favoris), back-office admin (utilisateurs, articles, activités), contrats API identifiés dans le cahier de recette.
- **Exclus / reportés** : tests de charge, SEO avancé, audit WCAG détaillé, navigateurs legacy, scénarios nécessitant des données non publiées non préparées.

## 5) Résultats des tests automatisés (Vitest)

| Contrôle                   | Résultat     | Évidence                             |
| -------------------------- | ------------ | ------------------------------------ |
| Commande `npm test`        | OK           | exécution locale terminée sans échec |
| Nombre de fichiers de test | 6/6 passés   | sortie terminal                      |
| Nombre de tests unitaires  | 26/26 passés | sortie terminal                      |
| Durée de campagne auto     | 1.60s        | sortie terminal                      |

### Détail des lots TU

| Plage TU      | Domaine                     | Résultat |
| ------------- | --------------------------- | -------- |
| TU-01 à TU-05 | Recherche articles          | OK       |
| TU-06 à TU-10 | Recherche/filtres activités | OK       |
| TU-11 à TU-13 | Contrôle accès admin        | OK       |
| TU-14 à TU-17 | API admin articles          | OK       |
| TU-18 à TU-21 | API admin activités         | OK       |
| TU-22 à TU-26 | API admin utilisateurs      | OK       |

## 6) Résultats des tests manuels (grille `cahier-test.md` §7)

| Lot manuel                     | Cas prévus | Cas exécutés | OK     | KO    | BLOQUÉ | N/A   |
| ------------------------------ | ---------- | ------------ | ------ | ----- | ------ | ----- |
| Front-office (TC-FO-\*)        | 12         | 12           | 12     | 0     | 0      | 0     |
| Authentification (TC-AUTH-\*)  | 6          | 6            | 6      | 0     | 0      | 0     |
| Back-office (TC-BO-\*)         | 6          | 6            | 6      | 0     | 0      | 0     |
| API manuel (TC-NG-*, TC-API-*) | 7          | 7            | 7      | 0     | 0      | 0     |
| Optionnel (TC-PREV-01)         | 1          | 1            | 1      | 0     | 0      | 0     |
| **Total**                      | **32**     | **32**       | **32** | **0** | **0**  | **0** |

**Commentaire manuel** : campagne manuelle exécutée intégralement et validée. Tous les cas prévus sont au statut **OK**.

## 7) Anomalies, risques et réserves

### Anomalies ouvertes

| ID                             | Source | Résumé       | Sévérité | Décision     |
| ------------------------------ | ------ | ------------ | -------- | ------------ |
| Aucune détectée pendant les TU | Vitest | 26/26 passés | -        | Suivi normal |

### Risques / points de vigilance

| ID                           | Point | Impact potentiel | Action de maîtrise |
| ---------------------------- | ----- | ---------------- | ------------------ |
| Aucun risque bloquant relevé | -     | -                | -                  |

## 8) Décision de recette

- [x] **Recette acceptée sans réserve**
- [ ] **Recette partielle / avec réserves**
- [ ] **Recette refusée / reportée**

**Motif de décision** : les tests automatisés (26/26) et l'ensemble des tests manuels (32/32) sont validés, sans anomalie bloquante ni réserve ouverte.

## 9) Plan d'actions (suites)

| Action                                        | Responsable    | Échéance   | Critère de clôture                                   |
| --------------------------------------------- | -------------- | ---------- | ---------------------------------------------------- |
| Archiver les évidences de campagne            | Mathis MARICHY | 2026-05-05 | Pièces de preuve centralisées avec le cahier de test |
| Clôturer administrativement la recette        | Mathis MARICHY | 2026-05-05 | PV signé et décision communiquée                     |
| Planifier la prochaine campagne (lot suivant) | Mathis MARICHY | à définir  | Nouveau périmètre, pré-requis et planning validés    |

## 10) Signatures

| Rôle           | Nom            | Date       | Signature |
| -------------- | -------------- | ---------- | --------- |
| Développeur    | Mathis MARICHY | 2026-05-05 |           |
| Testeur        | Mathis MARICHY | 2026-05-05 |           |
| Chef de projet | Mathis MARICHY | 2026-05-05 |           |
