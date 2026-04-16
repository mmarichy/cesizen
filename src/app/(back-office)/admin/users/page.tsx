"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Toaster } from "sonner";
import { CreateUserModal } from "@/components/back-office/users/create-user-modal";
import { useAdminUsers } from "@/components/back-office/users/use-admin-users";
import { UsersTable } from "@/components/back-office/users/users-table";
import { type AdminUser } from "@/components/back-office/users/users-shared";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export default function UsersAdminPage() {
  const [query, setQuery] = useState("");
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    users,
    isLoading,
    pendingStatusUserId,
    pendingDeleteUserId,
    createUser,
    toggleUserStatus,
    deleteUser,
    clearMessages,
  } = useAdminUsers();

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return users;
    }

    return users.filter((user) => {
      const fullname = `${user.firstname} ${user.lastname}`.toLowerCase();
      return (
        fullname.includes(normalizedQuery)
        || user.email.toLowerCase().includes(normalizedQuery)
        || user.phone.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [query, users]);

  return (
    <div className="space-y-8">
      <Toaster richColors position="top-right" closeButton />
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold text-gray-900">Liste des utilisateurs</h2>
          <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-orange-100 px-3 text-sm font-bold text-orange-600">
            {filteredUsers.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            clearMessages();
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-400 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(249,115,22,0.3)] transition hover:brightness-105"
        >
          <Plus size={16} />
          Ajouter un utilisateur
        </button>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder="Rechercher par nom, email ou téléphone..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-700 outline-hidden transition placeholder:text-gray-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <UsersTable
          users={filteredUsers}
          isLoading={isLoading}
          pendingStatusUserId={pendingStatusUserId}
          pendingDeleteUserId={pendingDeleteUserId}
          onToggleStatus={(user) => {
            void toggleUserStatus(user);
          }}
          onDelete={(user) => {
            clearMessages();
            setUserToDelete(user);
          }}
        />
      </section>
      <ConfirmModal
        open={userToDelete !== null}
        title="Confirmer la suppression"
        description={
          userToDelete ? (
            <>
              Vous allez supprimer le compte de{" "}
              <span className="font-semibold text-gray-900">
                {userToDelete.firstname} {userToDelete.lastname}
              </span>
              .
            </>
          ) : null
        }
        warningTitle="Cette action est irréversible."
        warningDescription="Les favoris associés à cet utilisateur seront également supprimés."
        confirmLabel="Supprimer définitivement"
        confirmationWord="SUPPRIMER"
        confirmationLabel='Tapez "SUPPRIMER" pour confirmer la suppression'
        confirmationPlaceholder="SUPPRIMER"
        isLoading={userToDelete !== null && pendingDeleteUserId === userToDelete.id}
        onCancel={() => {
          setUserToDelete(null);
        }}
        onConfirm={() => {
          if (userToDelete) {
            void deleteUser(userToDelete)
              .then(() => {
                setUserToDelete(null);
              })
              .catch(() => {
                // Toast already handled in hook.
              });
          }
        }}
      />
      <CreateUserModal
        open={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
        }}
        onCreateUser={createUser}
      />
    </div>
  );
}
