import { NextResponse } from "next/server";
import { type AdminAuditAction } from "@/app/generated/prisma";
import { requireAdminSession } from "@/lib/admin/require-admin-session";
import { prisma } from "@/lib/prisma";

const ACTIVITY_LOG_ACTIONS: AdminAuditAction[] = [
  "ACTIVITY_CREATED",
  "ACTIVITY_UPDATED",
  "ACTIVITY_STATUS_CHANGED",
  "ACTIVITY_DELETED",
];

function actionLabel(action: string) {
  if (action === "ACTIVITY_CREATED") {
    return "Creation activite";
  }

  if (action === "ACTIVITY_UPDATED") {
    return "Mise a jour activite";
  }

  if (action === "ACTIVITY_STATUS_CHANGED") {
    return "Changement de statut activite";
  }

  if (action === "ACTIVITY_DELETED") {
    return "Suppression activite";
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

function difficultyLabel(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.toUpperCase();
  if (normalized === "EASY") {
    return "Facile";
  }
  if (normalized === "MEDIUM") {
    return "Moyen";
  }
  if (normalized === "HARD") {
    return "Difficile";
  }

  return null;
}

function durationLabel(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.toUpperCase();
  if (normalized === "MIN_15") {
    return "15 minutes";
  }
  if (normalized === "MIN_30") {
    return "30 minutes";
  }
  if (normalized === "MIN_45") {
    return "45 minutes";
  }
  if (normalized === "HOUR_1") {
    return "60 minutes";
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

function fieldLabel(field: string | null) {
  if (field === "role") return "Role";
  if (field === "status" || field === "isactive") return "Statut";
  if (field === "difficulty") return "Difficulte";
  if (field === "duration") return "Duree";
  if (field === "tag") return "Categorie";
  return null;
}

function metadataValueLabel(value: unknown) {
  const role = roleLabel(value);
  if (role) {
    return role;
  }

  const difficulty = difficultyLabel(value);
  if (difficulty) {
    return difficulty;
  }

  const duration = durationLabel(value);
  if (duration) {
    return duration;
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

function pushUnique(items: string[], value: string | null) {
  if (!value) {
    return;
  }

  if (!items.includes(value)) {
    items.push(value);
  }
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

  const fieldText = fieldLabel(field);
  if (fieldText && (fromValue || toValue)) {
    pushUnique(details, `${fieldText} : ${fromValue ?? "-"} -> ${toValue ?? "-"}`);
  }

  const role = roleLabel(metadataObject.role);
  if (role) {
    pushUnique(details, `Role : ${role}`);
  }

  const status = statusLabel(metadataObject.isActive ?? metadataObject.status);
  if (status) {
    pushUnique(details, `Statut : ${status}`);
  }

  const previousStatus = metadataValueLabel(metadataObject.previousStatus);
  const currentStatus = metadataValueLabel(metadataObject.status);
  if (previousStatus && currentStatus && previousStatus !== currentStatus) {
    pushUnique(details, `Statut : ${previousStatus} -> ${currentStatus}`);
  }

  const tag = metadataValueLabel(metadataObject.tag);
  if (tag) {
    pushUnique(details, `Categorie : ${tag}`);
  }

  const difficulty = metadataValueLabel(metadataObject.difficulty);
  if (difficulty) {
    pushUnique(details, `Difficulte : ${difficulty}`);
  }

  const duration = metadataValueLabel(metadataObject.duration);
  if (duration) {
    pushUnique(details, `Duree : ${duration}`);
  }

  const titleFrom = metadataValueLabel(metadataObject.titleFrom);
  const titleTo = metadataValueLabel(metadataObject.titleTo);
  if (titleFrom && titleTo && titleFrom !== titleTo) {
    pushUnique(details, `Titre : ${titleFrom} -> ${titleTo}`);
  }

  const descriptionFrom = metadataValueLabel(metadataObject.descriptionFrom);
  const descriptionTo = metadataValueLabel(metadataObject.descriptionTo);
  if (descriptionFrom && descriptionTo && descriptionFrom !== descriptionTo) {
    pushUnique(details, "Description : mise a jour");
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
  const { response } = await requireAdminSession();
  if (response) {
    return response;
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
        in: ACTIVITY_LOG_ACTIONS,
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
    const filename = `logs-activites-${periodSuffix}-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(`\uFEFF${csvContent}`, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Erreur export logs activites:", error);
    return NextResponse.json(
      { message: "Impossible d'exporter les logs activites" },
      { status: 500 },
    );
  }
}
