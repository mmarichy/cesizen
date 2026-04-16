import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { authOptions } from "@/lib/auth-options";
import { formatFirstname, formatLastname } from "@/lib/format-person-name";
import { normalizeFrenchPhone } from "@/lib/normalize-phone";
import { prisma } from "@/lib/prisma";

const MIN_PASSWORD = 8;

function toAdminUser(user: {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "DISABLED";
  createdAt: Date;
}) {
  return {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone ?? "-",
    role: user.role === "ADMIN" ? "Admin" : "User",
    status: user.status === "ACTIVE" ? "Actif" : "Désactivé",
    isActive: user.status === "ACTIVE",
    createdAt: user.createdAt,
  };
}

async function getAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      session: null,
      response: NextResponse.json({ message: "Non authentifié" }, { status: 401 }),
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      session: null,
      response: NextResponse.json({ message: "Accès interdit" }, { status: 403 }),
    };
  }

  return { session, response: null };
}

export async function GET() {
  const { response } = await getAdminSession();
  if (response) {
    return response;
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: [{ role: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users.map(toAdminUser));
  } catch (error) {
    console.error("Erreur API /api/admin/users:", error);
    return NextResponse.json(
      { message: "Impossible de récupérer les utilisateurs" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { response } = await getAdminSession();
  if (response) {
    return response;
  }

  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      confirmPassword?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      role?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const confirmPassword = body.confirmPassword;
    const firstNameRaw = body.firstName?.trim() ?? "";
    const lastNameRaw = body.lastName?.trim() ?? "";
    const firstName = formatFirstname(firstNameRaw);
    const lastName = formatLastname(lastNameRaw);
    const phone = normalizeFrenchPhone(body.phone);
    const role = body.role === "ADMIN" ? "ADMIN" : "USER";

    if (!email || !password || !firstNameRaw || !lastNameRaw) {
      return NextResponse.json(
        { message: "Tous les champs obligatoires doivent être remplis." },
        { status: 400 },
      );
    }

    if (password.length < MIN_PASSWORD) {
      return NextResponse.json(
        { message: `Le mot de passe doit contenir au moins ${MIN_PASSWORD} caractères.` },
        { status: 400 },
      );
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { message: "Le mot de passe doit contenir au moins une lettre majuscule." },
        { status: 400 },
      );
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-+=~`’€£§]/.test(password)) {
      return NextResponse.json(
        { message: "Le mot de passe doit contenir au moins un caractère spécial." },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Les mots de passe ne correspondent pas." },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "Un compte existe déjà avec cet email." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = await prisma.user.create({
      data: {
        email,
        firstname: firstName,
        lastname: lastName,
        phone,
        password: hashedPassword,
        role,
        status: "ACTIVE",
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(toAdminUser(createdUser), { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/admin/users:", error);
    return NextResponse.json(
      { message: "Impossible de créer l'utilisateur" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const { session, response } = await getAdminSession();
  if (response) {
    return response;
  }

  try {
    const body = (await request.json()) as {
      userId?: string;
      isActive?: boolean;
    };

    if (!body.userId || typeof body.isActive !== "boolean") {
      return NextResponse.json(
        { message: "Paramètres invalides" },
        { status: 400 },
      );
    }

    if (body.userId === session.user.id && !body.isActive) {
      return NextResponse.json(
        { message: "Vous ne pouvez pas désactiver votre propre compte." },
        { status: 400 },
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: body.userId },
      data: {
        status: body.isActive ? "ACTIVE" : "DISABLED",
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(toAdminUser(updatedUser));
  } catch (error) {
    console.error("Erreur PATCH /api/admin/users:", error);
    return NextResponse.json(
      { message: "Impossible de mettre à jour le statut utilisateur" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const { session, response } = await getAdminSession();
  if (response) {
    return response;
  }

  try {
    const body = (await request.json()) as {
      userId?: string;
    };

    if (!body.userId) {
      return NextResponse.json(
        { message: "Paramètres invalides" },
        { status: 400 },
      );
    }

    if (body.userId === session.user.id) {
      return NextResponse.json(
        { message: "Vous ne pouvez pas supprimer votre propre compte." },
        { status: 400 },
      );
    }

    await prisma.user.delete({
      where: { id: body.userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE /api/admin/users:", error);
    return NextResponse.json(
      { message: "Impossible de supprimer l'utilisateur" },
      { status: 500 },
    );
  }
}
