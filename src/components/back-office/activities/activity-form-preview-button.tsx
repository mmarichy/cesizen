"use client";

import { useMemo, useState } from "react";
import { Eye, X } from "lucide-react";

type ActivityFormPreviewButtonProps = {
  formId: string;
  previewPath: "/preview/activities/new" | "/preview/activities/edit";
};

function buildPreviewUrl(form: HTMLFormElement, previewPath: string) {
  const formData = new FormData(form);
  const params = new URLSearchParams();

  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      params.set(key, value);
    }
  }

  return `${previewPath}?${params.toString()}`;
}

export function ActivityFormPreviewButton({
  formId,
  previewPath,
}: ActivityFormPreviewButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const iframeSrc = useMemo(() => previewUrl ?? previewPath, [previewUrl, previewPath]);

  const openPreview = () => {
    const form = document.getElementById(formId);
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    setPreviewUrl(buildPreviewUrl(form, previewPath));
    setIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={openPreview}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:min-w-40"
      >
        <Eye size={16} />
        Aperçu
      </button>

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
              key={iframeSrc}
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
