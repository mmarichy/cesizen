"use client";

import { useState } from "react";
import { Eye, X } from "lucide-react";

type ActivityPreviewButtonProps = {
  activityId: string;
  variant?: "icon" | "full";
};

export function ActivityPreviewButton({
  activityId,
  variant = "full",
}: ActivityPreviewButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const iframeSrc = `/preview/activities/${activityId}`;

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Aperçu de l'activité"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100"
        >
          <Eye size={14} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          <Eye size={14} />
          Aperçu
        </button>
      )}

      {isOpen ? (
        <div className="fixed inset-0 z-50 bg-black/45 p-3 sm:p-6">
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-6">
              <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                Aperçu de l&apos;activité
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                aria-label="Fermer l'aperçu"
              >
                <X size={16} />
              </button>
            </div>

            <iframe
              src={iframeSrc}
              title="Aperçu activité"
              className="h-full w-full border-0"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
