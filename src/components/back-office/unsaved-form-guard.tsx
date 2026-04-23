"use client";

import { useEffect, useRef, useState } from "react";
import { TriangleAlert } from "lucide-react";

type UnsavedFormGuardProps = {
  formId: string;
  message?: string;
};

function serializeForm(form: HTMLFormElement) {
  const data = new FormData(form);
  const entries: string[] = [];

  for (const [key, value] of data.entries()) {
    if (value instanceof File) {
      entries.push(`${key}=file:${value.name}`);
      continue;
    }

    entries.push(`${key}=${String(value)}`);
  }

  entries.sort();
  return entries.join("&");
}

export function UnsavedFormGuard({
  formId,
  message = "Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter cette page ?",
}: UnsavedFormGuardProps) {
  const isSubmittingRef = useRef(false);
  const isDirtyRef = useRef(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    const form = document.getElementById(formId);
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const initialSnapshot = serializeForm(form);

    const updateDirtyState = () => {
      isDirtyRef.current =
        !isSubmittingRef.current
        && serializeForm(form) !== initialSnapshot;
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirtyRef.current || isSubmittingRef.current) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    const handleSubmit = () => {
      isSubmittingRef.current = true;
      isDirtyRef.current = false;
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        !isDirtyRef.current
        || isSubmittingRef.current
        || event.defaultPrevented
      ) {
        return;
      }

      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      const destination = new URL(href, window.location.href);
      const current = new URL(window.location.href);
      const sameLocation =
        destination.pathname === current.pathname
        && destination.search === current.search
        && destination.hash === current.hash;

      if (sameLocation) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      setPendingHref(destination.toString());
    };

    form.addEventListener("input", updateDirtyState);
    form.addEventListener("change", updateDirtyState);
    form.addEventListener("submit", handleSubmit);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      form.removeEventListener("input", updateDirtyState);
      form.removeEventListener("change", updateDirtyState);
      form.removeEventListener("submit", handleSubmit);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [formId]);

  if (!pendingHref) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-60 bg-black/45 p-4 sm:p-6">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <TriangleAlert size={16} />
          </span>
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-slate-900">
              Modifications non sauvegardées
            </h3>
            <p className="text-sm text-slate-600">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => {
              setPendingHref(null);
            }}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Rester sur la page
          </button>
          <button
            type="button"
            onClick={() => {
              const destination = pendingHref;
              if (!destination) {
                return;
              }
              isDirtyRef.current = false;
              setPendingHref(null);
              window.location.href = destination;
            }}
            className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            Quitter sans sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}
