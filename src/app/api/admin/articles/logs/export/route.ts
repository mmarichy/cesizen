import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { type AdminAuditAction } from "@/app/generated/prisma";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

const ARTICLE_LOG_ACTIONS: AdminAuditAction[] = [
  "ARTICLE_CREATED",
  "ARTICLE_UPDATED",
  "ARTICLE_STATUS_CHANGED",
  "ARTICLE_DELETED",
];

function actionLabel(action: string) {
  if (action === "ARTICLE_CREATED") {
    return "Creation article";
  }

  if (action === "ARTICLE_UPDATED") {
    return "Mise a jour article";
  }

  if (action === "ARTICLE_STATUS_CHANGED") {
    return "Changement de statut article";
  }

  if (action === "ARTICLE_DELETED") {
    return "Suppression article";
  }

  return action;
}

function roleLabel(value: unknown) {
  if (value === "ADMIN" || value === "Admin") {
    return "Administrateur";
  }

  if (value === "USER" || value === "User") {
    return "Utilisateur";
  }

  return null;
}

function statusLabel(value: unknown) {
  if (typeof value === "boolean") {
    return value ? "Actif" : "Inactif";
  }

  if (typeof value === "string") {
    const normalized = value.toUpperCase();
    if (normalized === "ACTIVE") {
      return "Actif";
    }
    if (normalized === "DISABLED") {
      return "Inactif";
    }
    if (normalized === "PUBLISHED") {
      return "Publie";
    }
    if (normalized === "ARCHIVED") {
      return "Archive";
    }
    if (normalized === "DRAFT") {
      return "Brouillon";
    }
  }

  return null;
}

function metadataValueLabel(value: unknown) {
  const role = roleLabel(value);
  if (role) {
    return role;
  }

  const status = statusLabel(value);
  if (status) {
    return status;
  }

  if (value === null || value === undefined) {
    return null;
  }

  return String(value);
}

function formatMetadataDetails(metadata: unknown) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return "-";
  }

  const metadataObject = metadata as Record<string, unknown>;
  const details: string[] = [];

  const field = typeof metadataObject.field === "string"
    ? metadataObject.field.toLowerCase()
    : null;
  const fromValue = metadataValueLabel(metadataObject.from);
  const toValue = metadataValueLabel(metadataObject.to);

  if (field === "role" && fromValue && toValue) {
    details.push(`Role : ${fromValue} -> ${toValue}`);
  }

  if ((field === "status" || field === "isactive") && fromValue && toValue) {
    details.push(`Statut : ${fromValue} -> ${toValue}`);
  }

  const role = roleLabel(metadataObject.role);
  if (role) {
    details.push(`Role : ${role}`);
  }

  const status = statusLabel(metadataObject.isActive ?? metadataObject.status);
  if (status) {
    details.push(`Statut : ${status}`);
  }

  if (details.length > 0) {
    return details.join(" | ");
  }

  return JSON.stringify(metadataObject);
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function csvCell(value: string) {
  const escaped = value.replaceAll("\"", "\"\"");
  return `"${escaped}"`;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const period = requestUrl.searchParams.get("period");
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Non authentifie" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Acces interdit" }, { status: 403 });
  }

  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dateFilter = period === "7d"
      ? { createdAt: { gte: sevenDaysAgo } }
      : period === "all"
        ? undefined
        : { createdAt: { gte: thirtyDaysAgo } };
    const where = {
      ...dateFilter,
      action: {
        in: ARTICLE_LOG_ACTIONS,
      },
    };

    const logs = await prisma.adminAuditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 2000,
    });

    const header = ["Date", "Action", "Acteur", "Cible", "Details"];
    const rows = logs.map((log) => [
      formatDateTime(log.createdAt),
      actionLabel(log.action),
      log.actorEmail || log.actorUserId || "-",
      log.targetEmail || log.targetUserId || "-",
      formatMetadataDetails(log.metadata),
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => csvCell(cell)).join(";"))
      .join("\n");

    const periodSuffix = period === "7d" ? "7j" : period === "all" ? "all" : "30j";
    const filename = `logs-articles-${periodSuffix}-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(`\uFEFF${csvContent}`, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Erreur export logs articles:", error);
    return NextResponse.json(
      { message: "Impossible d'exporter les logs articles" },
      { status: 500 },
    );
  }
}
