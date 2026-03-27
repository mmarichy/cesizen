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
- **Versioning** : GitHub

## 📦 Installation

### Prérequis

- Node.js 18+ 
- npm / pnpm / yarn
- PostgreSQL (local ou distant)

### Étapes

```bash
# Cloner le repo
git clone https://github.com/mmarichy/cesizen.git
cd cesizen

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec tes credentials

# Lancer le serveur de dev
npm run dev
