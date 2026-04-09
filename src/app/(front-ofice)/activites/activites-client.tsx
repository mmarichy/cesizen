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
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ActivityCard } from "@/components/ui/activity-card";
import { FilterSelect } from "@/components/ui/filter-select";
import { SearchField } from "@/components/ui/search-field";
import type {
	Activity,
	ActivityCategory,
	ActivityDifficulty,
} from "./data";
import {
	activityCategories,
	activityDifficulties,
} from "./data";
import {
	PER_PAGE_OPTIONS,
	type PerPageChoice,
	parsePerPageParam,
	pathnameWithQuery,
	scrollChunkSize,
} from "@/constants/listing-per-page";

function activityMatchesQuery(
	activity: Activity,
	rawQuery: string,
): boolean {
	const q = rawQuery.trim().toLowerCase();
	if (!q) return true;
	const haystack = [
		activity.title,
		activity.description,
		activity.category,
	]
		.join(" ")
		.toLowerCase();
	return haystack.includes(q);
}

export function ActivitesClient({
	activities,
}: {
	activities: Activity[];
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [query, setQuery] = useState("");
	const [category, setCategory] =
		useState<ActivityCategory | null>(null);
	const [difficulty, setDifficulty] =
		useState<ActivityDifficulty | null>(null);
	const [scrollReveal, setScrollReveal] = useState(
		() =>
			scrollChunkSize(
				parsePerPageParam(
					searchParams.get("perPage"),
				),
			),
	);
	/** Dernière carte de la grille : chargement dès qu’elle entre dans la zone visible. */
	const loadMoreAnchorRef =
		useRef<HTMLDivElement | null>(null);

	const filtered = useMemo(
		() =>
			activities.filter((a) => {
				if (!activityMatchesQuery(a, query))
					return false;
				if (
					category !== null &&
					a.category !== category
				)
					return false;
				if (
					difficulty !== null &&
					a.difficulty !== difficulty
				)
					return false;
				return true;
			}),
		[activities, query, category, difficulty],
	);

	const count = filtered.length;

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

	const displayedActivities = useMemo(() => {
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
				/* Déclenche quand la dernière carte est réellement dans la zone utile (fin de lecture), pas avant. */
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
		displayedActivities.length,
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

	const total = activities.length;
	const noQuery = !query.trim();

	const resultLine =
		total === 0
			? "Aucune activité disponible pour le moment"
			: count === 0
				? noQuery &&
					  category !== null &&
					  difficulty !== null
					? "Aucune activité pour cette combinaison de filtres"
					: noQuery && category !== null
						? "Aucune activité dans cette catégorie"
						: noQuery &&
							  difficulty !== null
							? "Aucune activité pour ce niveau"
							: "Aucune activité ne correspond à votre recherche"
				: count === 1
					? "1 activité disponible"
					: `${count} activités disponibles`;

	const resetListing = useCallback(() => {
		setScrollReveal(scrollStep);
		goToPage(1, { replace: true });
	}, [goToPage, scrollStep]);

	return (
		<>
			<Stack
				alignItems="center"
				spacing={2}
				sx={{ mb: 4 }}>
				<Typography
					variant="h4"
					component="h1"
					sx={{
						fontWeight: 700,
						color: "#0f172a",
						fontSize: {
							xs: "1.75rem",
							sm: "2rem",
						},
						textAlign: "center",
					}}>
					Activités de détente
				</Typography>

				<Typography
					variant="body1"
					sx={{
						maxWidth: 520,
						textAlign: "center",
						lineHeight: 1.6,
						px: 1,
						color: "#334155",
					}}>
					Méditation, respiration, musique et
					exercices pour vous détendre au
					quotidien.
				</Typography>

				<SearchField
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						resetListing();
					}}
					placeholder="Rechercher une activité…"
					aria-label="Rechercher une activité"
					maxWidth={640}
					hideStartIcon
					sx={{ mt: 1 }}
				/>

				<Stack
					direction={{ xs: "column", md: "row" }}
					useFlexGap
					spacing={2}
					alignItems={{ xs: "stretch", md: "flex-start" }}
					justifyContent="center"
					sx={{
						width: "100%",
						maxWidth: 920,
						mt: 1,
						px: { xs: 0, sm: 1 },
					}}>
					<FilterSelect
						fieldId="activites-filtre-categorie"
						label="Catégorie"
						value={category ?? ""}
						onChange={(e) => {
							const v = e.target
								.value as string;
							setCategory(
								v === ""
									? null
									: (v as ActivityCategory),
							);
							resetListing();
						}}
						aria-label="Filtrer par catégorie"
						formSx={{
							flex: { md: "1 1 0" },
							minWidth: { xs: 0, md: 160 },
						}}>
						<MenuItem value="">
							<em>Toutes les catégories</em>
						</MenuItem>
						{activityCategories.map((c) => (
							<MenuItem key={c} value={c}>
								{c}
							</MenuItem>
						))}
					</FilterSelect>

					<FilterSelect
						fieldId="activites-filtre-difficulte"
						label="Difficulté"
						value={difficulty ?? ""}
						onChange={(e) => {
							const v = e.target
								.value as string;
							setDifficulty(
								v === ""
									? null
									: (v as ActivityDifficulty),
							);
							resetListing();
						}}
						aria-label="Filtrer par niveau de difficulté"
						formSx={{
							flex: { md: "1 1 0" },
							minWidth: { xs: 0, md: 160 },
						}}>
						<MenuItem value="">
							<em>Tous les niveaux</em>
						</MenuItem>
						{activityDifficulties.map((d) => (
							<MenuItem key={d} value={d}>
								{d}
							</MenuItem>
						))}
					</FilterSelect>

					{total > 0 ? (
						<FilterSelect
							fieldId="activites-filtre-par-page"
							label="Par page"
							value={perPage}
							onChange={(e) => {
								setPerPageInUrl(
									Number(
										e.target.value,
									) as PerPageChoice,
								);
							}}
							aria-label="Nombre d’activités par page"
							formSx={{
								flex: { md: "1 1 0" },
								minWidth: { xs: 0, md: 160 },
							}}>
							{PER_PAGE_OPTIONS.map((n) => (
								<MenuItem key={n} value={n}>
									{n} activités
								</MenuItem>
							))}
						</FilterSelect>
					) : null}
				</Stack>
			</Stack>

			<Typography
				variant="body1"
				component="p"
				textAlign="center"
				fontWeight={600}
				sx={{ mb: 3, color: "#0f172a" }}>
				{resultLine}
			</Typography>

			{total === 0 ? (
				<Typography
					textAlign="center"
					sx={{ color: "#475569" }}>
					Revenez bientôt pour de nouvelles
					séances.
				</Typography>
			) : count === 0 ? null : (
				<>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{displayedActivities.map((activity, index) => {
							const isLoadAnchor =
								page === 1 &&
								hasMoreScroll &&
								index ===
									displayedActivities.length -
										1;
							return (
								<div
									key={activity.id}
									ref={
										isLoadAnchor
											? loadMoreAnchorRef
											: undefined
									}
									className="min-w-0 h-full">
									<ActivityCard
										activity={
											activity
										}
									/>
								</div>
							);
						})}
					</div>

					{page === 1 && hasMoreScroll ? (
						<Typography
							variant="body2"
							textAlign="center"
							sx={{
								mt: 3,
								color: "#64748b",
							}}>
							Affichez la dernière activité de la
							ligne pour en charger d’autres…
						</Typography>
					) : null}

					{showPagination ? (
						<Stack
							alignItems="center"
							sx={{ mt: 4 }}>
							<Pagination
								count={totalPages}
								page={page}
								onChange={(_, value) => {
									const prevPage =
										page;
									if (
										value === 1 &&
										prevPage !== 1
									) {
										setScrollReveal(
											Math.min(
												perPage,
												filtered.length,
											),
										);
									}
									goToPage(value);
								}}
								color="primary"
								shape="rounded"
								size="large"
								showFirstButton={
									totalPages > 5
								}
								showLastButton={
									totalPages > 5
								}
								sx={{
									"& .MuiPaginationItem-root":
										{
											fontWeight: 600,
										},
								}}
								aria-label={`Pagination des activités, page ${page} sur ${totalPages}`}
							/>
						</Stack>
					) : page === 1 &&
					  scrollReveal >= firstPageCap &&
					  firstPageCap > scrollStep ? (
						<Typography
							variant="body2"
							textAlign="center"
							sx={{
								mt: 3,
								color: "#64748b",
							}}>
							Toutes les activités sont
							affichées.
						</Typography>
					) : null}
				</>
			)}
		</>
	);
}
