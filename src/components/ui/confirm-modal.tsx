"use client";

import { useState, type ReactNode } from "react";
import { TriangleAlert, X } from "lucide-react";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: ReactNode;
  warningTitle: string;
  warningDescription: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  isLoading?: boolean;
  confirmationWord?: string;
  confirmationLabel?: string;
  confirmationPlaceholder?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

type ConfirmModalContentProps = Omit<ConfirmModalProps, "open">;

export function ConfirmModal({
  open,
  ...props
}: ConfirmModalProps) {
  if (!open) {
    return null;
  }

  return <ConfirmModalContent {...props} />;
}

function ConfirmModalContent({
  title,
  description,
  warningTitle,
  warningDescription,
  confirmLabel,
  cancelLabel = "Annuler",
  isLoading = false,
  confirmationWord,
  confirmationLabel,
  confirmationPlaceholder,
  onConfirm,
  onCancel,
}: ConfirmModalContentProps) {
  const [typedConfirmation, setTypedConfirmation] = useState("");

  const requiresTypedConfirmation = Boolean(confirmationWord);
  const isConfirmationValid = !requiresTypedConfirmation || typedConfirmation === confirmationWord;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/45 px-4 py-6 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <TriangleAlert size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <div className="mt-2 text-sm text-gray-600">{description}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Fermer la fenêtre de confirmation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-sm font-semibold text-red-700">{warningTitle}</p>
          <div className="mt-1 text-sm text-red-600">{warningDescription}</div>
        </div>

        {requiresTypedConfirmation ? (
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700">
              {confirmationLabel ?? `Tapez "${confirmationWord}" pour confirmer`}
            </label>
            <input
              type="text"
              value={typedConfirmation}
              onChange={(event) => {
                setTypedConfirmation(event.target.value);
              }}
              disabled={isLoading}
              placeholder={confirmationPlaceholder ?? confirmationWord}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-hidden transition placeholder:text-gray-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        ) : null}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading || !isConfirmationValid}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-red-500 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(239,68,68,0.28)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Suppression..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
