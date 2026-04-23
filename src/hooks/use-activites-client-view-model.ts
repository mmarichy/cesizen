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
import { useActivitiesFromApi } from "@/hooks/use-activities-from-api";
import { useListingPageChangeDelay } from "@/hooks/use-listing-page-change-delay";
import {
	activityCategories,
	activityDifficulties,
	activityDurationFilterToUrlValue,
	parseActivityDurationFilterFromUrl,
	type Activity,
	type ActivityCategory,
	type ActivityDifficulty,
	type ActivityDurationFilter,
} from "@/lib/activities";
import { useUrlPaginatedSlice } from "@/hooks/use-url-paginated-slice";
import {
	ACTIVITIES_DIFFICULTY_PARAM,
	ACTIVITIES_DURATION_PARAM,
	ACTIVITIES_SEARCH_PARAM,
	filterActivitiesForListing,
	getActivitiesResultLine,
} from "@/lib/activity-list-client";

export function useActivitesClientViewModel(
	initialActivities: Activity[] = [],
) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { activities, isLoading } =
		useActivitiesFromApi(initialActivities);

	const query = useMemo(
		() =>
			searchParams.get(ACTIVITIES_SEARCH_PARAM) ?? "",
		[searchParams],
	);

	const activityCategorySet = useMemo(
		() => new Set<ActivityCategory>(activityCategories),
		[],
	);

	const category = useMemo((): ActivityCategory | null => {
		const raw = searchParams.get("category");
		if (raw === null || raw === "") return null;
		if (!activityCategorySet.has(raw as ActivityCategory)) {
			return null;
		}
		return raw as ActivityCategory;
	}, [searchParams, activityCategorySet]);

	const activityDifficultySet = useMemo(
		() =>
			new Set<ActivityDifficulty>(
				activityDifficulties,
			),
		[],
	);

	const difficulty = useMemo((): ActivityDifficulty | null => {
		const raw = searchParams.get(
			ACTIVITIES_DIFFICULTY_PARAM,
		);
		if (raw === null || raw === "") return null;
		if (
			!activityDifficultySet.has(
				raw as ActivityDifficulty,
			)
		) {
			return null;
		}
		return raw as ActivityDifficulty;
	}, [searchParams, activityDifficultySet]);

	const durationFilter = useMemo((): ActivityDurationFilter | null => {
		return parseActivityDurationFilterFromUrl(
			searchParams.get(ACTIVITIES_DURATION_PARAM),
		);
	}, [searchParams]);

	const filtered = useMemo(
		() =>
			filterActivitiesForListing(
				activities,
				query,
				category,
				difficulty,
				durationFilter,
			),
		[
			activities,
			query,
			category,
			difficulty,
			durationFilter,
		],
	);

	const {
		displayedItems: displayedActivities,
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

	const listingFilterEpoch = useMemo(
		() =>
			`${query}\0${category ?? ""}\0${difficulty ?? ""}\0${durationFilter ?? ""}\0${perPage}`,
		[
			query,
			category,
			difficulty,
			durationFilter,
			perPage,
		],
	);

	const { isPageChangePending } =
		useListingPageChangeDelay(page, listingFilterEpoch);

	const setCategoryInUrl = useCallback(
		(next: ActivityCategory | null) => {
			const params = new URLSearchParams(
				searchParams.toString(),
			);
			params.delete("page");
			if (next === null) {
				params.delete("category");
			} else {
				params.set("category", next);
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
				params.delete(ACTIVITIES_SEARCH_PARAM);
			} else {
				params.set(ACTIVITIES_SEARCH_PARAM, value);
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

	const setDifficultyInUrl = useCallback(
		(next: ActivityDifficulty | null) => {
			const params = new URLSearchParams(
				searchParams.toString(),
			);
			params.delete("page");
			if (next === null) {
				params.delete(ACTIVITIES_DIFFICULTY_PARAM);
			} else {
				params.set(ACTIVITIES_DIFFICULTY_PARAM, next);
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

	const setDurationFilterInUrl = useCallback(
		(next: ActivityDurationFilter | null) => {
			const params = new URLSearchParams(
				searchParams.toString(),
			);
			params.delete("page");
			if (next === null) {
				params.delete(ACTIVITIES_DURATION_PARAM);
			} else {
				params.set(
					ACTIVITIES_DURATION_PARAM,
					activityDurationFilterToUrlValue(next),
				);
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
		if (activityCategorySet.has(raw as ActivityCategory)) {
			return;
		}
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
		activityCategorySet,
	]);

	useEffect(() => {
		const raw = searchParams.get(
			ACTIVITIES_DIFFICULTY_PARAM,
		);
		if (raw === null || raw === "") return;
		if (
			activityDifficultySet.has(
				raw as ActivityDifficulty,
			)
		) {
			return;
		}
		const params = new URLSearchParams(
			searchParams.toString(),
		);
		params.delete(ACTIVITIES_DIFFICULTY_PARAM);
		router.replace(
			pathnameWithQuery(pathname, params),
			{ scroll: false },
		);
	}, [
		pathname,
		router,
		searchParams,
		activityDifficultySet,
	]);

	useEffect(() => {
		const raw = searchParams.get(
			ACTIVITIES_DURATION_PARAM,
		);
		if (raw === null || raw === "") return;
		if (parseActivityDurationFilterFromUrl(raw) !== null) {
			return;
		}
		const params = new URLSearchParams(
			searchParams.toString(),
		);
		params.delete(ACTIVITIES_DURATION_PARAM);
		router.replace(
			pathnameWithQuery(pathname, params),
			{ scroll: false },
		);
	}, [pathname, router, searchParams]);

	const count = filtered.length;
	const total = activities.length;

	const resultLine = getActivitiesResultLine({
		isLoading,
		total,
		count,
		query,
		category,
		difficulty,
		durationFilter,
	});

	const loadMoreAnchorIndex = useMemo(() => {
		if (page !== 1 || !hasMoreScroll) return null;
		const n = displayedActivities.length;
		return n > 0 ? n - 1 : null;
	}, [page, hasMoreScroll, displayedActivities.length]);

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
		isPageChangePending,
		query,
		onQueryChange: setQueryInUrl,
		clearQuery: () => {
			setQueryInUrl("");
		},
		category,
		onCategoryChange: (next: ActivityCategory | null) => {
			setCategoryInUrl(next);
		},
		difficulty,
		onDifficultyChange: setDifficultyInUrl,
		durationFilter,
		onDurationChange: setDurationFilterInUrl,
		perPage,
		onPerPageChange: setPerPageInUrl,
		showPerPage: total > 0,
		resultLine,
		displayedActivities,
		loadMoreAnchorRef,
		loadMoreAnchorIndex,
		showLoadMoreHint: page === 1 && hasMoreScroll,
		showPagination,
		showAllLoadedHint,
		page,
		totalPages,
		onPaginationChange,
		showEmptyCatalog: !isLoading && total === 0,
		showGrid: !isLoading && total > 0 && count > 0,
	};
}
