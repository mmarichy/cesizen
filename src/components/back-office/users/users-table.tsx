"use client";

import { Power, Shield, Trash2 } from "lucide-react";
import {
  formatCreatedAtDate,
  formatPhoneNumber,
  roleBadgeClassName,
  statusBadgeClassName,
  toggleButtonClassName,
  type AdminUser,
} from "@/components/back-office/users/users-shared";
import { UsersMobileList } from "@/components/back-office/users/users-mobile-list";

type UsersTableProps = {
  users: AdminUser[];
  isLoading: boolean;
  pendingStatusUserId: string | null;
  pendingDeleteUserId: string | null;
  pendingRoleUserId: string | null;
  onToggleStatus: (user: AdminUser) => void;
  onToggleRole: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
};

export function UsersTable({
  users,
  isLoading,
  pendingStatusUserId,
  pendingDeleteUserId,
  pendingRoleUserId,
  onToggleStatus,
  onToggleRole,
  onDelete,
}: UsersTableProps) {
  return (
    <>
      <div className="md:hidden">
        <UsersMobileList
          users={users}
          isLoading={isLoading}
          pendingStatusUserId={pendingStatusUserId}
          pendingDeleteUserId={pendingDeleteUserId}
          pendingRoleUserId={pendingRoleUserId}
          onToggleStatus={onToggleStatus}
          onToggleRole={onToggleRole}
          onDelete={onDelete}
        />
      </div>

      <div className="mt-6 hidden overflow-hidden md:block">
        <table className="w-full table-auto border-separate border-spacing-0">
          <thead>
            <tr className="text-sm font-semibold text-gray-700">
              <th className="px-3 py-3 text-left">Nom</th>
              <th className="px-3 py-3 text-left">Email</th>
              <th className="px-3 py-3 text-left">Téléphone</th>
              <th className="px-3 py-3 text-center">Rôle</th>
              <th className="px-3 py-3 text-center">Statut</th>
              <th className="px-3 py-3 text-center">Créé le</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                  Chargement des utilisateurs...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t border-gray-100">
                  <td className="px-3 py-5 text-sm text-gray-900">
                    <span className="block font-medium">
                      {user.firstname} {user.lastname}
                    </span>
                  </td>
                  <td className="px-3 py-5 text-sm text-gray-600">
                    <span className="block break-all">{user.email}</span>
                  </td>
                  <td className="px-3 py-5 text-sm text-gray-600">
                    <span className="block">
                      {formatPhoneNumber(user.phone)}
                    </span>
                  </td>
                  <td className="px-3 py-5 text-sm text-center">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                        roleBadgeClassName(user.role),
                      ].join(" ")}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-3 py-5 text-sm text-center">
                    <span
                      className={[
                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                        statusBadgeClassName(user.isActive),
                      ].join(" ")}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-5 text-sm text-center text-gray-600 whitespace-nowrap">
                    {formatCreatedAtDate(user.createdAt)}
                  </td>
                  <td className="px-3 py-5 text-sm">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onToggleRole(user);
                        }}
                        disabled={
                          pendingRoleUserId === user.id
                          || pendingStatusUserId === user.id
                          || pendingDeleteUserId === user.id
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <Shield size={14} />
                        {pendingRoleUserId === user.id
                          ? "En cours..."
                          : user.role === "Admin"
                            ? "Passer User"
                            : "Passer Admin"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onToggleStatus(user);
                        }}
                        disabled={
                          pendingStatusUserId === user.id
                          || pendingDeleteUserId === user.id
                          || pendingRoleUserId === user.id
                        }
                        className={[
                          "inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70",
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
                          pendingDeleteUserId === user.id
                          || pendingStatusUserId === user.id
                          || pendingRoleUserId === user.id
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
    </>
  );
}
