"use client";

import Link from "next/link";
import { Clock3, Plus } from "lucide-react";

type UsersAdminHeaderProps = {
  totalUsers: number;
  onOpenCreateModal: () => void;
};

export function UsersAdminHeader({ totalUsers, onOpenCreateModal }: UsersAdminHeaderProps) {
  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Liste des utilisateurs</h2>
        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-orange-100 px-3 text-sm font-bold text-orange-600">
          {totalUsers}
        </span>
      </div>

      <div className="flex w-full flex-col justify-end gap-3 sm:w-auto sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-400 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(249,115,22,0.3)] transition hover:brightness-105 sm:w-auto"
        >
          <Plus size={16} />
          Ajouter un utilisateur
        </button>

        <Link
          href="/admin/users/logs"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 no-underline transition hover:bg-gray-50 sm:w-auto"
        >
          <Clock3 size={16} />
          Voir les logs
        </Link>
      </div>
    </section>
  );
}
