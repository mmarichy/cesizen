"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRetry() {
    startTransition(() => {
      reset();
      router.refresh();
    });
  }

  return (
    <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-red-800">Impossible de charger le dashboard</h2>
      <p className="mt-2 text-sm text-red-700">
        La base de données est peut-être indisponible. Réessayez dans quelques instants.
      </p>
      <p className="mt-3 text-xs text-red-600">Détail technique : {error.message}</p>
      <button
        type="button"
        onClick={handleRetry}
        disabled={isPending}
        className="mt-5 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
      >
        {isPending ? "Rechargement..." : "Réessayer"}
      </button>
    </section>
  );
}
