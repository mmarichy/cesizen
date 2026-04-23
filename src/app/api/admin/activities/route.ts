import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/require-admin-session";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { response } = await requireAdminSession();
  if (response) {
    return response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const pageParam = Number(searchParams.get("page") ?? "1");
    const limitParam = Number(searchParams.get("limit") ?? "10");
    const queryParam = searchParams.get("q")?.trim() ?? "";

    const page = Number.isFinite(pageParam) && pageParam > 0
      ? Math.floor(pageParam)
      : 1;
    const limit = Number.isFinite(limitParam) && limitParam > 0
      ? Math.min(Math.floor(limitParam), 100)
      : 10;

    const where = queryParam
      ? {
          OR: [
            { title: { contains: queryParam, mode: "insensitive" as const } },
            { author: { contains: queryParam, mode: "insensitive" as const } },
            { tag: { contains: queryParam, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    const [items, total] = await prisma.$transaction([
      prisma.activity.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          author: true,
          tag: true,
          status: true,
        },
      }),
      prisma.activity.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Erreur API /api/admin/activities:", error);
    return NextResponse.json(
      { message: "Impossible de récupérer les activités" },
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
      activityId?: string;
      archived?: boolean;
    };

    if (!body.activityId || typeof body.archived !== "boolean") {
      return NextResponse.json(
        { message: "Paramètres invalides" },
        { status: 400 },
      );
    }

    const existing = await prisma.activity.findUnique({
      where: { id: body.activityId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Activité introuvable" },
        { status: 404 },
      );
    }

    await prisma.$transaction(async (tx) => {
      const target = await tx.activity.findUnique({
        where: { id: body.activityId },
        select: {
          id: true,
          title: true,
          status: true,
        },
      });

      if (!target) {
        throw new Error("ACTIVITY_NOT_FOUND");
      }

      if (body.archived && target.status !== "ARCHIVED") {
        await tx.activity.update({
          where: { id: body.activityId },
          data: { status: "ARCHIVED" },
        });

        await tx.adminAuditLog.create({
          data: {
            action: "ACTIVITY_STATUS_CHANGED",
            actorUserId: session.user.id,
            actorEmail: session.user.email ?? "",
            targetUserId: target.id,
            targetEmail: target.title,
            metadata: {
              field: "status",
              from: target.status,
              to: "ARCHIVED",
            },
          },
        });

        return;
      }

      if (!body.archived && target.status === "ARCHIVED") {
        await tx.activity.update({
          where: { id: body.activityId },
          data: {
            status: "PUBLISHED",
            archivedAt: null,
          },
        });

        await tx.adminAuditLog.create({
          data: {
            action: "ACTIVITY_STATUS_CHANGED",
            actorUserId: session.user.id,
            actorEmail: session.user.email ?? "",
            targetUserId: target.id,
            targetEmail: target.title,
            metadata: {
              field: "status",
              from: target.status,
              to: "PUBLISHED",
            },
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "ACTIVITY_NOT_FOUND") {
      return NextResponse.json(
        { message: "Activité introuvable" },
        { status: 404 },
      );
    }

    console.error("Erreur PATCH /api/admin/activities:", error);
    return NextResponse.json(
      { message: "Impossible de mettre à jour l'activité" },
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
      activityId?: string;
    };

    if (!body.activityId) {
      return NextResponse.json(
        { message: "Paramètres invalides" },
        { status: 400 },
      );
    }

    await prisma.$transaction(async (tx) => {
      const existing = await tx.activity.findUnique({
        where: { id: body.activityId },
        select: {
          id: true,
          title: true,
        },
      });

      if (!existing) {
        throw new Error("ACTIVITY_NOT_FOUND");
      }

      await tx.activity.delete({
        where: { id: body.activityId },
      });

      await tx.adminAuditLog.create({
        data: {
          action: "ACTIVITY_DELETED",
          actorUserId: session.user.id,
          actorEmail: session.user.email ?? "",
          targetUserId: existing.id,
          targetEmail: existing.title,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "ACTIVITY_NOT_FOUND") {
      return NextResponse.json(
        { message: "Activité introuvable" },
        { status: 404 },
      );
    }

    console.error("Erreur DELETE /api/admin/activities:", error);
    return NextResponse.json(
      { message: "Impossible de supprimer l'activité" },
      { status: 500 },
    );
  }
}
