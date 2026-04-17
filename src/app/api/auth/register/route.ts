import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { formatFirstname, formatLastname } from "@/lib/format-person-name";
import { isValidFrenchPhone, normalizeFrenchPhone } from "@/lib/normalize-phone";
import { prisma } from "@/lib/prisma";

const MIN_PASSWORD = 8;

type Body = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const confirmPassword = body.confirmPassword;
    const firstNameRaw = body.firstName?.trim() ?? "";
    const lastNameRaw = body.lastName?.trim() ?? "";
    const firstName = formatFirstname(firstNameRaw);
    const lastName = formatLastname(lastNameRaw);
    const phone = normalizeFrenchPhone(body.phone);

    if (!email || !password || !firstNameRaw || !lastNameRaw) {
      return NextResponse.json({ error: "Tous les champs obligatoires doivent être remplis." }, { status: 400 });
    }

    if (!isValidFrenchPhone(phone)) {
      return NextResponse.json(
        { error: "Le numéro de téléphone doit être au format français valide (+33XXXXXXXXX)." },
        { status: 400 },
      );
    }

    if (password.length < MIN_PASSWORD) {
      return NextResponse.json(
        { error: `Le mot de passe doit contenir au moins ${MIN_PASSWORD} caractères.` },
        { status: 400 },
      );
    }
    // Vérifie la présence d'au moins une majuscule
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins une lettre majuscule." },
        { status: 400 },
      );
    }
    // Vérifie la présence d'au moins un caractère spécial
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=~`’€£§]/.test(password)) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins un caractère spécial." },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Les mots de passe ne correspondent pas." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        email,
        firstname: firstName,
        lastname: lastName,
        phone,
        password: hashed,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[register]", e);
    return NextResponse.json({ error: "Impossible de créer le compte pour le moment." }, { status: 500 });
  }
}
