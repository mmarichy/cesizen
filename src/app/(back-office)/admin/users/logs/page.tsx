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
const USER_LOG_ACTIONS: AdminAuditAction[] = ["USER_CREATED", "USER_STATUS_CHANGED", "USER_DELETED"];

function actionLabel(action: string) {
  if (action === "USER_CREATED") {
    return "Création utilisateur";
  }

  if (action === "USER_STATUS_CHANGED") {
    return "Mise à jour utilisateur";
  }

  return "Suppression utilisateur";
}

function actionBadgeClassName(action: string) {
  if (action === "USER_CREATED") {
    return "border border-emerald-100 bg-emerald-50 text-emerald-700";
  }

  if (action === "USER_STATUS_CHANGED") {
    return "border border-amber-100 bg-amber-50 text-amber-700";
  }

  return "border border-red-100 bg-red-50 text-red-700";
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
    return ["-"];
  }

  const metadataObject = metadata as Record<string, unknown>;
  const details: string[] = [];

  const field = typeof metadataObject.field === "string"
    ? metadataObject.field.toLowerCase()
    : null;
  const fromValue = metadataValueLabel(metadataObject.from);
  const toValue = metadataValueLabel(metadataObject.to);

  if (field === "role" && fromValue && toValue) {
    details.push(`Rôle : ${fromValue} -> ${toValue}`);
  }

  if ((field === "status" || field === "isactive") && fromValue && toValue) {
    details.push(`Statut : ${fromValue} -> ${toValue}`);
  }

  const role = roleLabel(metadataObject.role);
  if (role) {
    details.push(`Rôle : ${role}`);
  }

  const status = statusLabel(metadataObject.isActive ?? metadataObject.status);
  if (status) {
    details.push(`Statut : ${status}`);
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

export default async function AdminUsersLogsPage({
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
      in: USER_LOG_ACTIONS,
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
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Logs utilisateurs</h2>
          <p className="mt-2 text-sm text-gray-600">
            Historique des créations, suppressions et changements de statut.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <form
            action="/api/admin/users/logs/export"
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
            href="/admin/users"
            className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 no-underline transition hover:bg-gray-50 sm:w-auto"
          >
            Retour à la gestion des utilisateurs
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
          previousHref={`/admin/users/logs?page=${Math.max(1, currentPage - 1)}`}
          nextHref={`/admin/users/logs?page=${Math.min(totalPages, currentPage + 1)}`}
          className="mb-6 flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between"
        />

        {logs.length === 0 ? (
          <p className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
            Aucun log disponible pour le moment.
          </p>
        ) : (
          <>
            <div className="space-y-3 md:hidden">
              {logs.map((log) => (
                <article key={log.id} className="rounded-2xl border border-gray-200 p-4 shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={[
                        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                        actionBadgeClassName(log.action),
                      ].join(" ")}
                    >
                      {actionLabel(log.action)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDateTime(log.createdAt)}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-sm">
                    <p className="text-gray-700">
                      <span className="font-semibold text-gray-900">Acteur: </span>
                      <span className="break-all">{log.actorEmail || log.actorUserId || "-"}</span>
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold text-gray-900">Cible: </span>
                      <span className="break-all">{log.targetEmail || log.targetUserId || "-"}</span>
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold text-gray-900">Détails: </span>
                      <span className="text-gray-600">
                        {formatMetadataDetails(log.metadata).map((detail, index) => (
                          <span key={detail}>
                            {index > 0 ? " | " : ""}
                            <span className="break-all">{detail}</span>
                          </span>
                        ))}
                      </span>
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full table-fixed border-separate border-spacing-0">
                <thead>
                  <tr className="text-sm font-semibold text-gray-700">
                    <th className="w-52 px-4 py-3 text-left">Action</th>
                    <th className="w-64 px-4 py-3 text-left">Acteur</th>
                    <th className="w-64 px-4 py-3 text-left">Cible</th>
                    <th className="w-64 px-4 py-3 text-left">Détails</th>
                    <th className="w-44 px-4 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-t border-gray-100 align-top">
                      <td className="px-4 py-4 text-sm">
                        <span
                          className={[
                            "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                            actionBadgeClassName(log.action),
                          ].join(" ")}
                        >
                          {actionLabel(log.action)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {log.actorEmail || log.actorUserId}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {log.targetEmail || log.targetUserId}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {formatMetadataDetails(log.metadata).map((detail) => (
                          <p key={detail} className="break-all">
                            {detail}
                          </p>
                        ))}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {formatDateTime(log.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>

        )}

      </section>
    </div>
  );
}
