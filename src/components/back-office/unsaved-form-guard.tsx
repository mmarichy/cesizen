"use client";

import { useEffect } from "react";

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
  useEffect(() => {
    const form = document.getElementById(formId);
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    let isSubmitting = false;
    let isDirty = false;
    const initialSnapshot = serializeForm(form);

    const updateDirtyState = () => {
      isDirty = !isSubmitting && serializeForm(form) !== initialSnapshot;
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty || isSubmitting) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    const handleSubmit = () => {
      isSubmitting = true;
      isDirty = false;
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (!isDirty || isSubmitting || event.defaultPrevented) {
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

      const shouldLeave = window.confirm(message);
      if (!shouldLeave) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      isDirty = false;
      window.location.href = destination.toString();
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
  }, [formId, message]);

  return null;
}
