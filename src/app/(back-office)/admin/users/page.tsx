"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { useAdminUsers } from "@/components/back-office/users/use-admin-users";
import { UsersAdminHeader } from "@/components/back-office/users/users-admin-header";
import { CreateUserModal } from "@/components/back-office/users/create-user-modal";
import { UsersDeleteConfirmModal } from "@/components/back-office/users/users-delete-confirm-modal";
import { AdminSearchInput } from "@/components/back-office/admin-search-input";
import { type AdminUser } from "@/components/back-office/users/users-shared";
import { UsersTable } from "@/components/back-office/users/users-table";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useUrlModal } from "@/hooks/use-url-modal";

export default function UsersAdminPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const { isOpen: isCreateModalOpen, setOpenInUrl: setCreateModalOpenInUrl } = useUrlModal({
    paramName: "createUser",
  });
  const {
    users,
    isLoading,
    page,
    totalUsers,
    totalPages,
    pendingStatusUserId,
    pendingDeleteUserId,
    pendingRoleUserId,
    createUser,
    toggleUserStatus,
    toggleUserRole,
    deleteUser,
    goToPreviousPage,
    goToNextPage,
    clearMessages,
  } = useAdminUsers(debouncedQuery);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  const openCreateModal = () => {
    clearMessages();
    setCreateModalOpenInUrl(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpenInUrl(false);
  };

  const openDeleteConfirmation = (user: AdminUser) => {
    clearMessages();
    setUserToDelete(user);
  };

  const cancelDeleteConfirmation = () => {
    setUserToDelete(null);
  };

  const confirmDeleteUser = () => {
    if (!userToDelete) {
      return;
    }

    void deleteUser(userToDelete)
      .then(() => {
        setUserToDelete(null);
      })
      .catch(() => {
      });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <Toaster richColors position="top-right" closeButton />
      <UsersAdminHeader totalUsers={totalUsers} onOpenCreateModal={openCreateModal} />

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-col gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <AdminSearchInput
            value={query}
            onChange={setQuery}
            placeholder="Rechercher par nom, email ou téléphone..."
          />

          <PaginationControls
            summary={`Page ${page} sur ${totalPages} - ${totalUsers} utilisateur${totalUsers > 1 ? "s" : ""}`}
            currentPage={page}
            totalPages={totalPages}
            isPreviousDisabled={isLoading || page <= 1}
            isNextDisabled={isLoading || page >= totalPages}
            onPrevious={goToPreviousPage}
            onNext={goToNextPage}
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-between"
          />
        </div>

        <UsersTable
          users={users}
          isLoading={isLoading}
          pendingStatusUserId={pendingStatusUserId}
          pendingDeleteUserId={pendingDeleteUserId}
          pendingRoleUserId={pendingRoleUserId}
          onToggleStatus={(user) => {
            void toggleUserStatus(user);
          }}
          onToggleRole={(user) => {
            void toggleUserRole(user);
          }}
          onDelete={(user) => {
            openDeleteConfirmation(user);
          }}
        />
      </section>
      <UsersDeleteConfirmModal
        userToDelete={userToDelete}
        pendingDeleteUserId={pendingDeleteUserId}
        onCancel={cancelDeleteConfirmation}
        onConfirm={confirmDeleteUser}
      />
      <CreateUserModal
        open={isCreateModalOpen}
        onClose={() => {
          closeCreateModal();
        }}
        onCreateUser={createUser}
      />
    </div>
  );
}
