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
} from "react";
import { pathnameWithQuery } from "@/constants/listing-per-page";
import { useArticlesFromApi } from "@/hooks/use-articles-from-api";
import { useUrlPaginatedSlice } from "@/hooks/use-url-paginated-slice";
import {
	ARTICLES_SEARCH_PARAM,
	filterArticlesForListing,
	getArticlesResultLine,
} from "@/lib/article-list-client";
import {
	categories,
	type Article,
} from "@/lib/articles";

export function useArticlesClientViewModel(
	initialArticles: Article[] = [],
) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { articles, isLoading } =
		useArticlesFromApi(initialArticles);

	const query = useMemo(
		() =>
			searchParams.get(ARTICLES_SEARCH_PARAM) ?? "",
		[searchParams],
	);

	const articleCategoryLabels = useMemo(
		() => new Set(categories.map((c) => c.label)),
		[],
	);

	const activeCategory = useMemo((): string | null => {
		const raw = searchParams.get("category");
		if (raw === null || raw === "") return null;
		return articleCategoryLabels.has(raw) ? raw : null;
	}, [searchParams, articleCategoryLabels]);

	const filtered = useMemo(
		() =>
			filterArticlesForListing(
				articles,
				query,
				activeCategory,
			),
		[articles, query, activeCategory],
	);

	const {
		displayedItems: displayedArticles,
		loadMoreAnchorRef,
		hasMoreScroll,
		showPagination,
		showAllLoadedHint,
		page,
		totalPages,
		perPage,
		goToPage,
		setPerPageInUrl,
		setScrollReveal,
		syncScrollRevealToUrlParams,
	} = useUrlPaginatedSlice(filtered);

	const setCategoryInUrl = useCallback(
		(label: string | null) => {
			const params = new URLSearchParams(
				searchParams.toString(),
			);
			params.delete("page");
			if (label === null || label === "") {
				params.delete("category");
			} else {
				params.set("category", label);
			}
			syncScrollRevealToUrlParams(params);
			router.replace(
				pathnameWithQuery(pathname, params),
				{ scroll: false },
			);
		},
		[
			pathname,
			router,
			searchParams,
			syncScrollRevealToUrlParams,
		],
	);

	const setQueryInUrl = useCallback(
		(value: string) => {
			const params = new URLSearchParams(
				searchParams.toString(),
			);
			params.delete("page");
			if (value === "") {
				params.delete(ARTICLES_SEARCH_PARAM);
			} else {
				params.set(ARTICLES_SEARCH_PARAM, value);
			}
			syncScrollRevealToUrlParams(params);
			router.replace(
				pathnameWithQuery(pathname, params),
				{ scroll: false },
			);
		},
		[
			pathname,
			router,
			searchParams,
			syncScrollRevealToUrlParams,
		],
	);

	useEffect(() => {
		const raw = searchParams.get("category");
		if (raw === null) return;
		if (articleCategoryLabels.has(raw)) return;
		const params = new URLSearchParams(
			searchParams.toString(),
		);
		params.delete("category");
		router.replace(
			pathnameWithQuery(pathname, params),
			{ scroll: false },
		);
	}, [
		pathname,
		router,
		searchParams,
		articleCategoryLabels,
	]);

	const count = filtered.length;
	const total = articles.length;

	const resultLine = getArticlesResultLine({
		isLoading,
		total,
		count,
		query,
		activeCategory,
	});

	const loadMoreAnchorIndex = useMemo(() => {
		if (page !== 1 || !hasMoreScroll) return null;
		const n = displayedArticles.length;
		return n > 0 ? n - 1 : null;
	}, [page, hasMoreScroll, displayedArticles.length]);

	const onPaginationChange = useCallback(
		(nextPage: number) => {
			if (nextPage === 1 && page !== 1) {
				setScrollReveal(
					Math.min(perPage, filtered.length),
				);
			}
			goToPage(nextPage);
		},
		[
			page,
			goToPage,
			setScrollReveal,
			perPage,
			filtered.length,
		],
	);

	return {
		isLoading,
		total,
		count,
		query,
		activeCategory,
		resultLine,
		displayedArticles,
		loadMoreAnchorRef,
		loadMoreAnchorIndex,
		showLoadMoreHint: page === 1 && hasMoreScroll,
		showPagination,
		showAllLoadedHint,
		page,
		totalPages,
		perPage,
		onQueryChange: setQueryInUrl,
		clearQuery: () => {
			setQueryInUrl("");
		},
		onCategoryChange: setCategoryInUrl,
		onPerPageChange: setPerPageInUrl,
		showPerPage: total > 0,
		onPaginationChange,
		showEmptyCatalog: !isLoading && total === 0,
		showGrid: !isLoading && total > 0 && count > 0,
	};
}
