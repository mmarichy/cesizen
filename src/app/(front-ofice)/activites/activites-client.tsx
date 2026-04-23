"use client";

import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
	useCallback,
	useEffect,
	useState,
	startTransition,
} from "react";
import { useSession } from "next-auth/react";
import { ActivityCard } from "@/components/ui/activity-card";
import { FilterSelect } from "@/components/ui/filter-select";
import { ListingPageChangeLoader } from "@/components/ui/listing-page-change-loader";
import { ListingPaginationStatus } from "@/components/ui/listing-pagination-status";
import {
	ListingCardScrollReveal,
	ListingScrollRevealScope,
} from "@/components/ui/listing-scroll-reveal";
import { SearchField } from "@/components/ui/search-field";
import {
	PER_PAGE_OPTIONS,
	type PerPageChoice,
} from "@/constants/listing-per-page";
import { useActivitesClientViewModel } from "@/hooks/use-activites-client-view-model";
import {
	activityCategories,
	activityDifficulties,
	activityDurationFilterOptions,
	activityDurationFilterToUrlValue,
	parseActivityDurationFilterFromUrl,
	type Activity,
	type ActivityCategory,
	type ActivityDifficulty,
} from "@/lib/activities";

export function ActivitesClient({
	activities: initialActivities = [],
}: {
	activities?: Activity[];
}) {
	const vm = useActivitesClientViewModel(
		initialActivities,
	);
	const { data: session, status } = useSession();
	const userId = session?.user?.id;
	const [favoriteIds, setFavoriteIds] = useState<
		Set<string>
	>(new Set());

	useEffect(() => {
		if (!userId) {
			startTransition(() => {
				setFavoriteIds(new Set());
			});
			return;
		}
		let cancelled = false;
		const load = async () => {
			try {
				const response = await fetch(
									"/api/account/activity-favorites",
					{ cache: "no-store" },
				);
				if (!response.ok || cancelled) return;
				const data = (await response.json()) as {
					ids?: string[];
				};
				if (cancelled || !Array.isArray(data.ids)) {
					return;
				}
				startTransition(() => {
					setFavoriteIds(new Set(data.ids));
				});
			} catch {
				if (!cancelled) {
					startTransition(() => {
						setFavoriteIds(new Set());
					});
				}
			}
		};
		void load();
		return () => {
			cancelled = true;
		};
	}, [userId]);

	const toggleFavorite = useCallback(
		async (
			activityId: string,
			next: boolean,
		): Promise<boolean> => {
			try {
				if (next) {
					const response = await fetch(
						"/api/account/activity-favorites",
						{
							method: "POST",
							headers: {
								"Content-Type":
									"application/json",
							},
							body: JSON.stringify({
								activityId,
							}),
						},
					);
					if (response.ok) {
						startTransition(() => {
							setFavoriteIds((prev) => {
								const n = new Set(prev);
								n.add(activityId);
								return n;
							});
						});
						return true;
					}
					return false;
				}
				const response = await fetch(
					`/api/account/activity-favorites?activityId=${encodeURIComponent(activityId)}`,
					{ method: "DELETE" },
				);
				if (response.ok) {
					startTransition(() => {
						setFavoriteIds((prev) => {
							const n = new Set(prev);
							n.delete(activityId);
							return n;
						});
					});
					return true;
				}
				return false;
			} catch {
				return false;
			}
		},
		[],
	);

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
					value={vm.query}
					onChange={(e) => {
						vm.onQueryChange(e.target.value);
					}}
					placeholder="Rechercher une activité…"
					aria-label="Rechercher une activité"
					maxWidth={640}
					showClearButton
					onClear={vm.clearQuery}
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
						maxWidth: 1120,
						mt: 1,
						px: { xs: 0, sm: 1 },
					}}>
					<FilterSelect
						fieldId="activites-filtre-categorie"
						label="Catégorie"
						value={vm.category ?? ""}
						onChange={(e) => {
							const v = e.target
								.value as string;
							vm.onCategoryChange(
								v === ""
									? null
									: (v as ActivityCategory),
							);
						}}
						aria-label="Filtrer par catégorie"
						formSx={{
							flex: { md: "1 1 0" },
							minWidth: { xs: 0, md: 160 },
						}}>
						<MenuItem value="">
							Toutes les catégories
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
						value={vm.difficulty ?? ""}
						onChange={(e) => {
							const v = e.target
								.value as string;
							vm.onDifficultyChange(
								v === ""
									? null
									: (v as ActivityDifficulty),
							);
						}}
						aria-label="Filtrer par niveau de difficulté"
						formSx={{
							flex: { md: "1 1 0" },
							minWidth: { xs: 0, md: 160 },
						}}>
						<MenuItem value="">
							Tous les niveaux
						</MenuItem>
						{activityDifficulties.map((d) => (
							<MenuItem key={d} value={d}>
								{d}
							</MenuItem>
						))}
					</FilterSelect>

					<FilterSelect
						fieldId="activites-filtre-duree"
						label="Durée"
						value={
							vm.durationFilter === null
								? ""
								: activityDurationFilterToUrlValue(
										vm.durationFilter,
									)
						}
						onChange={(e) => {
							const v = e.target
								.value as string;
							vm.onDurationChange(
								parseActivityDurationFilterFromUrl(
									v === "" ? null : v,
								),
							);
						}}
						aria-label="Filtrer par durée"
						formSx={{
							flex: { md: "1 1 0" },
							minWidth: { xs: 0, md: 160 },
						}}>
						<MenuItem value="">
							Toutes les durées
						</MenuItem>
						{activityDurationFilterOptions.map(
							(opt) => (
								<MenuItem
									key={opt.urlValue}
									value={opt.urlValue}>
									{opt.label}
								</MenuItem>
							),
						)}
					</FilterSelect>

					{vm.showPerPage ? (
						<FilterSelect
							fieldId="activites-filtre-par-page"
							label="Par page"
							value={vm.perPage}
							onChange={(e) => {
								vm.onPerPageChange(
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
				{vm.resultLine}
			</Typography>

			{vm.isLoading ? null : vm.showEmptyCatalog ? (
				<Typography
					textAlign="center"
					sx={{ color: "#475569" }}>
					Revenez bientôt pour de nouvelles
					séances.
				</Typography>
			) : !vm.showGrid ? null : (
				<ListingScrollRevealScope>
				<>
					{vm.isPageChangePending ? (
						<ListingPageChangeLoader ariaLabel="Chargement de la page" />
					) : (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{vm.displayedActivities.map(
								(activity, index) => (
									<div
										key={activity.id}
										ref={
											index ===
											vm.loadMoreAnchorIndex
												? vm.loadMoreAnchorRef
												: undefined
										}
										className="min-w-0 h-full">
										<ListingCardScrollReveal
											index={index}>
											<ActivityCard
												activity={activity}
												isFavorite={favoriteIds.has(
													String(
														activity.id,
													),
												)}
												onFavoriteChange={
													status ===
													"authenticated"
														? (next) =>
																toggleFavorite(
																	String(
																		activity.id,
																	),
																	next,
																)
														: undefined
												}
											/>
										</ListingCardScrollReveal>
									</div>
								),
							)}
						</div>
					)}

					{vm.showLoadMoreHint ? (
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

					<ListingPaginationStatus
						showPagination={vm.showPagination}
						showAllLoadedHint={vm.showAllLoadedHint}
						page={vm.page}
						totalPages={vm.totalPages}
						onPaginationChange={vm.onPaginationChange}
						paginationAriaLabel={`Pagination des activités, page ${vm.page} sur ${vm.totalPages}`}
						allLoadedText="Toutes les activités sont affichées."
					/>
				</>
				</ListingScrollRevealScope>
			)}
		</>
	);
}
