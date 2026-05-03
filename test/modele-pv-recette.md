# Modèle de procès-verbal (PV) de recette — CESIZen

> **Document modèle** : à dupliquer ou exporter pour chaque séance de recette, puis à **compléter** le jour J.  
> Ne pas confondre avec le [`cahier-recette.md`](./cahier-recette.md) (référence des scénarios) ni avec le [`cahier-test.md`](./cahier-test.md) (détail des cas exécutés).

---

## En-tête

| Champ | Valeur |
|--------|--------|
| **Titre** | Procès-verbal de recette — CESIZen |
| **Date de la séance** | |
| **Lieu** | (distanciel / salle / lien visio) |
| **Version du produit testée** | (branche Git, tag, ou identifiant de build) |
| **Commit / hash** | |
| **Environnement** | (ex. local `npm run dev`, URL : …) |

---

## Participants

| Nom | Rôle (testeur, validateur, observateur, …) |
|-----|---------------------------------------------|
| | |
| | |

---

## Références documentaires

| Document | Référence (chemin ou lien) | Version / date |
|----------|----------------------------|----------------|
| Cahier de recette | `test/cahier-recette.md` | |
| Cahier de test exécuté | `test/cahier-test.md` | |
| Procédure de validation | `test/procedure-validation.md` | |

---

## Périmètre de la séance

- **Inclus** : (ex. scénarios P1 uniquement, front + back + API, …)
- **Exclus ou reporté** : (ex. FR-07 sans données archivées, tests de charge, …)

---

## Synthèse des résultats

*(À compléter à partir du bilan du cahier de test.)*

| Indicateur | Valeur |
|------------|--------|
| Nombre de cas exécutés | |
| **OK** | |
| **KO** | |
| **BLOQUE** | |
| **N/A** | |
| Taux de réussite (OK / exécutés) | % |

**Commentaire synthétique** :


---

## Anomalies relevées pendant la recette

*(Lister les principales ; le détail peut rester dans le cahier de test.)*

| ID | Résumé | Sévérité (Bloquante / Critique / Majeure / Mineure) | Statut à date du PV |
|----|--------|-----------------------------------------------------|---------------------|
| | | | |
| | | | |

---

## Décision de recette

Cocher **une** case et compléter si besoin.

- [ ] **Recette acceptée** — Le produit répond aux critères de sortie du cahier de recette pour le périmètre ci-dessus.
- [ ] **Recette acceptée avec réserves** — Préciser les réserves et les engagements (date, responsable) :
- [ ] **Recette refusée ou reportée** — Motifs :

**Détail de la décision** :


---

## Suites à donner

| Action | Responsable | Échéance |
|--------|-------------|----------|
| | | |
| | | |

---

## Signatures / validation

*(Adapter selon les exigences du jury ou du client.)*

| Rôle | Nom | Signature | Date |
|------|-----|-----------|------|
| Validateur | | | |
| Exécutant (testeur) | | | |

---

## Annexes (optionnel)

- Capture d’écran, exports API, logs d’erreur, lien vers ticket ou PR.

---

*Fin du modèle — conserver une copie archivée avec la version du code testé.*
