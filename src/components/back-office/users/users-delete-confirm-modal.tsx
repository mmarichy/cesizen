"use client";

import { type AdminUser } from "@/components/back-office/users/users-shared";
import { ConfirmModal } from "@/components/ui/confirm-modal";

type UsersDeleteConfirmModalProps = {
  userToDelete: AdminUser | null;
  pendingDeleteUserId: string | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export function UsersDeleteConfirmModal({
  userToDelete,
  pendingDeleteUserId,
  onCancel,
  onConfirm,
}: UsersDeleteConfirmModalProps) {
  return (
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
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
