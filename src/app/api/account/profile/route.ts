import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth/next";
import { formatFirstname, formatLastname } from "@/lib/format-person-name";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

const MIN_PASSWORD = 8;

function validateNewPassword(password: string): string | null {
  if (password.length < MIN_PASSWORD) {
    return `Le mot de passe doit contenir au moins ${MIN_PASSWORD} caractères.`;
  }
  if (!/[A-Z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une lettre majuscule.";
  }
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=~`’€£§]/.test(password)) {
    return "Le mot de passe doit contenir au moins un caractère spécial.";
  }
  return null;
}

type Body = {
  firstname?: string;
  lastname?: string;
  phone?: string | null;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
};

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const body = (await req.json()) as Body;
    const firstnameTrim = body.firstname?.trim();
    const lastnameTrim = body.lastname?.trim();
    const firstname = firstnameTrim
      ? formatFirstname(firstnameTrim)
      : firstnameTrim;
    const lastname = lastnameTrim ? formatLastname(lastnameTrim) : lastnameTrim;
    const phoneRaw = body.phone;
    const phone =
      typeof phoneRaw === "string"
        ? phoneRaw.trim() || null
        : phoneRaw === null
          ? null
          : undefined;

    const currentPassword = body.currentPassword ?? "";
    const newPassword = body.newPassword?.trim() ?? "";
    const confirmNewPassword = body.confirmNewPassword?.trim() ?? "";

    if (!firstname || !lastname) {
      return NextResponse.json(
        { error: "Le prénom et le nom sont obligatoires." },
        { status: 400 },
      );
    }

    const wantsPasswordChange =
      newPassword.length > 0 ||
      confirmNewPassword.length > 0 ||
      currentPassword.length > 0;

    if (wantsPasswordChange) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Indiquez votre mot de passe actuel pour le modifier." },
          { status: 400 },
        );
      }
      if (!newPassword) {
        return NextResponse.json(
          { error: "Indiquez le nouveau mot de passe." },
          { status: 400 },
        );
      }
      if (newPassword !== confirmNewPassword) {
        return NextResponse.json(
          {
            error: "La confirmation ne correspond pas au nouveau mot de passe.",
          },
          { status: 400 },
        );
      }
      const pwdError = validateNewPassword(newPassword);
      if (pwdError) {
        return NextResponse.json({ error: pwdError }, { status: 400 });
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Compte introuvable." },
        { status: 404 },
      );
    }

    if (wantsPasswordChange) {
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        return NextResponse.json(
          { error: "Le mot de passe actuel est incorrect." },
          { status: 400 },
        );
      }
    }

    const hashed = wantsPasswordChange
      ? await bcrypt.hash(newPassword, 12)
      : undefined;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstname,
        lastname,
        ...(phone !== undefined ? { phone } : {}),
        ...(hashed ? { password: hashed } : {}),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[PATCH /api/account/profile]", e);
    return NextResponse.json(
      { error: "Impossible d’enregistrer les modifications." },
      { status: 500 },
    );
  }
}
