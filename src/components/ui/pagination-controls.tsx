"use client";

import Link from "next/link";

type PaginationControlsProps = {
  summary: string;
  currentPage: number;
  totalPages: number;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
  previousHref?: string;
  nextHref?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  className?: string;
};

export function PaginationControls({
  summary,
  currentPage,
  totalPages,
  isPreviousDisabled,
  isNextDisabled,
  previousHref,
  nextHref,
  onPrevious,
  onNext,
  className,
}: PaginationControlsProps) {
  const wrapperClassName = className
    ?? "mt-6 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between";

  return (
    <div className={wrapperClassName}>
      <p className="text-sm text-gray-600">{summary}</p>
      <div className="flex items-center gap-2">
        {onPrevious ? (
          <button
            type="button"
            onClick={onPrevious}
            disabled={isPreviousDisabled}
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Précédent
          </button>
        ) : (
          <Link
            href={previousHref ?? "#"}
            aria-disabled={isPreviousDisabled}
            className={[
              "inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 no-underline transition",
              isPreviousDisabled
                ? "pointer-events-none opacity-60"
                : "hover:bg-gray-50",
            ].join(" ")}
          >
            Précédent
          </Link>
        )}

        <span className="text-sm text-gray-600">
          Page {currentPage} / {totalPages}
        </span>

        {onNext ? (
          <button
            type="button"
            onClick={onNext}
            disabled={isNextDisabled}
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Suivant
          </button>
        ) : (
          <Link
            href={nextHref ?? "#"}
            aria-disabled={isNextDisabled}
            className={[
              "inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 no-underline transition",
              isNextDisabled
                ? "pointer-events-none opacity-60"
                : "hover:bg-gray-50",
            ].join(" ")}
          >
            Suivant
          </Link>
        )}
      </div>
    </div>
  );
}
