import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

import {
  ActivityDuration,
  DifficultyLevel,
  PrismaClient,
  Role,
  StatusType,
} from "../src/app/generated/prisma";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

/** Un tag par catégorie article (voir `ARTICLE_CATEGORY_DEFINITIONS`). */
const articleSeeds = [
  {
    id: "6c479710-ef5b-44a4-a8f9-7079f952af7a",
    tag: "sante-mentale",
    title: "Comprendre l'anxiete au quotidien",
    description:
      "Repérer les signes courants et les leviers simples pour mieux s'apaiser.",
    content:
      "L'anxiete peut se manifester par des tensions, des pensées en boucle ou de la fatigue. Noter ses declencheurs, pratiquer une respiration lente et structurer sa journee aident souvent a retrouver un meilleur equilibre. En cas de gene importante, un professionnel peut vous accompagner.",
    date: new Date("2026-04-06"),
    author: "Dr. Sophie Martin",
  },
  {
    id: "89ea88df-8f68-47df-b0df-4d090ca45864",
    tag: "bien-etre",
    title: "5 exercices simples pour apaiser le stress",
    description: "Des pratiques rapides pour retrouver le calme au quotidien.",
    content:
      "Respiration profonde, pause consciente, marche courte et relaxation musculaire peuvent aider a diminuer la tension mentale. Pratique ces exercices 10 minutes par jour pour observer une amelioration progressive.",
    date: new Date("2026-04-07"),
    author: "Dr. Sophie Martin",
  },
  {
    id: "28154e16-4207-4cf6-9f34-56d8af8b80ca",
    tag: "therapies",
    title: "Les TCC : agir sur les pensées et les comportements",
    description:
      "Presentation courte de la therapie cognitive et comportementale.",
    content:
      "Les TCC visent a identifier les schemas de pensee rigides et a tester des comportements plus adaptés. Elles sont souvent utilisees pour l'anxiete et la depression, avec des seances structurees et des exercices entre les rendez-vous.",
    date: new Date("2026-04-08"),
    author: "Dr. Marc Legrand",
  },
  {
    id: "a1b2c3d4-e5f6-4789-a012-3456789abcde",
    tag: "activite-physique",
    title: "Marche active : un levier pour le moral",
    description:
      "Pourquoi une marche reguliere soutient l'humeur et l'energie.",
    content:
      "Une marche a allure moderee, plusieurs fois par semaine, favorise la liberation de neurotransmetteurs lies au bien-etre. Commence par de courtes seances et augmente progressivement la duree selon votre forme.",
    date: new Date("2026-04-09"),
    author: "Camille Bernard",
  },
  {
    id: "b2c3d4e5-f6a7-4890-b123-456789abcdef",
    tag: "nutrition",
    title: "Nutrition douce pour garder l'energie",
    description:
      "Des conseils pratiques pour mieux equilibrer les repas du quotidien.",
    content:
      "Compose ton assiette avec des legumes varies, une portion de proteines et des feculents complets. Pense aussi a bien t'hydrater pendant la journee pour soutenir la concentration et la vitalite.",
    date: new Date("2026-04-10"),
    author: "Claire Dubois",
  },
  {
    id: "c3d4e5f6-a7b8-4901-c234-567890abcdef",
    tag: "developpement-personnel",
    title: "Objectifs clairs, petits pas durables",
    description:
      "Decouper ses projets pour avancer sans se decourager.",
    content:
      "Formule des objectifs mesurables et atteignables sur quelques semaines. Valorise les progres intermediaires et ajuste le cap si besoin : la regularite compte plus que l'intensite ponctuelle.",
    date: new Date("2026-04-11"),
    author: "Julie Petit",
  },
] as const;

/** Une activite par categorie affichee dans le front (lib/activities.ts). */
const activitySeeds = [
  {
    id: "d28d8f3e-f0b3-4fb8-8f3e-15f12e6c3f21",
    tag: "meditation",
    title: "Meditation guidee — ancrage sur la respiration",
    description:
      "Dix minutes pour poser l'attention sur le souffle et relacher les tensions.",
    content:
      "Assieds-toi confortablement, ferme les yeux si tu le souhaites. Suis le passage de l'air au nez ou au ventre sans chercher a modifier le rythme. Lorsque l'esprit s'egare, ramene doucement l'attention au souffle.",
    difficulty: DifficultyLevel.EASY,
    duration: ActivityDuration.MIN_15,
    date: new Date("2026-04-06"),
    author: "Camille Bernard",
  },
  {
    id: "6c2439d5-8f85-4f8f-87d9-f2adfcd853ec",
    tag: "respiration",
    title: "Session de respiration 4-7-8",
    description: "Un exercice guide pour calmer rapidement le systeme nerveux.",
    content:
      "Inspire pendant 4 secondes, retiens 7 secondes, puis expire lentement pendant 8 secondes. Repete le cycle 4 fois dans un endroit calme.",
    difficulty: DifficultyLevel.EASY,
    duration: ActivityDuration.MIN_15,
    date: new Date("2026-04-07"),
    author: "Camille Bernard",
  },
  {
    id: "e4f5a6b7-c8d9-4e0f-a345-678901234567",
    tag: "musique",
    title: "Ambiance douce — sons legers et rythme lent",
    description:
      "Une ecoute courte pour reduire le bruit mental et favoriser la detente.",
    content:
      "Choisis un morceau instrumental calme, regle un volume modere. Ferme les yeux une minute, puis laisse la musique accompagner la respiration sans viser une quelconque performance.",
    difficulty: DifficultyLevel.EASY,
    duration: ActivityDuration.MIN_30,
    date: new Date("2026-04-08"),
    author: "Nora Petit",
  },
  {
    id: "56fa2ef0-0de8-4f67-b32d-c750ad6f6468",
    tag: "exercice",
    title: "Renforcement articulaire a domicile",
    description:
      "Une seance guidee pour renforcer les articulations en toute securite.",
    content:
      "Enchaine des mouvements lents pour les chevilles, genoux, hanches et epaules. Utilise une chaise pour garder l'equilibre et adapte l'amplitude selon ton confort.",
    difficulty: DifficultyLevel.MEDIUM,
    duration: ActivityDuration.MIN_45,
    date: new Date("2026-04-09"),
    author: "Nora Petit",
  },
  {
    id: "f5a6b7c8-d9e0-41f2-b456-789012345678",
    tag: "relaxation",
    title: "Marche douce en pleine conscience",
    description:
      "Une marche de 30 minutes pour relacher les tensions et bouger en douceur.",
    content:
      "Marche a un rythme confortable, concentre-toi sur la respiration et sur les sensations des pas. Prends quelques pauses courtes pour etirer le dos et les epaules.",
    difficulty: DifficultyLevel.EASY,
    duration: ActivityDuration.MIN_30,
    date: new Date("2026-04-10"),
    author: "Camille Bernard",
  },
] as const;

async function main() {
  console.log("Seeding...");

  const email = "admin@cesizen.local";
  const plainPassword = "Admin123!";

  const hashedPassword = await bcrypt.hash(plainPassword, 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      firstname: "Admin",
      lastname: "Cesizen",
      phone: "+33612345678",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const secondEmail = "user@cesizen.local";
  const secondPlainPassword = "User123!";
  const secondHashedPassword = await bcrypt.hash(secondPlainPassword, 12);

  await prisma.user.upsert({
    where: { email: secondEmail },
    update: {},
    create: {
      email: secondEmail,
      firstname: "User",
      lastname: "Cesizen",
      phone: "+33698765432",
      password: secondHashedPassword,
      role: Role.USER,
    },
  });

  for (const article of articleSeeds) {
    await prisma.article.upsert({
      where: { id: article.id },
      update: {
        title: article.title,
        description: article.description,
        content: article.content,
        tag: article.tag,
        date: article.date,
        status: StatusType.PUBLISHED,
        author: article.author,
      },
      create: {
        id: article.id,
        title: article.title,
        description: article.description,
        content: article.content,
        tag: article.tag,
        date: article.date,
        status: StatusType.PUBLISHED,
        author: article.author,
      },
    });
  }

  for (const activity of activitySeeds) {
    await prisma.activity.upsert({
      where: { id: activity.id },
      update: {
        title: activity.title,
        description: activity.description,
        content: activity.content,
        tag: activity.tag,
        difficulty: activity.difficulty,
        duration: activity.duration,
        date: activity.date,
        status: StatusType.PUBLISHED,
        author: activity.author,
      },
      create: {
        id: activity.id,
        title: activity.title,
        description: activity.description,
        content: activity.content,
        tag: activity.tag,
        difficulty: activity.difficulty,
        duration: activity.duration,
        date: activity.date,
        status: StatusType.PUBLISHED,
        author: activity.author,
      },
    });
  }

  console.log("Utilisateur admin créé ou déjà existant :", email);
  console.log("Deuxième utilisateur créé ou déjà existant :", secondEmail);
  console.log(`${articleSeeds.length} articles (une catégorie chacun)`);
  console.log(`${activitySeeds.length} activités (une catégorie chacune)`);
  console.log("Seed terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
