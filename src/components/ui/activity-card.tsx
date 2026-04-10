"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Heart } from "lucide-react";
import type { Activity as ActivityItem } from "@/lib/activities";

const difficultyChipSx = {
	Facile: {
		backgroundColor: "#dcfce7",
		color: "#166534",
		fontWeight: 600,
		border: "none",
	},
	Moyen: {
		backgroundColor: "#fef9c3",
		color: "#854d0e",
		fontWeight: 600,
		border: "none",
	},
	Difficile: {
		backgroundColor: "#fee2e2",
		color: "#991b1b",
		fontWeight: 600,
		border: "none",
	},
} as const;

export function ActivityCard({
	activity,
	isFavorite,
	onFavoriteChange,
}: {
	activity: ActivityItem;
	isFavorite: boolean;
	onFavoriteChange?: (
		nextFavorited: boolean,
	) => void | Promise<void>;
}) {
	const { status } = useSession();
	const router = useRouter();
	const [pending, setPending] = useState(false);

	const authenticated = status === "authenticated";

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
		setPending(true);
		try {
			await onFavoriteChange(!isFavorite);
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
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				borderRadius: "1.25rem",
				borderColor: "grey.300",
				backgroundColor: "#fff",
				boxShadow:
					"0 1px 3px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.06)",
				transition:
					"box-shadow 0.2s ease, border-color 0.2s ease",
				"&:hover": {
					boxShadow:
						"0 8px 24px rgba(15, 23, 42, 0.12), 0 4px 10px rgba(15, 23, 42, 0.08)",
					borderColor: "grey.400",
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
						onClick={() => void handleFavoriteClick()}
						aria-pressed={isFavorite}
						aria-label={
							!authenticated
								? "Se connecter pour ajouter aux favoris"
								: isFavorite
									? "Retirer des favoris"
									: "Ajouter aux favoris"
						}
						sx={{
							flexShrink: 0,
							position: "relative",
							zIndex: 1,
							mt: -0.5,
							mr: -0.5,
							width: 40,
							height: 40,
							bgcolor: isFavorite
								? "#fecaca"
								: "#f1f5f9",
							"&:hover": {
								bgcolor: isFavorite
									? "#fca5a5"
									: "#e2e8f0",
							},
						}}>
						<Heart
							size={20}
							color={
								isFavorite
									? "#dc2626"
									: "#475569"
							}
							fill={
								isFavorite
									? "#dc2626"
									: "transparent"
							}
							strokeWidth={2.25}
							aria-hidden
						/>
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
							...difficultyChipSx[
								activity.difficulty
							],
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

				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					sx={{ mt: 3, gap: 1.5 }}>
					<Typography
						variant="body2"
						fontWeight={600}
						sx={{ color: "#334155" }}>
						{activity.durationMinutes} minutes
					</Typography>
					<Box
						component="button"
						type="button"
						sx={{
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							flexShrink: 0,
							border: "none",
							borderRadius: 9999,
							cursor: "pointer",
							fontWeight: 700,
							fontSize: "0.875rem",
							fontFamily: "inherit",
							px: 2.25,
							py: 1,
							color: "#fff",
							bgcolor: "#1e293b",
							boxShadow:
								"0 1px 3px rgba(15, 23, 42, 0.2)",
							transition:
								"background-color 0.2s, box-shadow 0.2s",
							"&:hover": {
								bgcolor: "#0f172a",
								boxShadow:
									"0 4px 12px rgba(15, 23, 42, 0.2)",
							},
							"&:focus-visible": {
								outline: "2px solid #1e293b",
								outlineOffset: 2,
							},
						}}>
						Commencer
					</Box>
				</Stack>
			</CardContent>
		</Card>
	);
}
