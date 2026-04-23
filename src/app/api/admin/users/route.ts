import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { requireAdminSession } from "@/lib/admin/require-admin-session";
import { formatFirstname, formatLastname } from "@/lib/format-person-name";
import { isValidFrenchPhone, normalizeFrenchPhone } from "@/lib/normalize-phone";
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

export async function GET(request: Request) {
  const { response } = await requireAdminSession();
  if (response) {
    return response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const pageParam = Number(searchParams.get("page") ?? "1");
    const limitParam = Number(searchParams.get("limit") ?? "20");
    const queryParam = searchParams.get("q")?.trim() ?? "";

    const page = Number.isFinite(pageParam) && pageParam > 0
      ? Math.floor(pageParam)
      : 1;
    const limit = Number.isFinite(limitParam) && limitParam > 0
      ? Math.min(Math.floor(limitParam), 100)
      : 20;

    const where = queryParam
      ? {
          OR: [
            { firstname: { contains: queryParam, mode: "insensitive" as const } },
            { lastname: { contains: queryParam, mode: "insensitive" as const } },
            { email: { contains: queryParam, mode: "insensitive" as const } },
            { phone: { contains: queryParam, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    const [users, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        orderBy: [{ role: "asc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
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
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      items: users.map(toAdminUser),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Erreur API /api/admin/users:", error);
    return NextResponse.json(
      { message: "Impossible de récupérer les utilisateurs" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { session, response } = await requireAdminSession();
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

    if (!isValidFrenchPhone(phone)) {
      return NextResponse.json(
        { message: "Le numéro de téléphone doit être au format français valide (+33XXXXXXXXX)." },
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

    const createdUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
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

      await tx.adminAuditLog.create({
        data: {
          action: "USER_CREATED",
          actorUserId: session.user.id,
          actorEmail: session.user.email ?? "",
          targetUserId: user.id,
          targetEmail: user.email,
          metadata: {
            role: user.role,
            status: user.status,
          },
        },
      });

      return user;
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
  const { session, response } = await requireAdminSession();
  if (response) {
    return response;
  }

  try {
    const body = (await request.json()) as {
      userId?: string;
      isActive?: boolean;
      role?: "ADMIN" | "USER";
    };

    if (!body.userId) {
      return NextResponse.json(
        { message: "Paramètres invalides" },
        { status: 400 },
      );
    }

    const hasStatusUpdate = typeof body.isActive === "boolean";
    const hasRoleUpdate = body.role === "ADMIN" || body.role === "USER";

    if (!hasStatusUpdate && !hasRoleUpdate) {
      return NextResponse.json(
        { message: "Paramètres invalides" },
        { status: 400 },
      );
    }

    if (hasStatusUpdate && body.userId === session.user.id && !body.isActive) {
      return NextResponse.json(
        { message: "Vous ne pouvez pas désactiver votre propre compte." },
        { status: 400 },
      );
    }

    if (hasRoleUpdate && body.userId === session.user.id && body.role === "USER") {
      return NextResponse.json(
        { message: "Vous ne pouvez pas retirer votre propre rôle administrateur." },
        { status: 400 },
      );
    }

    const updatedUser = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { id: body.userId },
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

      if (!existingUser) {
        throw new Error("USER_NOT_FOUND");
      }

      if (
        hasRoleUpdate
        && existingUser.role === "ADMIN"
        && body.role === "USER"
        && existingUser.status === "ACTIVE"
      ) {
        const activeAdminsCount = await tx.user.count({
          where: {
            role: "ADMIN",
            status: "ACTIVE",
          },
        });

        if (activeAdminsCount <= 1) {
          throw new Error("LAST_ACTIVE_ADMIN");
        }
      }

      const user = await tx.user.update({
        where: { id: body.userId },
        data: hasRoleUpdate
          ? { role: body.role }
          : { status: body.isActive ? "ACTIVE" : "DISABLED" },
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

      await tx.adminAuditLog.create({
        data: {
          action: "USER_STATUS_CHANGED",
          actorUserId: session.user.id,
          actorEmail: session.user.email ?? "",
          targetUserId: user.id,
          targetEmail: user.email,
          metadata: hasRoleUpdate
            ? {
                field: "role",
                from: existingUser.role,
                to: body.role,
              }
            : {
                field: "status",
                from: existingUser.status,
                to: body.isActive ? "ACTIVE" : "DISABLED",
                isActive: body.isActive,
              },
        },
      });

      return user;
    });

    return NextResponse.json(toAdminUser(updatedUser));
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return NextResponse.json(
        { message: "Utilisateur introuvable" },
        { status: 404 },
      );
    }

    if (error instanceof Error && error.message === "LAST_ACTIVE_ADMIN") {
      return NextResponse.json(
        { message: "Impossible de retirer le rôle admin : au moins un administrateur actif est requis." },
        { status: 400 },
      );
    }

    console.error("Erreur PATCH /api/admin/users:", error);
    return NextResponse.json(
      { message: "Impossible de mettre à jour l'utilisateur" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const { session, response } = await requireAdminSession();
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

    await prisma.$transaction(async (tx) => {
      const targetUser = await tx.user.findUnique({
        where: { id: body.userId },
        select: {
          id: true,
          email: true,
        },
      });

      if (!targetUser) {
        throw new Error("USER_NOT_FOUND");
      }

      await tx.user.delete({
        where: { id: body.userId },
      });

      await tx.adminAuditLog.create({
        data: {
          action: "USER_DELETED",
          actorUserId: session.user.id,
          actorEmail: session.user.email ?? "",
          targetUserId: targetUser.id,
          targetEmail: targetUser.email,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return NextResponse.json(
        { message: "Utilisateur introuvable" },
        { status: 404 },
      );
    }

    console.error("Erreur DELETE /api/admin/users:", error);
    return NextResponse.json(
      { message: "Impossible de supprimer l'utilisateur" },
      { status: 500 },
    );
  }
}
