"use client";

import { useCallback, useEffect, useState } from "react";

type UseUrlModalOptions = {
  paramName: string;
  openValue?: string;
};

export function useUrlModal({ paramName, openValue = "1" }: UseUrlModalOptions) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      setIsOpen(params.get(paramName) === openValue);
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => {
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, [paramName, openValue]);

  const setOpenInUrl = useCallback((open: boolean) => {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    if (open) {
      params.set(paramName, openValue);
    } else {
      params.delete(paramName);
    }

    const nextUrl = params.toString() ? `${url.pathname}?${params.toString()}` : url.pathname;
    window.history.replaceState(window.history.state, "", nextUrl);
    setIsOpen(open);
  }, [openValue, paramName]);

  return {
    isOpen,
    setOpenInUrl,
  };
}
