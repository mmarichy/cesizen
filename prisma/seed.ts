import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

import { PrismaClient, Role } from "../src/app/generated/prisma";

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

  console.log("✅ User créé ou déjà existant :", email);
  console.log("✅ Deuxième user créé ou déjà existant :", secondEmail);
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
