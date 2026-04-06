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

async function main() {
  console.log("🌱 Seeding...");

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

  const articleId = "6c479710-ef5b-44a4-a8f9-7079f952af7a";
  await prisma.article.upsert({
    where: { id: articleId },
    update: {},
    create: {
      id: articleId,
      title: "5 exercices simples pour apaiser le stress",
      description: "Des pratiques rapides pour retrouver le calme au quotidien.",
      content:
        "Respiration profonde, pause consciente, marche courte et relaxation musculaire peuvent aider a diminuer la tension mentale. Pratique ces exercices 10 minutes par jour pour observer une amelioration progressive.",
      tag: "bien-etre",
      date: new Date("2026-04-06"),
      status: StatusType.PUBLISHED,
      author: "Dr. Sophie Martin",
    },
  });

  const activityId = "d28d8f3e-f0b3-4fb8-8f3e-15f12e6c3f21";
  await prisma.activity.upsert({
    where: { id: activityId },
    update: {},
    create: {
      id: activityId,
      title: "Session de respiration 4-7-8",
      description: "Un exercice guide pour calmer rapidement le systeme nerveux.",
      content:
        "Inspire pendant 4 secondes, retiens 7 secondes, puis expire lentement pendant 8 secondes. Repete le cycle 4 fois dans un endroit calme.",
      tag: "relaxation",
      difficulty: DifficultyLevel.EASY,
      duration: ActivityDuration.MIN_15,
      date: new Date("2026-04-06"),
      status: StatusType.PUBLISHED,
      author: "Camille Bernard",
    },
  });

  console.log("✅ User créé ou déjà existant :", email);
  console.log("✅ Deuxième user créé ou déjà existant :", secondEmail);
  console.log("✅ Article créé ou déjà existant :", articleId);
  console.log("✅ Activité créée ou déjà existante :", activityId);
  console.log("🎉 Seed terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
