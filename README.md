# CESIZen

Application de gestion du stress et de la santé mentale développée pour le Ministère de la Santé dans le cadre du titre Concepteur Développeur d'Applications (CDA) à CESI Dijon.

## 🎯 Objectifs du projet

- Proposer des articles sur la santé mentale
- Offrir un catalogue d'activités de détente personnalisables

## 🛠 Stack Technique

- **Framework** : Next.js 16
- **Langage** : TypeScript
- **Styling** : Tailwind CSS, MUI
- **Base de données** : PostgreSQL (+ Prisma ORM)
- **Authentification** : NextAuth.js
- **Tests** : Vitest
- **Versioning** : GitHub

## 📦 Installation

### Prérequis

- **Node.js** 20+ (recommandé pour Next.js 16)
- **npm** (ou pnpm / yarn)
- **PostgreSQL** : instance locale, distante, ou celle fournie par Docker (voir ci-dessous)
- **Docker** + plugin Compose (optionnel mais pratique pour lancer Postgres localement)

### Étapes

```bash
# Cloner le repo
git clone https://github.com/mmarichy/cesizen.git
cd cesizen

# Installer les dépendances
npm install

Variables d’environnement : le CLI Prisma charge un fichier **`.env`** à la racine (`prisma.config.ts`). Copie le modèle puis adapte les valeurs.

```bash
# Unix / Git Bash
cp .env.example .env

# Windows PowerShell
# Copy-Item .env.example .env
```

À renseigner dans `.env` :

- **`DATABASE_URL`** : chaîne PostgreSQL. Avec le `docker-compose.yml` du projet (utilisateur / mot de passe / base `cesizen`), en local :

  `postgresql://cesizen:cesizen123@localhost:5432/cesizen`

- **`NEXTAUTH_SECRET`** : secret fort (ex. `openssl rand -base64 32` sous Git Bash ou WSL)
- **`NEXTAUTH_URL`** : en dev, `http://localhost:3000`

Démarrer Postgres avec Docker (dans un autre terminal si tu veux garder les logs) :

```bash
docker compose up -d
# variante plus ancienne : docker-compose up -d
```

Puis schéma et données :

```bash
# Migrations + client Prisma (sortie client : src/app/generated/prisma)
npx prisma migrate dev

# Génere le client prisma
npx prisma generate

# Données de démo (voir prisma.config.ts → seed)
npx prisma db seed

npm run dev
```

L’application écoute par défaut sur **http://localhost:3000**.

### Commandes utiles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur Next.js en mode développement |
| `npm run build` / `npm start` | Build et serveur de production |
| `npm run lint` | ESLint |
| `npm test` | Vitest (une passe) |
| `npm run test:watch` | Vitest en mode watch |
| `npm run db:migrate` | Équivalent raccourci de `prisma migrate dev` |
| `npm run db:generate` | Régénère uniquement le client Prisma |
| `npm run db:studio` | Interface Prisma Studio sur la base |
| `npm run dev:reset` | Regénère le client, reset DB + migrations + seed + `dev` (destructif) |
