"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ConfirmModal } from "@/components/ui/confirm-modal";

type DeleteArticleButtonProps = {
  articleId: string;
  articleTitle: string;
  deleteAction: (formData: FormData) => Promise<void>;
  className: string;
  iconSize?: number;
};

export function DeleteArticleButton({
  articleId,
  articleTitle,
  deleteAction,
  className,
  iconSize = 14,
}: DeleteArticleButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.set("articleId", articleId);
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
        aria-label={`Supprimer l'article ${articleTitle}`}
      >
        <Trash2 size={iconSize} />
      </button>

      <ConfirmModal
        open={isOpen}
        title="Confirmer la suppression"
        description={(
          <>
            Vous allez supprimer l&apos;article{" "}
            <span className="font-semibold text-gray-900">{articleTitle}</span>.
          </>
        )}
        warningTitle="Cette action est irréversible."
        warningDescription="L'article sera supprimé définitivement."
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
