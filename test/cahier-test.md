# Cahier de test — CESIZen

## 1. Informations générales

| Champ | Valeur |
|--------|--------|
| Projet | CESIZen |
| Version testée | (à renseigner) |
| Date de campagne | |
| Testeur | |
| Environnement | local / préprod |
| Branche / commit | |

**Déroulement** : suivre [`procedure-validation.md`](./procedure-validation.md). Après la campagne, compléter le [`modele-pv-recette.md`](./modele-pv-recette.md).

## 2. Légende de statut

- **OK** : test réussi  
- **KO** : test échoué  
- **BLOQUE** : non exécutable (prérequis manquant)  
- **N/A** : hors périmètre ou donnée absente (ex. contenu archivé non seedé)

## 3. Prérequis techniques

- Application démarrée : `npm run dev`
- Base PostgreSQL accessible, `DATABASE_URL` renseigné
- Seed exécuté : `npx prisma db seed` (ou équivalent du projet)
- Navigateur récent, cookies autorisés pour la session

## 4. Jeu de comptes (seed `prisma/seed.ts`)

> Mots de passe réservés au **développement local** — ne pas utiliser en production.

| Rôle | Email | Mot de passe |
|------|--------|---------------|
| ADMIN | `admin@cesizen.local` | `Admin123!` |
| USER | `user@cesizen.local` | `User123!` |

## 5. Données de référence après seed

- **Articles** : **6** publiés (`articleSeeds` dans `prisma/seed.ts`), une catégorie métier distincte par article. La recherche porte sur **titre + libellé de catégorie** (ex. `nutrition`, `santé`, `émotions` ; le mot « méditation » n’apparaît pas dans les titres articles du seed).
- **Activités** : **5** publiées (`activitySeeds`), une par catégorie affichée côté front (**Méditation**, **Respiration**, **Musique**, **Exercice**, **Relaxation**), durées **15 / 30 / 45 / 60** min et difficultés variées selon le seed.
- **Contenus archivés** : le seed actuel ne crée **pas** d’article ni d’activité archivés. Les TC associés sont en **N/A** sauf préparation manuelle en base.

## 6. Correspondance avec le cahier de recette

Scénarios détaillés et critères d’entrée/sortie : voir [`cahier-recette.md`](./cahier-recette.md) (matrice §12).

| ID test | Réf. recette |
|---------|----------------|
| TC-FO-* | FR-01 à FR-07 |
| TC-AUTH-* | Authentification (complément au périmètre recette) |
| TC-BO-* | BO-01 à BO-04 ; TC-BO-05/06 complément admin |
| TC-NG-* | API-04 / validations |
| TC-API-* | API-01 à API-03 |
| TC-PREV-* | Prévisualisation interne (optionnel) |

---

## 7. Campagne — Front-office

### TC-FO-01 — Liste et détail article

- **Réf.** : FR-01  
- **Préconditions** : seed exécuté ; visiteur connecté ou non.  
- **Étapes** :
  1. Ouvrir `/articles`.
  2. Vérifier l’affichage d’au moins plusieurs cartes.
  3. Ouvrir le détail d’un article (clic sur une carte).
- **Résultat attendu** : liste cohérente, page détail sans erreur, contenu lisible.  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

### TC-FO-02 — Recherche article (titre / catégorie)

- **Réf.** : FR-02  
- **Préconditions** : page `/articles`.  
- **Étapes** :
  1. Saisir `nutrition` dans la recherche (mot présent dans un titre et une catégorie).
  2. Vérifier que seuls les articles correspondants restent visibles (ou liste filtrée cohérente).
  3. Effacer la recherche (bouton clear si présent).
- **Résultat attendu** : filtrage côté liste sans crash ; état vide géré proprement si aucun match.  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

### TC-FO-03 — Filtre catégorie article

- **Réf.** : FR-02  
- **Préconditions** : `/articles`.  
- **Étapes** :
  1. Sélectionner la catégorie **Nutrition** (ou autre catégorie du jeu seed).
  2. Vérifier que tous les articles affichés appartiennent à cette catégorie.
- **Résultat attendu** : filtre correct ; message adapté si 0 résultat.  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

### TC-FO-04 — Recherche + catégorie combinés (articles)

- **Réf.** : FR-02  
- **Préconditions** : `/articles`.  
- **Étapes** :
  1. Choisir une catégorie (ex. **Santé Mentale**).
  2. Saisir un terme contenu dans le titre d’un article de cette catégorie uniquement (ex. `émotions` pour l’article santé mentale du seed).
  3. Vérifier la cohérence des résultats.
  4. Saisir un terme qui ne correspond à aucun article **de cette catégorie** (ex. même catégorie + `nutrition`).
- **Résultat attendu** : intersection recherche × catégorie correcte ; 0 résultat sans erreur UI.  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

### TC-FO-05 — Liste et détail activité

- **Réf.** : FR-03  
- **Préconditions** : seed exécuté.  
- **Étapes** :
  1. Ouvrir `/activites`.
  2. Contrôler cartes (catégorie, difficulté, durée).
  3. Ouvrir le détail d’une activité.
- **Résultat attendu** : données alignées avec l’API ; pas d’erreur.  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

### TC-FO-06 — Recherche et filtres activités

- **Réf.** : FR-04  
- **Préconditions** : `/activites` ; activités variées seedées.  
- **Étapes** :
  1. Rechercher `méditation` (titre seed « Méditation — Pleine Présence »).
  2. Ajouter un filtre **difficulté** (ex. Facile).
  3. Ajouter un filtre **durée** (ex. 15 minutes).
  4. Combiner des critères **incompatibles** (ex. méditation + durée 60 min si aucune activité ne correspond).
- **Résultat attendu** : filtres cumulés cohérents ; 0 résultat acceptable sans crash.  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

### TC-FO-07 — Profil : mise à jour nominale

- **Réf.** : FR-05  
- **Préconditions** : connecté en **USER** (`user@cesizen.local`).  
- **Étapes** :
  1. Ouvrir `/profil` ou `/profil/parametre` (selon UI).
  2. Modifier prénom et/ou nom avec des valeurs valides.
  3. Enregistrer.
- **Résultat attendu** : sauvegarde réussie ; affichage mis à jour après rechargement si nécessaire.  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

### TC-FO-08 — Profil : validations négatives

- **Réf.** : FR-05  
- **Préconditions** : connecté en USER.  
- **Étapes** :
  1. Soumettre un formulaire profil avec champs invalides (selon règles UI/API : email invalide, champs requis vides, etc.).
  2. Tenter un changement de mot de passe avec **mot de passe actuel incorrect** (si l’écran existe).
- **Résultat attendu** : message d’erreur clair ; pas de mise à jour silencieuse ; statuts HTTP attendus si test outillé (`400` / `401` selon cas).  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

### TC-FO-09 — Favoris activités

- **Réf.** : FR-06  
- **Préconditions** : connecté en USER.  
- **Étapes** :
  1. Ajouter une activité aux favoris (depuis liste ou détail, selon produit).
  2. Vérifier la liste des favoris (page profil ou endpoint équivalent).
  3. Retirer le favori.
- **Résultat attendu** : ajout / liste / suppression fonctionnels ; pas d’erreur sur payload invalide côté API si testé (`400`).  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

### TC-FO-10 — Visibilité contenus non publiés (archivés)

- **Réf.** : périmètre recette (jeux de données)  
- **Préconditions** : **N/A** avec seed actuel ; exécuter seulement après création manuelle d’un article et/ou activité en statut **non publié**.  
- **Étapes** :
  1. En base ou via admin, archiver une entité connue.
  2. Vérifier qu’elle **n’apparaît pas** sur `/articles` ou `/activites` (comportement attendu : uniquement publiés).
- **Résultat attendu** : pas d’exposition front des brouillons / archivés.  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

### TC-FO-11 — Page d’accueil

- **Réf.** : *(smoke — navigation générale)*  
- **Préconditions** : application démarrée.  
- **Étapes** :
  1. Ouvrir `/`.
  2. Vérifier l’absence d’erreur ; présence des liens ou blocs vers Articles / Activités (ou équivalent).
- **Résultat attendu** : page utilisable ; pas de régression d’affichage critique.  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

### TC-FO-12 — Liste articles : URL partageable (recherche + catégorie)

- **Réf.** : FR-02  
- **Préconditions** : `/articles`.  
- **Étapes** :
  1. Appliquer une recherche et un filtre catégorie via l’UI.
  2. Noter l’URL (paramètres `q` / `category` selon implémentation).
  3. Copier l’URL dans un nouvel onglet ou rafraîchir la page (F5).
- **Résultat attendu** : mêmes critères appliqués après rechargement ; liste cohérente.  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

---

## 8. Authentification

### TC-AUTH-01 — Connexion nominale

- **Réf.** : *(prérequis BO-01 / parcours utilisateur)*  
- **Préconditions** : déconnecté.  
- **Étapes** :
  1. Ouvrir `/auth/login`.
  2. Saisir `user@cesizen.local` / `User123!`, valider.
  3. Vérifier la redirection vers une page authentifiée (profil, accueil ou `callbackUrl` si présent dans l’URL).
- **Résultat attendu** : session active ; accès à `/profil` sans redirection login.  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

### TC-AUTH-02 — Connexion identifiants invalides

- **Réf.** : *(sécurité / UX)*  
- **Préconditions** : déconnecté.  
- **Étapes** :
  1. Ouvrir `/auth/login`.
  2. Saisir un email existant avec un **mauvais** mot de passe (ou un email inexistant).
- **Résultat attendu** : échec de connexion ; message utilisateur clair ; **pas** de création de session.  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

### TC-AUTH-03 — Inscription nominale

- **Réf.** : *(onboarding)*  
- **Préconditions** : email **non** présent en base (créer une adresse de test du type `recette+<timestamp>@example.com` si besoin).  
- **Étapes** :
  1. Ouvrir `/auth/register`.
  2. Remplir le formulaire avec des données valides conformes aux règles affichées.
  3. Valider et vérifier connexion automatique ou invitation à se connecter.
- **Résultat attendu** : compte créé ; possibilité de se connecter avec ce compte.  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

### TC-AUTH-04 — Inscription : email déjà utilisé

- **Réf.** : *(règle métier)*  
- **Préconditions** : déconnecté.  
- **Étapes** :
  1. Ouvrir `/auth/register`.
  2. Soumettre avec l’email `user@cesizen.local` (ou tout email seed) et un mot de passe valide.
- **Résultat attendu** : refus avec message explicite ; pas de doublon silencieux (API souvent **409** si test outillé).  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

### TC-AUTH-05 — Déconnexion

- **Réf.** : *(session)*  
- **Préconditions** : connecté en USER ou ADMIN.  
- **Étapes** :
  1. Utiliser le contrôle « déconnexion » ou équivalent dans l’UI.
  2. Tenter d’ouvrir `/profil` ou `/admin/dashboard`.
- **Résultat attendu** : plus de session ; redirection login ou accès refusé selon route.  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

### TC-AUTH-06 — Compte ADMIN : lien vers le back-office

- **Réf.** : BO-01 (cohérence UI)  
- **Préconditions** : connecté en `admin@cesizen.local`.  
- **Étapes** :
  1. Ouvrir `/profil` (ou menu utilisateur).
  2. Vérifier la présence d’un accès au back-office si prévu par le produit ; l’utiliser.
  3. Se connecter en **USER** et vérifier l’**absence** de ce raccourci (ou son inaccessibilité).
- **Résultat attendu** : pas d’exposition du lien admin aux simples utilisateurs.  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

---

## 9. Campagne — Back-office (admin)

### TC-BO-01 — Contrôle d’accès

- **Réf.** : BO-01  
- **Préconditions** : comptes ADMIN et USER.  
- **Étapes** :
  1. Non connecté : tenter `/admin/dashboard` → redirection vers login (`callbackUrl` cohérent si présent).
  2. Connecté en USER : tenter `/admin/dashboard` → refus ou redirection (pas d’accès admin).
  3. Connecté en ADMIN : accès au dashboard.
- **Résultat attendu** : conforme à la politique (401/403 côté API admin si test outillé).  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

### TC-BO-02 — Utilisateurs : liste, création, modification, suppression

- **Réf.** : BO-02  
- **Préconditions** : ADMIN connecté ; URL `/admin/users`.  
- **Étapes** :
  1. Lister les utilisateurs.
  2. Créer un utilisateur de test (email unique).
  3. Modifier rôle ou statut si disponible.
  4. Supprimer l’utilisateur de test (ou désactiver selon produit).
  5. Cas invalide : création avec email déjà utilisé → **409** (voir TC-NG-01).
- **Résultat attendu** : opérations alignées avec l’API ; erreurs métier propres.  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

### TC-BO-03 — Articles : liste, création, édition, archivage, suppression

- **Réf.** : BO-03  
- **Préconditions** : ADMIN ; `/admin/articles`, `/admin/articles/new`, `/admin/articles/edit/[id]`.  
- **Étapes** :
  1. Lister les articles.
  2. Créer un article minimal valide (titre, contenu, catégorie, etc.).
  3. Éditer cet article.
  4. Archiver (ou changer statut vers non publié) puis vérifier le front (TC-FO-10 si applicable).
  5. Supprimer ou gérer le cycle de vie selon règles métier.
  6. Cas invalides : payload incomplet → **400** ; ID inconnu → **404**.
- **Résultat attendu** : CRUD cohérent ; audits / logs si prévus.  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

### TC-BO-04 — Activités : liste, création, édition, archivage, suppression

- **Réf.** : BO-04  
- **Préconditions** : ADMIN ; `/admin/activities`, routes `new` / `edit/[id]`.  
- **Étapes** : (même logique que TC-BO-03 pour le domaine activités).  
- **Résultat attendu** : CRUD cohérent ; erreurs **400** / **404** testées.  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

### TC-BO-05 — Dashboard : indicateurs

- **Réf.** : *(synthèse admin — complément)*  
- **Préconditions** : ADMIN connecté.  
- **Étapes** :
  1. Ouvrir `/admin/dashboard`.
  2. Vérifier l’affichage des compteurs ou graphiques sans erreur.
  3. (Optionnel) Comparer grossièrement avec le nombre d’entités seed (utilisateurs, articles, activités) si les métriques sont exposées.
- **Résultat attendu** : page stable ; `GET /api/admin/dashboard/stats` en **200** si appelé depuis l’UI authentifiée admin.  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

### TC-BO-06 — Journaux d’audit (users / articles / activités)

- **Réf.** : *(traçabilité admin)*  
- **Préconditions** : ADMIN connecté.  
- **Étapes** :
  1. Ouvrir `/admin/users/logs`, `/admin/articles/logs`, `/admin/activities/logs` (selon navigation du produit).
  2. Vérifier le chargement sans erreur et la lisibilité des entrées (après seed, des lignes peuvent mentionner la création seed).
- **Résultat attendu** : listes ou tableaux consultables ; pas d’erreur 500 visible.  
- **Résultat obtenu** :  
- **Statut** :  
- **Commentaire** :  

---

## 10. Cas négatifs — API (manuel ou outil type curl / REST Client)

### TC-NG-01 — Création utilisateur : email dupliqué

- **Étapes** : `POST` admin users avec un email déjà présent (ex. `user@cesizen.local`).  
- **Résultat attendu** : **409** (ou code métier documenté).  
- **Résultat obtenu** :  
- **Statut** :  

### TC-NG-02 — Route admin sans session

- **Étapes** : appeler une route `GET` ou `POST` sous `/api/admin/*` sans cookie de session.  
- **Résultat attendu** : **401**.  
- **Résultat obtenu** :  
- **Statut** :  

### TC-NG-03 — Route admin en tant que USER

- **Étapes** : session **USER** ; appeler `/api/admin/...`.  
- **Résultat attendu** : **403**.  
- **Résultat obtenu** :  
- **Statut** :  

### TC-NG-04 — Suppression admin : identifiant manquant ou invalide

- **Étapes** : `DELETE` (ou équivalent) sans id ou avec id mal formé selon contrat API.  
- **Résultat attendu** : **400** ou **404** selon spécification.  
- **Résultat obtenu** :  
- **Statut** :  

### TC-NG-05 — Favoris : `activityId` manquant ou activité inexistante

- **Préconditions** : session USER valide.  
- **Étapes** :
  1. `POST /api/account/activity-favorites` avec corps `{}` ou sans `activityId` → **400**.
  2. `POST` avec un UUID valide mais **sans** activité publiée correspondante → **404** (comportement attendu du route handler).
- **Résultat attendu** : codes ci-dessus ; message JSON explicite si prévu.  
- **Résultat obtenu** :  
- **Statut** :  

### TC-API-01 — Ressources publiques

- **Étapes** : `GET /api/articles`, `GET /api/activities`.  
- **Résultat attendu** : **200** ; JSON avec champs attendus (catégorie, dates, `smallDescription` ou équivalent DTO).  
- **Résultat obtenu** :  
- **Statut** :  

### TC-API-02 — Compte : profil et favoris

- **Étapes** :
  1. Sans session : `GET /api/account/profile` → **401**.
  2. Avec session : `GET /api/account/profile` → **200**.
  3. `PATCH` profil avec body invalide → **400**.
  4. Favoris : `GET` / `POST` / `DELETE` selon contrat ; non connecté → **401**.  
- **Résultat attendu** : aligné avec §8 du cahier de recette.  
- **Résultat obtenu** :  
- **Statut** :  

---

## 11. Bilan de campagne

| Indicateur | Valeur |
|------------|--------|
| Total TC exécutés | |
| OK | |
| KO | |
| BLOQUE / N/A | |
| Taux de réussite (OK / exécutés) | |

**Synthèse** :  

---

## 12. Anomalies

Pour chaque anomalie, compléter : id, date, module, reproduction, attendu / obtenu, sévérité, statut.

| ID | Résumé | Sévérité | Statut |
|----|--------|----------|--------|
| ANO-001 | | | |
| ANO-002 | | | |

---

## 13. Prévisualisation interne (optionnel)

À n’exécuter que si le périmètre inclut les routes `/preview/*` (souvent réservées au développement ou à un rôle précis).

### TC-PREV-01 — Parcours preview activités

- **Étapes** : ouvrir `/preview/activities/new`, `/preview/activities/[id]`, `/preview/activities/edit` selon les besoins ; vérifier l’absence d’erreur bloquante ou documenter l’accès refusé attendu.
- **Résultat attendu** : comportement conforme à la politique produit (public, auth, ou désactivé hors dev).  
- **Résultat obtenu** :  
- **Statut** :  

---

*Document généré pour le dépôt CESIZen — à mettre à jour si le seed ou les routes évoluent.*
