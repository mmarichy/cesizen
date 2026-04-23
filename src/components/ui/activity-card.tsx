"use client";

import { useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Heart } from "lucide-react";
import { activityFavoriteIconButtonSx } from "@/lib/activity-favorite-ui";
import {
	activityDifficultyChipStyle,
	type Activity as ActivityItem,
} from "@/lib/activities";

export function ActivityCard({
	activity,
	isFavorite,
	onFavoriteChange,
}: {
	activity: ActivityItem;
	isFavorite: boolean;
	onFavoriteChange?: (
		nextFavorited: boolean,
	) => boolean | Promise<boolean>;
}) {
	const { status } = useSession();
	const router = useRouter();
	const [pending, setPending] = useState(false);
	const [heartMotion, setHeartMotion] = useState<
		null | "pop" | "release"
	>(null);

	const authenticated = status === "authenticated";

	const detailHref = `/activites/${String(activity.id)}`;

	function openDetail() {
		router.push(detailHref);
	}

	function handleCardKeyDown(e: KeyboardEvent) {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			openDetail();
		}
	}

	async function handleFavoriteClick() {
		if (!authenticated) {
			const path =
				typeof window !== "undefined"
					? `${window.location.pathname}${window.location.search}`
					: "/activites";
			router.push(
				`/auth/login?callbackUrl=${encodeURIComponent(path)}`,
			);
			return;
		}
		if (!onFavoriteChange || pending) return;
		const nextFavorited = !isFavorite;
		setPending(true);
		try {
			const ok = await onFavoriteChange(nextFavorited);
			if (ok) {
				setHeartMotion(
					nextFavorited ? "pop" : "release",
				);
			}
		} finally {
			setPending(false);
		}
	}

	const categoryChipSx = {
		backgroundColor: activity.accentColor,
		color: "#fff",
		fontWeight: 600,
	};

	return (
		<Card
			elevation={0}
			component="article"
			variant="outlined"
			tabIndex={0}
			aria-label={`Ouvrir l’activité « ${activity.title} »`}
			onClick={openDetail}
			onKeyDown={handleCardKeyDown}
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				borderRadius: "1.25rem",
				borderColor: "grey.300",
				backgroundColor: "#fff",
				cursor: "pointer",
				boxShadow:
					"0 1px 3px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.06)",
				transition:
					"box-shadow 0.2s ease, border-color 0.2s ease",
				"&:hover": {
					boxShadow:
						"0 8px 24px rgba(15, 23, 42, 0.12), 0 4px 10px rgba(15, 23, 42, 0.08)",
					borderColor: "grey.400",
				},
				"&:focus-visible": {
					outline: "2px solid #0f766e",
					outlineOffset: 2,
				},
			}}>
			<CardContent
				sx={{
					display: "flex",
					flexDirection: "column",
					flexGrow: 1,
					p: 3,
					"&:last-child": { pb: 3 },
				}}>
				<Stack
					direction="row"
					alignItems="flex-start"
					justifyContent="space-between"
					gap={1}
					sx={{ mb: 2, minWidth: 0 }}>
					<Typography
						variant="h6"
						component="h2"
						fontWeight={700}
						sx={{
							flex: 1,
							minWidth: 0,
							fontSize: "1.125rem",
							lineHeight: 1.35,
							color: "#0f172a",
							overflow: "hidden",
							display: "-webkit-box",
							WebkitBoxOrient: "vertical",
							WebkitLineClamp: 2,
						}}>
						{activity.title}
					</Typography>
					<IconButton
						size="small"
						disabled={
							authenticated &&
							Boolean(onFavoriteChange) &&
							pending
						}
						onClick={(e) => {
							e.stopPropagation();
							void handleFavoriteClick();
						}}
						aria-pressed={isFavorite}
						aria-label={
							!authenticated
								? "Se connecter pour ajouter aux favoris"
								: isFavorite
									? "Retirer des favoris"
									: "Ajouter aux favoris"
						}
						sx={{
							...activityFavoriteIconButtonSx(isFavorite),
							flexShrink: 0,
							position: "relative",
							zIndex: 1,
							mt: -0.5,
							mr: -0.5,
							width: 42,
							height: 42,
							"& .activity-card-favorite-heart-wrap": {
								display: "inline-flex",
								transition:
									"transform 0.2s ease-out",
							},
							"&:hover .activity-card-favorite-heart-wrap":
								{
									transform: "scale(1.1)",
								},
							"&:active .activity-card-favorite-heart-wrap":
								{
									transform: "scale(0.95)",
								},
						}}>
						<span
							className={
								heartMotion === "pop"
									? "animate-favorite-heart-pop inline-flex leading-none"
									: heartMotion === "release"
										? "animate-favorite-heart-release inline-flex leading-none"
										: "inline-flex leading-none"
							}
							onAnimationEnd={() => {
								setHeartMotion(null);
							}}>
							<span className="activity-card-favorite-heart-wrap inline-flex leading-none">
								<Heart
									size={20}
									color="currentColor"
									fill={
										isFavorite
											? "currentColor"
											: "transparent"
									}
									strokeWidth={2.25}
									aria-hidden
								/>
							</span>
						</span>
					</IconButton>
				</Stack>

				<Stack
					direction="row"
					flexWrap="wrap"
					useFlexGap
					sx={{ gap: 1, mb: 2 }}>
					<Chip
						size="small"
						label={activity.category}
						sx={{
							...categoryChipSx,
							padding: "3px 6px",
						}}
					/>
					<Chip
						size="small"
						label={activity.difficulty}
						sx={{
							...activityDifficultyChipStyle[
								activity.difficulty
							],
							fontWeight: 600,
							border: "none",
							padding: "3px 6px",
						}}
					/>
				</Stack>

				<Typography
					variant="body2"
					sx={{
						mt: 0,
						flexGrow: 1,
						lineHeight: 1.6,
						color: "#475569",
						display: "-webkit-box",
						WebkitLineClamp: 3,
						WebkitBoxOrient: "vertical",
						overflow: "hidden",
					}}>
					{activity.description}
				</Typography>

				<Typography
					variant="body2"
					fontWeight={600}
					sx={{ mt: 3, color: "#334155" }}>
					{activity.durationMinutes} minutes
				</Typography>
			</CardContent>
		</Card>
	);
}
