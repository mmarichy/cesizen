"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmModal } from "@/components/ui/confirm-modal";

type DeleteActivityButtonProps = {
  activityId: string;
  activityTitle: string;
  deleteAction: (formData: FormData) => Promise<void>;
  className: string;
  iconSize?: number;
};

export function DeleteActivityButton({
  activityId,
  activityTitle,
  deleteAction,
  className,
  iconSize = 14,
}: DeleteActivityButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.set("activityId", activityId);
      await deleteAction(formData);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
        }}
        disabled={isLoading}
        className={className}
        aria-label={`Supprimer l'activité ${activityTitle}`}
      >
        <Trash2 size={iconSize} />
      </button>

      <ConfirmModal
        open={isOpen}
        title="Confirmer la suppression"
        description={(
          <>
            Vous allez supprimer l&apos;activité{" "}
            <span className="font-semibold text-gray-900">{activityTitle}</span>.
          </>
        )}
        warningTitle="Cette action est irréversible."
        warningDescription="L'activité sera supprimée définitivement."
        confirmLabel="Supprimer définitivement"
        confirmationWord="SUPPRIMER"
        confirmationLabel='Tapez "SUPPRIMER" pour confirmer la suppression'
        confirmationPlaceholder="SUPPRIMER"
        isLoading={isLoading}
        onCancel={() => {
          if (isLoading) {
            return;
          }
          setIsOpen(false);
        }}
        onConfirm={() => {
          void handleConfirmDelete();
        }}
      />
    </>
  );
}
