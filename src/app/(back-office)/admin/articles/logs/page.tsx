import Link from "next/link";
import { Download } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { type AdminAuditAction } from "@/app/generated/prisma";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { PaginationControls } from "@/components/ui/pagination-controls";

export const dynamic = "force-dynamic";
const LOGS_PAGE_SIZE = 20;
const ARTICLE_LOG_ACTIONS: AdminAuditAction[] = ["ARTICLE_CREATED", "ARTICLE_UPDATED", "ARTICLE_STATUS_CHANGED", "ARTICLE_DELETED"];

function actionLabel(action: string) {
  if (action === "ARTICLE_CREATED") {
    return "Création article";
  }

  if (action === "ARTICLE_UPDATED") {
    return "Mise à jour article";
  }

  if (action === "ARTICLE_STATUS_CHANGED") {
    return "Changement de statut article";
  }

  if (action === "ARTICLE_DELETED") {
    return "Suppression article";
  }

  return action;
}

function actionBadgeClassName(action: string) {
  if (action === "ARTICLE_CREATED") {
    return "border border-emerald-100 bg-emerald-50 text-emerald-700";
  }

  if (action === "ARTICLE_UPDATED") {
    return "border border-amber-100 bg-amber-50 text-amber-700";
  }

  if (action === "ARTICLE_STATUS_CHANGED") {
    return "border border-amber-100 bg-amber-50 text-amber-700";
  }

  if (action === "ARTICLE_DELETED") {
    return "border border-red-100 bg-red-50 text-red-700";
  }

  return "border border-gray-200 bg-gray-50 text-gray-700";
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
      return "Publié";
    }
    if (normalized === "ARCHIVED") {
      return "Archivé";
    }
    if (normalized === "DRAFT") {
      return "Brouillon";
    }
  }

  return null;
}

function fieldLabel(field: string | null) {
  if (field === "role") return "Rôle";
  if (field === "status" || field === "isactive") return "Statut";
  if (field === "difficulty") return "Difficulté";
  if (field === "duration") return "Durée";
  if (field === "tag") return "Catégorie";
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
    return ["-"];
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
    pushUnique(details, `Rôle : ${role}`);
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
    pushUnique(details, `Catégorie : ${tag}`);
  }

  const difficulty = metadataValueLabel(metadataObject.difficulty);
  if (difficulty) {
    pushUnique(details, `Difficulté : ${difficulty}`);
  }

  const duration = metadataValueLabel(metadataObject.duration);
  if (duration) {
    pushUnique(details, `Durée : ${duration}`);
  }

  const titleFrom = metadataValueLabel(metadataObject.titleFrom);
  const titleTo = metadataValueLabel(metadataObject.titleTo);
  if (titleFrom && titleTo && titleFrom !== titleTo) {
    pushUnique(details, `Titre : ${titleFrom} -> ${titleTo}`);
  }

  const descriptionFrom = metadataValueLabel(metadataObject.descriptionFrom);
  const descriptionTo = metadataValueLabel(metadataObject.descriptionTo);
  if (descriptionFrom && descriptionTo && descriptionFrom !== descriptionTo) {
    pushUnique(details, "Description : mise à jour");
  }

  if (details.length > 0) {
    return details;
  }

  return [JSON.stringify(metadataObject)];
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

export default async function AdminArticleLogsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const resolvedSearchParams = await searchParams;
  const requestedPage = Number(resolvedSearchParams?.page ?? "1");
  const safeRequestedPage = Number.isFinite(requestedPage) && requestedPage > 0
    ? Math.floor(requestedPage)
    : 1;

  const where = {
    action: {
      in: ARTICLE_LOG_ACTIONS,
    },
  };

  const totalLogs = await prisma.adminAuditLog.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalLogs / LOGS_PAGE_SIZE));
  const currentPage = Math.min(safeRequestedPage, totalPages);

  const logs = await prisma.adminAuditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * LOGS_PAGE_SIZE,
    take: LOGS_PAGE_SIZE,
  });

  const rangeStart = totalLogs === 0 ? 0 : (currentPage - 1) * LOGS_PAGE_SIZE + 1;
  const rangeEnd = totalLogs === 0 ? 0 : rangeStart + logs.length - 1;

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Logs articles</h2>
          <p className="mt-2 text-sm text-gray-600">
            Historique des créations, mises à jour, changements de statut et suppressions.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <form
            action="/api/admin/articles/logs/export"
            method="get"
            className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center"
          >
            <select
              name="period"
              defaultValue="30d"
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-hidden transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 sm:w-auto"
            >
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="all">Toute la période</option>
            </select>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 sm:w-auto"
            >
              <Download size={16} />
              Exporter les logs
            </button>
          </form>

          <Link
            href="/admin/articles"
            className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 no-underline transition hover:bg-gray-50 sm:w-auto"
          >
            Retour à la gestion des articles
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <PaginationControls
          summary={`Affichage ${rangeStart}-${rangeEnd} sur ${totalLogs}`}
          currentPage={currentPage}
          totalPages={totalPages}
          isPreviousDisabled={currentPage <= 1}
          isNextDisabled={currentPage >= totalPages}
          previousHref={`/admin/articles/logs?page=${Math.max(1, currentPage - 1)}`}
          nextHref={`/admin/articles/logs?page=${Math.min(totalPages, currentPage + 1)}`}
          className="mb-6 flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between"
        />

        {logs.length === 0 ? (
          <p className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
            Aucun log disponible pour le moment.
          </p>
        ) : (
          <>
            <div className="space-y-3 md:hidden">
              {logs.map((log) => {
                const detailsLines = formatMetadataDetails(log.metadata);
                return (
                <article key={log.id} className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 p-4 shadow-xs">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <span
                        title={actionLabel(log.action)}
                        className={[
                          "inline-block max-w-full truncate rounded-full px-3 py-1 text-xs font-semibold align-middle",
                          actionBadgeClassName(log.action),
                        ].join(" ")}
                      >
                        {actionLabel(log.action)}
                      </span>
                    </div>
                    <span
                      className="shrink-0 truncate text-xs text-gray-500"
                      title={formatDateTime(log.createdAt)}
                    >
                      {formatDateTime(log.createdAt)}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-sm">
                    <p className="flex min-w-0 gap-1 text-gray-700">
                      <span className="shrink-0 font-semibold text-gray-900">Acteur: </span>
                      <span
                        className="min-w-0 truncate"
                        title={log.actorEmail || log.actorUserId || "-"}
                      >
                        {log.actorEmail || log.actorUserId || "-"}
                      </span>
                    </p>
                    <p className="flex min-w-0 gap-1 text-gray-700">
                      <span className="shrink-0 font-semibold text-gray-900">Cible: </span>
                      <span
                        className="min-w-0 truncate"
                        title={log.targetEmail || log.targetUserId || "-"}
                      >
                        {log.targetEmail || log.targetUserId || "-"}
                      </span>
                    </p>
                    <p className="flex min-w-0 gap-1 text-gray-700">
                      <span className="shrink-0 font-semibold text-gray-900">Détails: </span>
                      <span
                        className="min-w-0 whitespace-normal wrap-break-word text-gray-600"
                        title={detailsLines.join(" · ")}
                      >
                        {detailsLines.join(" · ")}
                      </span>
                    </p>
                  </div>
                </article>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full table-fixed border-separate border-spacing-0">
                <thead>
                  <tr className="text-sm font-semibold text-gray-700">
                    <th className="w-52 px-4 py-4 text-left">Action</th>
                    <th className="w-64 px-4 py-4 text-left">Acteur</th>
                    <th className="w-64 px-4 py-4 text-left">Cible</th>
                    <th className="w-64 px-4 py-4 text-left">Détails</th>
                    <th className="w-44 px-4 py-4 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const targetLabel = log.targetEmail || log.targetUserId || "-";
                    return (
                    <tr key={log.id} className="border-t border-gray-100">
                      <td className="min-w-0 max-w-0 overflow-hidden px-4 py-5 text-sm align-middle">
                        <span
                          title={actionLabel(log.action)}
                          className={[
                            "block max-w-full truncate rounded-full px-3 py-1 text-xs font-semibold",
                            actionBadgeClassName(log.action),
                          ].join(" ")}
                        >
                          {actionLabel(log.action)}
                        </span>
                      </td>
                      <td className="min-w-0 max-w-0 overflow-hidden px-4 py-5 text-sm text-gray-700 align-middle">
                        <p
                          className="truncate"
                          title={log.actorEmail || log.actorUserId || "-"}
                        >
                          {log.actorEmail || log.actorUserId || "-"}
                        </p>
                      </td>
                      <td className="min-w-0 max-w-0 overflow-hidden px-4 py-5 text-sm text-gray-700 align-middle">
                        <p
                          className="truncate"
                          title={targetLabel}
                        >
                          {targetLabel}
                        </p>
                      </td>
                      <td className="min-w-0 max-w-0 overflow-hidden px-4 py-5 text-sm text-gray-600 align-middle">
                        <div className="min-w-0 space-y-1">
                          {formatMetadataDetails(log.metadata).map((detail, index) => (
                            <p
                              key={`${log.id}-detail-${index}`}
                              className="whitespace-normal wrap-break-word"
                              title={detail}
                            >
                              {detail}
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="min-w-0 max-w-0 overflow-hidden px-4 py-5 text-sm text-gray-600 align-middle">
                        <p
                          className="truncate"
                          title={formatDateTime(log.createdAt)}
                        >
                          {formatDateTime(log.createdAt)}
                        </p>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
          
        )}

      </section>
    </div>
  );
}
