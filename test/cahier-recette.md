# Cahier de recette — CESIZen

Document de validation fonctionnelle et technique avant livraison. Les scénarios ci-dessous sont la référence métier ; leur exécution terrain est décrite dans [`cahier-test.md`](./cahier-test.md).  
**Organisation de la validation** : [`procedure-validation.md`](./procedure-validation.md). **Modèle de compte rendu** après recette : [`modele-pv-recette.md`](./modele-pv-recette.md).

---

## 1. Informations documentaires

| Élément | Détail |
|---------|--------|
| Application | CESIZen |
| Version / lot | (à renseigner) |
| Rédacteur recette | |
| Validateur métier | |
| Date de validation cible | |

---

## 2. Objectif de la recette

Vérifier que l’application respecte les exigences fonctionnelles et les règles de sécurité sur :

- le **front-office** (consultation, compte utilisateur, favoris) ;
- le **back-office administrateur** (gestion des utilisateurs, articles, activités) ;
- les **API** exposées (contrats, codes HTTP, absence de fuite de données sensibles côté public).

---

## 3. Périmètre

### 3.1 Front-office

| Domaine | Contenu |
|---------|---------|
| Articles | Liste, détail, recherche (titre + libellé de catégorie), filtre par catégorie, pagination / chargement selon implémentation |
| Activités | Liste, détail, recherche, filtres (catégorie, difficulté, durée) |
| Compte | Connexion, profil, mise à jour des informations (et changement de mot de passe si prévu) |
| Favoris | Ajout, liste, retrait d’activités favorites |

### 3.2 Back-office (administrateur)

| Domaine | Contenu |
|---------|---------|
| Accès | Contrôle d’accès (non connecté, utilisateur standard, administrateur) |
| Utilisateurs | Liste, création, modification, suppression (ou désactivation selon produit) |
| Articles | Liste, création, édition, changement de statut (publication / archivage), suppression si applicable |
| Activités | Liste, création, édition, changement de statut, suppression si applicable |

### 3.3 API

- Routes publiques : `/api/articles`, `/api/activities`
- Routes compte : `/api/account/profile`, `/api/account/activity-favorites`
- Routes administration : `/api/admin/*`

### 3.4 Hors périmètre (sauf mention explicite)

- Performance sous charge, SEO poussé, accessibilité WCAG détaillée, compatibilité navigateurs legacy
- Contenus **non publiés** : non couverts par le seed par défaut ; scénario **FR-07** réservé à un environnement où ces données ont été préparées

---

## 4. Environnement et données de référence

### 4.1 Environnement minimal

- Application démarrée (`npm run dev` ou build déployé en préproduction)
- Base PostgreSQL, migrations appliquées, **seed exécuté** (`prisma/seed.ts`)
- Fichier `.env` conforme (dont `DATABASE_URL`)

### 4.2 Comptes de recette (seed)

| Rôle | Email | Mot de passe |
|------|--------|--------------|
| Administrateur | `admin@cesizen.local` | `Admin123!` |
| Utilisateur | `user@cesizen.local` | `User123!` |

### 4.3 Jeu de données après seed

- **6 articles** publiés, catégories distinctes
- **5 activités** publiées (Méditation, Respiration, Musique, Exercice, Relaxation), durées et difficultés variées
- Aucun article ni activité **archivé** créé par le seed standard

---

## 5. Critères d’entrée en recette

- Build et démarrage sans erreur bloquante
- Migrations + seed OK
- Les tests automatisés du projet sont **au vert** (ou écarts documentés et acceptés par le responsable lot)

---

## 6. Critères de sortie

- Tous les scénarios **obligatoires** (priorité P1) du présent document ont été **exécutés** et **statués**
- **Zéro** anomalie **bloquante** ou **critique** ouverte sans plan de traitement accepté
- Anomalies **majeures** : documentées, priorisées, décision go/no-go tracée
- **Validation métier** explicite (signature ou courriel de clôture selon votre processus)

---

## 7. Légende des scénarios

Chaque scénario comporte :

- **ID** : identifiant stable (FR-xx, BO-xx, API-xx)
- **Priorité** : P1 = obligatoire avant livraison, P2 = recommandé, P3 = si données disponibles
- **Acteur** : qui en est responsable côté usage
- **Préconditions** : état initial requis
- **Déroulement** : étapes ordonnées
- **Résultat attendu** : comportement et, le cas échéant, codes HTTP
- **Traçabilité test** : id des cas dans `cahier-test.md`

---

## 8. Scénarios front-office

### FR-01 — Consultation des articles (liste et détail)

| Champ | Contenu |
|--------|---------|
| **Priorité** | P1 |
| **Acteur** | Visiteur ou utilisateur connecté |
| **Objectif** | Accéder aux contenus articles sans erreur |

**Préconditions**

- Seed exécuté ; au moins un article publié en base.

**Scénario détaillé — parcours nominal**

1. Ouvrir l’URL de la liste articles (`/articles`).
2. Vérifier l’affichage d’une liste de cartes (titres, extraits ou métadonnées cohérents avec la base).
3. Cliquer sur une carte pour ouvrir la page détail (`/articles/[id]`).
4. Vérifier que le contenu (titre, corps, auteur, date, catégorie) correspond à l’enregistrement attendu.
5. Revenir à la liste (navigation navigateur ou lien UI) sans erreur.

**Résultat attendu**

- Aucune page blanche ni message d’erreur technique non géré.
- Les seuls articles **publiés** accessibles depuis le front correspondent à la politique métier (pas de brouillon/archivé exposé en liste publique — voir FR-07 si applicable).

**Traçabilité test** : TC-FO-01

---

### FR-02 — Recherche et filtrage des articles

| Champ | Contenu |
|--------|---------|
| **Priorité** | P1 |
| **Acteur** | Visiteur ou utilisateur connecté |
| **Objectif** | Affiner la liste articles par texte et par catégorie |

**Préconditions**

- Page `/articles` chargée avec le jeu seed (6 articles, plusieurs catégories).

**Scénario détaillé — recherche par texte**

1. Saisir dans le champ de recherche un terme présent dans un **titre** d’article seed (ex. `nutrition`).
2. Valider que la liste ne contient que des articles dont le titre ou le **libellé de catégorie** contient ce terme (comportement client documenté).
3. Effacer la recherche et vérifier le retour à une liste élargie.

**Scénario détaillé — filtre catégorie**

1. Sélectionner une catégorie (ex. **Nutrition**).
2. Vérifier que tous les éléments affichés appartiennent à cette catégorie.

**Scénario détaillé — combinaison**

1. Choisir une catégorie (ex. **Santé Mentale**).
2. Saisir un terme présent dans un article de **cette** catégorie (ex. `émotions`).
3. Vérifier la cohérence des résultats (intersection recherche × catégorie).
4. Toujours avec la même catégorie, saisir un terme qui ne correspond à **aucun** article de cette catégorie (ex. `nutrition` alors que la catégorie active est Santé Mentale).
5. Vérifier l’affichage d’un état « aucun résultat » **sans** plantage de l’interface.

**Résultat attendu**

- Filtrage cohérent avec les règles produit ; gestion gracieuse du vide.

**Traçabilité test** : TC-FO-02, TC-FO-03, TC-FO-04

---

### FR-03 — Consultation des activités (liste et détail)

| Champ | Contenu |
|--------|---------|
| **Priorité** | P1 |
| **Acteur** | Visiteur ou utilisateur connecté |
| **Objectif** | Consulter le catalogue d’activités et le détail d’une fiche |

**Préconditions**

- Seed exécuté ; 5 activités publiées.

**Scénario détaillé**

1. Ouvrir `/activites`.
2. Contrôler sur les cartes : titre, catégorie, difficulté, durée — alignés avec les données seed.
3. Ouvrir le détail d’au moins deux activités différentes (ex. une courte « Méditation », une longue « Respiration »).
4. Vérifier la cohérence du contenu affiché avec l’API ou la base.

**Résultat attendu**

- Affichage correct et stable ; pas d’erreur serveur visible côté utilisateur.

**Traçabilité test** : TC-FO-05

---

### FR-04 — Recherche et filtres sur les activités

| Champ | Contenu |
|--------|---------|
| **Priorité** | P1 |
| **Acteur** | Visiteur ou utilisateur connecté |
| **Objectif** | Restreindre la liste des activités selon plusieurs critères cumulables |

**Préconditions**

- Page `/activites` avec jeu seed.

**Scénario détaillé**

1. Saisir une recherche correspondant à une activité seed (ex. `méditation`).
2. Appliquer un filtre de **difficulté** (ex. Facile) et vérifier la liste.
3. Ajouter un filtre de **durée** (ex. 15 minutes) et vérifier la liste.
4. Combiner des critères **incompatibles** avec le jeu de données (ex. méditation + durée 60 min si aucune ligne ne correspond) et vérifier l’absence de résultat **sans** erreur technique.

**Résultat attendu**

- Cumul des filtres cohérent ; cas vide acceptable.

**Traçabilité test** : TC-FO-06

---

### FR-05 — Compte utilisateur : mise à jour du profil

| Champ | Contenu |
|--------|---------|
| **Priorité** | P1 |
| **Acteur** | Utilisateur connecté (rôle USER) |
| **Objectif** | Modifier ses informations personnelles en respect des validations |

**Préconditions**

- Session ouverte avec `user@cesizen.local`.

**Scénario détaillé — nominal**

1. Ouvrir la page profil ou paramètres (`/profil`, `/profil/parametre` selon l’UI).
2. Modifier le prénom et/ou le nom avec des valeurs valides.
3. Enregistrer.
4. Recharger la page ou se reconnecter et vérifier la persistance.

**Scénario détaillé — validations (erreurs métier)**

1. Soumettre des données **invalides** selon les règles du formulaire (champs vides obligatoires, format email invalide, etc.).
2. Vérifier un **message d’erreur** clair et l’**absence** de mise à jour silencieuse des données incorrectes.
3. Si l’écran « changement de mot de passe » existe : saisir un **mot de passe actuel incorrect** et un nouveau mot de passe valide ; vérifier le refus et le message adapté.

**Résultat attendu**

- Succès sur données valides ; échec contrôlé et explicite sur données invalides (API : `400` / `401` selon cas si vérification outillée).

**Traçabilité test** : TC-FO-07, TC-FO-08

---

### FR-06 — Favoris sur les activités

| Champ | Contenu |
|--------|---------|
| **Priorité** | P1 |
| **Acteur** | Utilisateur connecté |
| **Objectif** | Gérer une liste personnelle d’activités favorites |

**Préconditions**

- Session USER ; au moins une activité publiée visible.

**Scénario détaillé**

1. Depuis la liste ou le détail d’activité, **ajouter** une activité aux favoris.
2. Ouvrir l’endroit où la liste des favoris est affichée (profil ou équivalent) et vérifier la présence de l’activité.
3. **Retirer** le favori et vérifier la disparition de la liste.
4. (Optionnel) Tester un appel API avec payload invalide — réponse `400` conforme au contrat.

**Résultat attendu**

- Cycle ajout / consultation / suppression fonctionnel ; pas d’incohérence d’état côté UI après rafraîchissement.

**Traçabilité test** : TC-FO-09

---

### FR-07 — Non-visibilité des contenus non publiés (articles / activités)

| Champ | Contenu |
|--------|---------|
| **Priorité** | P2 |
| **Acteur** | Recetteur / admin |
| **Objectif** | Garantir que le grand public ne voit pas les contenus archivés ou brouillons |

**Préconditions**

- **P3 si seed seul** : préparer manuellement (ou via back-office) au moins un article et/ou une activité en statut **non publié**.
- Noter les identifiants ou titres pour contrôle.

**Scénario détaillé**

1. En tant qu’admin, confirmer le statut non publié de l’entité.
2. Se déconnecter ou utiliser un navigateur privé.
3. Ouvrir `/articles` et `/activites` ; vérifier que l’entité **n’apparaît pas** dans les listes.
4. Tenter l’accès direct par URL au détail si l’ID est connu : comportement attendu = refus, redirection ou 404 selon spécification produit.

**Résultat attendu**

- Aucune fuite de contenu non publié sur les parcours grand public.

**Traçabilité test** : TC-FO-10

---

## 9. Scénarios back-office

### BO-01 — Sécurisation de l’accès administrateur

| Champ | Contenu |
|--------|---------|
| **Priorité** | P1 |
| **Acteur** | Visiteur, utilisateur USER, administrateur |
| **Objectif** | N’autoriser le back-office qu’aux comptes ADMIN |

**Scénario détaillé**

1. **Non connecté** : accéder à `/admin/dashboard` → redirection vers la page de connexion ; l’URL de retour (`callbackUrl`) peut pointer vers le dashboard si implémenté.
2. **Connecté en USER** : accéder à `/admin/dashboard` → **refus** (redirection vers profil ou page d’erreur, selon produit).
3. **Connecté en ADMIN** : accès au dashboard et aux menus admin sans blocage injustifié.

**Résultat attendu**

- Cohérence avec la matrice des rôles ; API admin : `401` sans session, `403` avec session non admin.

**Traçabilité test** : TC-BO-01, TC-NG-02, TC-NG-03

---

### BO-02 — Gestion des utilisateurs (CRUD)

| Champ | Contenu |
|--------|---------|
| **Priorité** | P1 |
| **Acteur** | Administrateur |
| **Objectif** | Maintenir le référentiel utilisateurs |

**Préconditions**

- Session ADMIN ; page `/admin/users`.

**Scénario détaillé — nominal**

1. Afficher la liste des utilisateurs (présence des comptes seed).
2. **Créer** un utilisateur avec email unique, rôle et champs obligatoires valides.
3. **Modifier** cet utilisateur (ex. rôle, nom).
4. **Supprimer** (ou désactiver) cet utilisateur de test.

**Scénario détaillé — règle métier email dupliqué**

1. Tenter de créer un utilisateur avec un email **déjà** présent (ex. `user@cesizen.local`).
2. Vérifier le refus avec message adapté ; API : **`409`** (ou code documenté).

**Résultat attendu**

- Opérations CRUD cohérentes ; erreurs explicites ; journalisation audit si prévue par le produit.

**Traçabilité test** : TC-BO-02, TC-NG-01

---

### BO-03 — Gestion des articles (cycle de vie)

| Champ | Contenu |
|--------|---------|
| **Priorité** | P1 |
| **Acteur** | Administrateur |
| **Objectif** | Publier, modifier et retirer des articles du catalogue public |

**Préconditions**

- Session ADMIN ; accès `/admin/articles`, création `/admin/articles/new`, édition `/admin/articles/edit/[id]`.

**Scénario détaillé — nominal**

1. Lister les articles existants.
2. **Créer** un article minimal valide (titre, contenu, catégorie, statut publié si applicable).
3. Vérifier son apparition sur le **front** `/articles` si statut publié.
4. **Modifier** le titre ou le contenu ; vérifier la mise à jour côté front.
5. **Archiver** (ou passer en non publié) ; vérifier la **disparition** du front (aligné FR-07).
6. **Supprimer** si le produit le permet, ou laisser en archivé selon règle métier.

**Scénario détaillé — erreurs**

1. Soumettre une création avec champs invalides → **`400`**.
2. Demander une ressource inexistante (id inconnu) → **`404`**.

**Résultat attendu**

- Cycle de vie maîtrisé ; pas d’état incohérent liste admin / front.

**Traçabilité test** : TC-BO-03

---

### BO-04 — Gestion des activités (cycle de vie)

| Champ | Contenu |
|--------|---------|
| **Priorité** | P1 |
| **Acteur** | Administrateur |
| **Objectif** | Publier, modifier et retirer des activités du catalogue public |

**Préconditions**

- Session ADMIN ; `/admin/activities`, `new`, `edit/[id]`.

**Scénario détaillé**

- Reprendre la même structure que **BO-03** en remplaçant « article » par « activité » et les URLs front `/activites` et `/activites/[id]`.

**Résultat attendu**

- Même exigences de cohérence et codes **`400` / `404`** sur cas invalides.

**Traçabilité test** : TC-BO-04

---

## 10. Scénarios API (recette technique)

### API-01 — Ressources publiques articles et activités

| Champ | Contenu |
|--------|---------|
| **Priorité** | P1 |
| **Acteur** | Système / outil (curl, tests auto) |

**Scénario détaillé**

1. `GET /api/articles` sans authentification → **`200`** ; corps JSON listant uniquement les articles **publiés** ; champs attendus : identifiant, titre, description courte, catégorie, date, etc. (alignés DTO).
2. `GET /api/activities` sans authentification → **`200`** ; même logique pour activités publiées.

**Résultat attendu**

- Pas de données sensibles (mots de passe, tokens) dans la réponse.
- En cas d’erreur serveur base de données : **`500`** géré côté API (comportement documenté).

**Traçabilité test** : TC-API-01

---

### API-02 — Compte : profil

| Champ | Contenu |
|--------|---------|
| **Priorité** | P1 |

**Scénario détaillé**

1. Sans cookie de session : `GET /api/account/profile` → **`401`**.
2. Avec session USER valide : `GET /api/account/profile` → **`200`** ; corps conforme au modèle utilisateur exposé.
3. `PATCH` (ou `PUT` selon contrat) avec corps **invalide** → **`400`**.

**Traçabilité test** : TC-API-02

---

### API-03 — Compte : favoris activités

| Champ | Contenu |
|--------|---------|
| **Priorité** | P1 |

**Scénario détaillé**

1. Sans session : `GET` / `POST` / `DELETE` sur `/api/account/activity-favorites` (selon verbes supportés) → **`401`**.
2. Avec session : enchaînement nominal création / lecture / suppression conforme au contrat ; payload invalide → **`400`**.

**Traçabilité test** : TC-API-02

---

### API-04 — Routes administration

| Champ | Contenu |
|--------|---------|
| **Priorité** | P1 |

**Scénario détaillé**

1. Sans session : appel `GET` ou `POST` sur une route `/api/admin/...` → **`401`**.
2. Session **USER** : même appel → **`403`**.
3. Session **ADMIN** : appel autorisé sur la ressource concernée → **`200`** / **`201`** selon opération.

**Scénario complémentaire — suppression / identifiant**

1. `DELETE` (ou équivalent) sans identifiant ou avec identifiant mal formé → **`400`** ou **`404`** selon spécification.

**Traçabilité test** : TC-NG-02, TC-NG-03, TC-NG-04

---

## 11. Suivi des anomalies (modèle)

Pour chaque anomalie ouverte pendant la recette :

| Champ | Description |
|--------|-------------|
| ID | Identifiant unique (ex. REC-2026-001) |
| Date | Date de constat |
| Scénario | ID FR / BO / API concerné |
| Environnement | local / préprod / prod |
| Étapes de reproduction | Liste numérotée |
| Attendu / Obtenu | |
| Sévérité | Bloquante, Critique, Majeure, Mineure |
| Statut | Ouverte, Corrigée, Retest, Clôturée |
| Responsable correction | |

---

## 12. Matrice de traçabilité recette → tests

| ID recette | Intitulé court | Fiches test (`cahier-test.md`) |
|------------|----------------|--------------------------------|
| FR-01 | Articles liste / détail | TC-FO-01 |
| FR-02 | Articles recherche / filtres | TC-FO-02, TC-FO-03, TC-FO-04 |
| FR-03 | Activités liste / détail | TC-FO-05 |
| FR-04 | Activités recherche / filtres | TC-FO-06 |
| FR-05 | Profil utilisateur | TC-FO-07, TC-FO-08 |
| FR-06 | Favoris | TC-FO-09 |
| FR-07 | Contenus non publiés | TC-FO-10 |
| BO-01 | Accès admin | TC-BO-01 |
| BO-02 | CRUD utilisateurs | TC-BO-02 |
| BO-03 | Cycle de vie articles | TC-BO-03 |
| BO-04 | Cycle de vie activités | TC-BO-04 |
| API-01 à API-04 | Contrats API | TC-API-01, TC-API-02, TC-NG-* |

---

*Document à versionner avec le projet. Mettre à jour les priorités et le périmètre si le backlog évolue.*
