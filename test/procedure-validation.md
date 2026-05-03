# Procédure de validation — CESIZen

Ce document décrit **comment** mener la validation du projet CESIZen : organisation, prérequis, enchaînement et règles de décision.  
Les **scénarios détaillés** sont dans [`cahier-recette.md`](./cahier-recette.md) ; l’**exécution cas par cas** et les statuts OK/KO se notent dans [`cahier-test.md`](./cahier-test.md).  
Le **compte rendu** de la séance se formalise avec le [`modele-pv-recette.md`](./modele-pv-recette.md).

---

## 1. Objet

Formaliser le déroulement de la **recette fonctionnelle et technique** avant livraison ou soutenance, afin que la validation soit **reproductible** et **traçable**.

---

## 2. Documents de référence

| Document | Usage |
|----------|--------|
| [`cahier-recette.md`](./cahier-recette.md) | Référence métier : périmètre, scénarios FR / BO / API, critères d’entrée et de sortie |
| [`cahier-test.md`](./cahier-test.md) | Grille d’exécution : pour chaque cas, renseigner résultat obtenu, statut, commentaires |
| [`modele-pv-recette.md`](./modele-pv-recette.md) | Gabarit du procès-verbal à compléter après la recette |

---

## 3. Rôles et responsabilités

| Rôle | Responsabilité |
|------|----------------|
| **Exécutant (testeur)** | Préparer l’environnement, enchaîner les cas du cahier de test, consigner les écarts |
| **Validateur** (enseignant, client, responsable pédagogique) | Arbitrer les anomalies, confirmer le **go / no-go** |
| **Développeur** (si besoin) | Corriger les anomalies bloquantes ou planifier les correctifs |

Les rôles peuvent être cumulés en contexte scolaire ; la procédure reste la même.

---

## 4. Prérequis avant de commencer

1. **Code** : branche / commit identifié (noter la référence dans le PV).
2. **Environnement** :
   - Node.js et dépendances installées (`npm install`)
   - PostgreSQL accessible, variable `DATABASE_URL` renseignée dans `.env`
   - Migrations appliquées (`npx prisma migrate deploy` ou équivalent projet)
   - **Seed exécuté** : `npx prisma db seed` (données décrites dans `prisma/seed.ts`)
3. **Application** : `npm run dev` — accès à l’URL locale (ex. `http://localhost:3000`).
4. **Tests automatisés** : `npm test` — idéalement **au vert** avant recette manuelle ; en cas d’échec, consigner dans le PV (écarts acceptés ou non).
5. **Navigateur** : version récente ; cookies autorisés pour la session.

---

## 5. Déroulement recommandé

### 5.1 Phase préparatoire

1. Vérifier les **critères d’entrée** du [`cahier-recette.md`](./cahier-recette.md) (§5).
2. Ouvrir [`cahier-test.md`](./cahier-test.md) et renseigner l’en-tête (date, testeur, environnement).

### 5.2 Phase d’exécution

1. Suivre l’ordre logique du cahier de test (front-office, authentification, back-office, API si test manuel).
2. Pour chaque cas : exécuter les étapes, cocher ou renseigner **OK**, **KO**, **BLOQUE** ou **N/A** (voir légende dans le cahier de test).
3. En cas de **KO** : ouvrir une entrée dans la section **Anomalies** (résumé, sévérité, reproduction courte).

### 5.3 Phase de clôture

1. Remplir le **bilan** du cahier de test (totaux OK / KO / BLOQUE).
2. Compléter le [`modele-pv-recette.md`](./modele-pv-recette.md) : date, participants, synthèse, **décision**.
3. Vérifier les **critères de sortie** du cahier de recette (§6) : P1 exécutés, anomalies bloquantes / critiques traitées ou acceptées par le validateur.

---

## 6. Règles de décision (go / no-go)

| Situation | Décision type |
|-----------|----------------|
| Tous les scénarios **P1** en **OK** (ou N/A justifié) ; aucune anomalie **bloquante** ou **critique** ouverte | **Go** — recette acceptée |
| Anomalies **bloquantes** ou **critiques** sans correctif ni dérogation acceptée | **No-go** — recette refusée ou reportée |
| Uniquement des anomalies **majeures** ou **mineures** avec plan de correction ou acceptation explicite du validateur | **Go avec réserves** |

La décision finale est **écrite** dans le PV et, si besoin, confirmée par signature ou courriel.

---

## 7. Traçabilité

- Conserver le **cahier de test rempli** (export PDF ou version du dépôt datée).
- Conserver le **PV de recette complété** avec la même date que la séance.
- Mentionner dans le dossier projet ou le rapport : *« Validation menée selon `test/procedure-validation.md`, scénarios `cahier-recette.md`, exécution `cahier-test.md`. »*

---

## 8. Historique des révisions

| Version | Date | Auteur | Modification |
|---------|------|--------|--------------|
| 1.0 | | | Création initiale |
