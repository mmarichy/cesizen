"use client";

import { useRouter } from "next/navigation";
import {
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ActivityCard } from "@/components/ui/activity-card";
import { SearchField } from "@/components/ui/search-field";
import { activityMatchesQuery } from "@/lib/activity-list-client";
import type { Activity } from "@/lib/activities";

const FAVORITES_PER_PAGE = 3;

export function ProfilFavoritesGrid({
	initialActivities,
}: {
	initialActivities: Activity[];
}) {
	const router = useRouter();
	const [activities, setActivities] = useState(initialActivities);
	const [page, setPage] = useState(1);
	const [query, setQuery] = useState("");

	useEffect(() => {
		setActivities(initialActivities);
	}, [initialActivities]);

	const filteredActivities = useMemo(() => {
		if (!query.trim()) return activities;
		return activities.filter((a) =>
			activityMatchesQuery(a, query),
		);
	}, [activities, query]);

	useEffect(() => {
		setPage(1);
	}, [query]);

	const totalPages = Math.max(
		1,
		Math.ceil(
			filteredActivities.length / FAVORITES_PER_PAGE,
		),
	);

	useEffect(() => {
		if (page > totalPages) {
			setPage(totalPages);
		}
	}, [page, totalPages]);

	const displayedActivities = useMemo(() => {
		const start = (page - 1) * FAVORITES_PER_PAGE;
		return filteredActivities.slice(
			start,
			start + FAVORITES_PER_PAGE,
		);
	}, [filteredActivities, page]);

	const removeFavorite = useCallback(
		async (activityId: string): Promise<boolean> => {
			try {
				const response = await fetch(
					`/api/account/activity-favorites?activityId=${encodeURIComponent(activityId)}`,
					{ method: "DELETE" },
				);
				if (response.ok) {
					setActivities((prev) =>
						prev.filter(
							(a) => String(a.id) !== activityId,
						),
					);
					router.refresh();
					return true;
				}
				return false;
			} catch {
				return false;
			}
		},
		[router],
	);

	const showPagination =
		totalPages > 1 && filteredActivities.length > 0;

	return (
		<>
			<SearchField
				size="small"
				value={query}
				onChange={(e) => {
					setQuery(e.target.value);
				}}
				placeholder="Rechercher dans mes favoris…"
				aria-label="Rechercher dans les activités favorites"
				maxWidth={360}
				hideStartIcon
				showClearButton
				onClear={() => {
					setQuery("");
				}}
				sx={{ mt: 2 }}
			/>

			{filteredActivities.length === 0 ? (
				<Typography
					variant="body2"
					sx={{
						mt: 3,
						color: "#64748b",
						textAlign: "center",
					}}>
					{activities.length === 0
						? "Aucun favori à afficher."
						: "Aucun favori ne correspond à votre recherche."}
				</Typography>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
					{displayedActivities.map((activity) => (
						<div
							key={String(activity.id)}
							className="min-w-0 h-full">
							<ActivityCard
								activity={activity}
								isFavorite
								onFavoriteChange={async (
									next,
								) => {
									if (!next) {
										return removeFavorite(
											String(
												activity.id,
											),
										);
									}
									return false;
								}}
							/>
						</div>
					))}
				</div>
			)}

			{showPagination ? (
				<Stack
					alignItems="center"
					sx={{ mt: 4 }}>
					<Pagination
						count={totalPages}
						page={page}
						onChange={(_, value) => {
							setPage(value);
						}}
						color="primary"
						shape="rounded"
						size="large"
						showFirstButton={totalPages > 5}
						showLastButton={totalPages > 5}
						sx={{
							"& .MuiPaginationItem-root": {
								fontWeight: 600,
							},
						}}
						aria-label={`Pagination des favoris, page ${page} sur ${totalPages}`}
					/>
				</Stack>
			) : null}
		</>
	);
}
