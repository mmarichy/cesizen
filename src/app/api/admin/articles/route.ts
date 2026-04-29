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

    const page =
      Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;
    const limit =
      Number.isFinite(limitParam) && limitParam > 0
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
      prisma.article.findMany({
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
      prisma.article.count({ where }),
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
    console.error("Erreur API /api/admin/articles:", error);
    return NextResponse.json(
      { message: "Impossible de récupérer les articles" },
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
      articleId?: string;
      archived?: boolean;
    };

    if (!body.articleId || typeof body.archived !== "boolean") {
      return NextResponse.json(
        { message: "Paramètres invalides" },
        { status: 400 },
      );
    }

    await prisma.$transaction(async (tx) => {
      const existing = await tx.article.findUnique({
        where: { id: body.articleId },
        select: {
          id: true,
          title: true,
          status: true,
        },
      });

      if (!existing) {
        throw new Error("ARTICLE_NOT_FOUND");
      }

      if (body.archived && existing.status !== "ARCHIVED") {
        await tx.article.update({
          where: { id: body.articleId },
          data: { status: "ARCHIVED" },
        });

        await tx.adminAuditLog.create({
          data: {
            action: "ARTICLE_STATUS_CHANGED",
            actorUserId: session.user.id,
            actorEmail: session.user.email ?? "",
            targetUserId: "",
            targetEmail: null,
            metadata: {
              contentId: existing.id,
              contentTitle: existing.title,
              field: "status",
              from: existing.status,
              to: "ARCHIVED",
            },
          },
        });

        return;
      }

      if (!body.archived && existing.status === "ARCHIVED") {
        await tx.article.update({
          where: { id: body.articleId },
          data: {
            status: "PUBLISHED",
            archivedAt: null,
          },
        });

        await tx.adminAuditLog.create({
          data: {
            action: "ARTICLE_STATUS_CHANGED",
            actorUserId: session.user.id,
            actorEmail: session.user.email ?? "",
            targetUserId: "",
            targetEmail: null,
            metadata: {
              contentId: existing.id,
              contentTitle: existing.title,
              field: "status",
              from: existing.status,
              to: "PUBLISHED",
            },
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "ARTICLE_NOT_FOUND") {
      return NextResponse.json(
        { message: "Article introuvable" },
        { status: 404 },
      );
    }

    console.error("Erreur PATCH /api/admin/articles:", error);
    return NextResponse.json(
      { message: "Impossible de mettre à jour l'article" },
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
      articleId?: string;
    };

    if (!body.articleId) {
      return NextResponse.json(
        { message: "Paramètres invalides" },
        { status: 400 },
      );
    }

    await prisma.$transaction(async (tx) => {
      const existing = await tx.article.findUnique({
        where: { id: body.articleId },
        select: {
          id: true,
          title: true,
        },
      });

      if (!existing) {
        throw new Error("ARTICLE_NOT_FOUND");
      }

      await tx.article.delete({
        where: { id: body.articleId },
      });

      await tx.adminAuditLog.create({
        data: {
          action: "ARTICLE_DELETED",
          actorUserId: session.user.id,
          actorEmail: session.user.email ?? "",
          targetUserId: "",
          targetEmail: null,
          metadata: {
            contentId: existing.id,
            contentTitle: existing.title,
          },
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "ARTICLE_NOT_FOUND") {
      return NextResponse.json(
        { message: "Article introuvable" },
        { status: 404 },
      );
    }

    console.error("Erreur DELETE /api/admin/articles:", error);
    return NextResponse.json(
      { message: "Impossible de supprimer l'article" },
      { status: 500 },
    );
  }
}
