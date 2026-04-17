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

type UsersMobileListProps = {
  users: AdminUser[];
  isLoading: boolean;
  pendingStatusUserId: string | null;
  pendingDeleteUserId: string | null;
  pendingRoleUserId: string | null;
  onToggleStatus: (user: AdminUser) => void;
  onToggleRole: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
};

export function UsersMobileList({
  users,
  isLoading,
  pendingStatusUserId,
  pendingDeleteUserId,
  pendingRoleUserId,
  onToggleStatus,
  onToggleRole,
  onDelete,
}: UsersMobileListProps) {
  if (isLoading) {
    return <p className="py-10 text-center text-sm text-gray-500">Chargement des utilisateurs...</p>;
  }

  if (users.length === 0) {
    return <p className="py-10 text-center text-sm text-gray-500">Aucun utilisateur trouvé.</p>;
  }

  return (
    <div className="mt-6 space-y-4">
      {users.map((user) => (
        <article key={user.id} className="rounded-2xl border border-gray-200 p-4 shadow-xs">
          <div className="space-y-3">
            <div>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-gray-900">
                  {user.firstname} {user.lastname}
                </p>
                <p className="shrink-0 text-xs text-gray-500">
                  {formatCreatedAtDate(user.createdAt)}
                </p>
              </div>
              <p className="break-all text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-600">{formatPhoneNumber(user.phone)}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={[
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                  roleBadgeClassName(user.role),
                ].join(" ")}
              >
                {user.role}
              </span>
              <span
                className={[
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                  statusBadgeClassName(user.isActive),
                ].join(" ")}
              >
                {user.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-violet-200 bg-violet-50 text-violet-700 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-70"
                aria-label={user.role === "Admin" ? "Passer en rôle utilisateur" : "Passer en rôle administrateur"}
              >
                <Shield size={14} />
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
                  "inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70",
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-100 text-red-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label={`Supprimer ${user.firstname} ${user.lastname}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
