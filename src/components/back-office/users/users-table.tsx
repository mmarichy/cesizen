"use client";

import { Power, Trash2 } from "lucide-react";
import {
  formatPhoneNumber,
  roleBadgeClassName,
  statusBadgeClassName,
  toggleButtonClassName,
  type AdminUser,
} from "@/components/back-office/users/users-shared";

type UsersTableProps = {
  users: AdminUser[];
  isLoading: boolean;
  pendingStatusUserId: string | null;
  pendingDeleteUserId: string | null;
  onToggleStatus: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
};

export function UsersTable({
  users,
  isLoading,
  pendingStatusUserId,
  pendingDeleteUserId,
  onToggleStatus,
  onDelete,
}: UsersTableProps) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full table-fixed border-separate border-spacing-0">
        <thead>
          <tr className="text-sm font-semibold text-gray-700">
            <th className="w-52 px-4 py-3 text-center">Nom</th>
            <th className="w-64 px-4 py-3 text-center">Email</th>
            <th className="w-40 px-4 py-3 text-center">Téléphone</th>
            <th className="w-28 px-4 py-3 text-center">Rôle</th>
            <th className="w-28 px-4 py-3 text-center">Statut</th>
            <th className="w-[320px] px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-500">
                Chargement des utilisateurs...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-500">
                Aucun utilisateur trouvé.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="border-t border-gray-100">
                <td className="w-52 px-4 py-5 text-center text-sm text-gray-900">
                  <span className="block truncate whitespace-nowrap font-medium">
                    {user.firstname} {user.lastname}
                  </span>
                </td>
                <td className="w-64 px-4 py-5 text-center text-sm text-gray-600">
                  <span className="block truncate whitespace-nowrap">{user.email}</span>
                </td>
                <td className="w-40 px-4 py-5 text-center text-sm text-gray-600">
                  <span className="block truncate whitespace-nowrap">
                    {formatPhoneNumber(user.phone)}
                  </span>
                </td>
                <td className="w-28 px-4 py-5 text-center">
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                      roleBadgeClassName(user.role),
                    ].join(" ")}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="w-28 px-4 py-5 text-center">
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                      statusBadgeClassName(user.isActive),
                    ].join(" ")}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="w-[320px] px-4 py-5">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        onToggleStatus(user);
                      }}
                      disabled={
                        pendingStatusUserId === user.id || pendingDeleteUserId === user.id
                      }
                      className={[
                        "inline-flex w-32 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70",
                        toggleButtonClassName(user.isActive),
                      ].join(" ")}
                    >
                      <Power size={14} />
                      {pendingStatusUserId === user.id
                        ? "En cours..."
                        : user.isActive
                          ? "Désactiver"
                          : "Activer"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onDelete(user);
                      }}
                      disabled={
                        pendingDeleteUserId === user.id || pendingStatusUserId === user.id
                      }
                      className="inline-flex w-5 items-center justify-center text-red-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label={`Supprimer ${user.firstname} ${user.lastname}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
