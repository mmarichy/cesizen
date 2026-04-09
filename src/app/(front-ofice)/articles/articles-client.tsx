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
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { BookOpen } from "lucide-react";
import { ArticleCard } from "@/components/ui/article-card";
import { ArticleCategoryFilters } from "@/components/ui/article-category-filters";
import { SearchField } from "@/components/ui/search-field";
import {
	PER_PAGE_OPTIONS,
	type PerPageChoice,
	parsePerPageParam,
	pathnameWithQuery,
	scrollChunkSize,
} from "@/constants/listing-per-page";
import type { Article } from "./data";

function articleMatchesQuery(
	article: Article,
	rawQuery: string,
): boolean {
	const q = rawQuery.trim().toLowerCase();
	if (!q) return true;
	const haystack = [
		article.title,
		article.category.label,
	]
		.join(" ")
		.toLowerCase();
	return haystack.includes(q);
}

function articleMatchesCategory(
	article: Article,
	categoryLabel: string | null,
): boolean {
	if (categoryLabel === null) return true;
	return article.category.label === categoryLabel;
}

export function ArticlesClient({
	articles,
}: {
	articles: Article[];
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [query, setQuery] = useState("");
	const [activeCategory, setActiveCategory] =
		useState<string | null>(null);
	const [scrollReveal, setScrollReveal] = useState(
		() =>
			scrollChunkSize(
				parsePerPageParam(
					searchParams.get("perPage"),
				),
			),
	);
	const loadMoreAnchorRef =
		useRef<HTMLDivElement | null>(null);

	const filtered = useMemo(
		() =>
			articles.filter(
				(a) =>
					articleMatchesQuery(a, query) &&
					articleMatchesCategory(
						a,
						activeCategory,
					),
			),
		[articles, query, activeCategory],
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

	const displayedArticles = useMemo(() => {
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
		displayedArticles.length,
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

	const total = articles.length;

	const resultLine =
		total === 0
			? "Aucun article disponible pour le moment"
			: count === 0
				? !query.trim() &&
					activeCategory !== null
					? "Aucun article dans cette catégorie"
					: "Aucun article ne correspond à votre recherche"
				: count === 1
					? "1 article trouvé"
					: `${count} articles disponibles`;

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
				<Box
					sx={{
						width: 48,
						height: 48,
						borderRadius: 2,
						bgcolor: "#1e293b",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						boxShadow:
							"0 2px 6px rgba(15, 23, 42, 0.2), 0 1px 2px rgba(15, 23, 42, 0.15)",
					}}
					aria-hidden>
					<BookOpen
						size={24}
						color="#fff"
						strokeWidth={2}
					/>
				</Box>

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
					}}>
					Articles
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
					Découvrez nos articles sur la
					santé mentale et le bien-être
					validés par des professionnels
				</Typography>

				<SearchField
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						resetListing();
					}}
					placeholder="Rechercher un article…"
					aria-label="Rechercher un article"
					sx={{ mt: 1 }}
				/>

				<ArticleCategoryFilters
					selectedLabel={activeCategory}
					onChange={(label) => {
						setActiveCategory(label);
						resetListing();
					}}
					perPage={perPage}
					onPerPageChange={setPerPageInUrl}
					showPerPage={total > 0}
				/>
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
					Revenez bientôt pour découvrir
					nos prochains contenus.
				</Typography>
			) : count === 0 ? null : (
				<>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{displayedArticles.map(
							(article, index) => {
								const isLoadAnchor =
									page === 1 &&
									hasMoreScroll &&
									index ===
										displayedArticles.length -
											1;
								return (
									<div
										key={article.id}
										ref={
											isLoadAnchor
												? loadMoreAnchorRef
												: undefined
										}
										className="min-w-0 h-full">
										<ArticleCard
											article={
												article
											}
										/>
									</div>
								);
							},
						)}
					</div>

					{page === 1 && hasMoreScroll ? (
						<Typography
							variant="body2"
							textAlign="center"
							sx={{
								mt: 3,
								color: "#64748b",
							}}>
							Affichez le dernier article de
							la ligne pour en charger
							d’autres…
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
								aria-label={`Pagination des articles, page ${page} sur ${totalPages}`}
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
							Tous les articles sont
							affichés.
						</Typography>
					) : null}
				</>
			)}
		</>
	);
}
