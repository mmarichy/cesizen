"use client";

import {
	usePathname,
	useRouter,
	useSearchParams,
} from "next/navigation";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	PER_PAGE_OPTIONS,
	type PerPageChoice,
	parsePerPageParam,
	pathnameWithQuery,
	scrollChunkSize,
} from "@/constants/listing-per-page";

export function useUrlPaginatedSlice<T>(
	filtered: readonly T[],
) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const count = filtered.length;

	const [scrollReveal, setScrollReveal] = useState(
		() =>
			scrollChunkSize(
				parsePerPageParam(
					searchParams.get("perPage"),
				),
			),
	);

	const perPage = useMemo(
		() =>
			parsePerPageParam(
				searchParams.get("perPage"),
			),
		[searchParams],
	);

	const scrollStep = useMemo(
		() => scrollChunkSize(perPage),
		[perPage],
	);

	const [perPageSynced, setPerPageSynced] =
		useState(perPage);
	if (perPage !== perPageSynced) {
		setPerPageSynced(perPage);
		setScrollReveal(scrollStep);
	}

	const totalPages = Math.ceil(
		filtered.length / perPage,
	);

	const rawPageFromUrl = useMemo(() => {
		const raw = parseInt(
			searchParams.get("page") ?? "1",
			10,
		);
		if (!Number.isFinite(raw) || raw < 1) {
			return 1;
		}
		return Math.floor(raw);
	}, [searchParams]);

	const [prevRawPage, setPrevRawPage] =
		useState(rawPageFromUrl);
	if (rawPageFromUrl !== prevRawPage) {
		const fromPagination =
			prevRawPage !== 1 &&
			rawPageFromUrl === 1;
		setPrevRawPage(rawPageFromUrl);
		if (fromPagination) {
			setScrollReveal(
				Math.min(perPage, filtered.length),
			);
		}
	}

	const page = useMemo(
		() =>
			Math.min(
				rawPageFromUrl,
				Math.max(1, totalPages),
			),
		[rawPageFromUrl, totalPages],
	);

	const goToPage = useCallback(
		(
			next: number,
			options?: { replace?: boolean },
		) => {
			const params = new URLSearchParams(
				searchParams.toString(),
			);
			if (next <= 1) {
				params.delete("page");
			} else {
				params.set("page", String(next));
			}
			const url = pathnameWithQuery(
				pathname,
				params,
			);
			if (options?.replace) {
				router.replace(url, {
					scroll: false,
				});
			} else {
				router.push(url, { scroll: false });
			}
		},
		[pathname, router, searchParams],
	);

	const setPerPageInUrl = useCallback(
		(next: PerPageChoice) => {
			const params = new URLSearchParams(
				searchParams.toString(),
			);
			params.delete("page");
			params.set("perPage", String(next));
			router.replace(
				pathnameWithQuery(pathname, params),
				{ scroll: false },
			);
		},
		[pathname, router, searchParams],
	);

	useEffect(() => {
		const raw =
			searchParams.get("perPage");
		if (raw === null) return;
		const n = parseInt(raw, 10);
		if (
			Number.isFinite(n) &&
			PER_PAGE_OPTIONS.includes(
				n as PerPageChoice,
			)
		) {
			return;
		}
		const params = new URLSearchParams(
			searchParams.toString(),
		);
		params.delete("perPage");
		router.replace(
			pathnameWithQuery(pathname, params),
			{ scroll: false },
		);
	}, [pathname, router, searchParams]);

	useEffect(() => {
		if (count !== 0) return;
		if (
			!searchParams.get("page")
		) {
			return;
		}
		const params = new URLSearchParams(
			searchParams.toString(),
		);
		params.delete("page");
		router.replace(
			pathnameWithQuery(pathname, params),
			{ scroll: false },
		);
	}, [count, pathname, router, searchParams]);

	useEffect(() => {
		if (count === 0) return;
		if (totalPages < 1) return;
		if (rawPageFromUrl === page) return;

		const params = new URLSearchParams(
			searchParams.toString(),
		);
		if (page <= 1) {
			params.delete("page");
		} else {
			params.set("page", String(page));
		}
		router.replace(
			pathnameWithQuery(pathname, params),
			{ scroll: false },
		);
	}, [
		count,
		rawPageFromUrl,
		page,
		totalPages,
		pathname,
		router,
		searchParams,
	]);

	useEffect(() => {
		if (page !== 1) return;
		const p = searchParams.get("page");
		if (p === null) return;
		if (parseInt(p, 10) !== 1) return;

		const params = new URLSearchParams(
			searchParams.toString(),
		);
		params.delete("page");
		router.replace(
			pathnameWithQuery(pathname, params),
			{ scroll: false },
		);
	}, [page, pathname, router, searchParams]);

	const displayedItems = useMemo(() => {
		if (page === 1) {
			const cap = Math.min(
				perPage,
				filtered.length,
			);
			return filtered.slice(
				0,
				Math.min(scrollReveal, cap),
			);
		}
		const start = (page - 1) * perPage;
		return filtered.slice(
			start,
			start + perPage,
		);
	}, [filtered, page, scrollReveal, perPage]);

	const firstPageCap = Math.min(
		perPage,
		filtered.length,
	);
	const hasMoreScroll =
		page === 1 &&
		scrollReveal < firstPageCap;

	const showPagination =
		totalPages > 1 &&
		(scrollReveal >= perPage || page > 1);

	const loadMoreAnchorRef =
		useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!hasMoreScroll) return;
		const node = loadMoreAnchorRef.current;
		if (!node) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (!entry?.isIntersecting) return;
				setScrollReveal((prev) =>
					Math.min(
						prev + scrollStep,
						firstPageCap,
					),
				);
			},
			{
				rootMargin: "0px 0px -12% 0px",
				threshold: 0,
			},
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, [
		hasMoreScroll,
		firstPageCap,
		scrollReveal,
		scrollStep,
		page,
		displayedItems.length,
	]);

	const skipScrollTopRef = useRef(true);
	useEffect(() => {
		if (skipScrollTopRef.current) {
			skipScrollTopRef.current = false;
			return;
		}
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}, [page]);

	const syncScrollRevealToUrlParams = useCallback(
		(params: URLSearchParams) => {
			setScrollReveal(
				scrollChunkSize(
					parsePerPageParam(
						params.get("perPage"),
					),
				),
			);
		},
		[],
	);

	const showAllLoadedHint =
		page === 1 &&
		scrollReveal >= firstPageCap &&
		firstPageCap > scrollStep;

	return {
		displayedItems,
		loadMoreAnchorRef,
		hasMoreScroll,
		showPagination,
		showAllLoadedHint,
		page,
		totalPages,
		perPage,
		scrollStep,
		firstPageCap,
		scrollReveal,
		goToPage,
		setPerPageInUrl,
		setScrollReveal,
		syncScrollRevealToUrlParams,
	};
}
