/**
 * Pagination « par page » partagée (articles, activités, etc.).
 */

export const DEFAULT_PER_PAGE = 24;

export const PER_PAGE_OPTIONS = [6, 12, 18, 24] as const;

export type PerPageChoice = (typeof PER_PAGE_OPTIONS)[number];

export function parsePerPageParam(
	raw: string | null,
): PerPageChoice {
	if (raw === null || raw === "") {
		return DEFAULT_PER_PAGE;
	}
	const n = parseInt(raw, 10);
	if (
		Number.isFinite(n) &&
		PER_PAGE_OPTIONS.includes(n as PerPageChoice)
	) {
		return n as PerPageChoice;
	}
	return DEFAULT_PER_PAGE;
}

/** Taille des blocs chargés au scroll sur la page 1. */
export function scrollChunkSize(perPage: number): number {
	return Math.min(
		12,
		Math.max(3, Math.ceil(perPage / 4)),
	);
}

export function pathnameWithQuery(
	pathname: string,
	params: URLSearchParams,
): string {
	const q = params.toString();
	return q ? `${pathname}?${q}` : pathname;
}
