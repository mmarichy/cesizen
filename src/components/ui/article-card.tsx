"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type {
	SxProps,
	Theme,
} from "@mui/material/styles";
import {
	Calendar,
	Tag,
	User,
} from "lucide-react";
import type {
	Article,
	ArticleCategoryColor,
} from "@/app/(front-ofice)/articles/data";

const chipSxByCategory: Record<
	ArticleCategoryColor,
	SxProps<Theme>
> = {
	purple: {
		backgroundColor: "#9333ea",
		color: "#fff",
		fontWeight: 600,
		"& .MuiChip-icon": {
			color: "inherit",
		},
	},
	green: {
		backgroundColor: "#16a34a",
		color: "#fff",
		fontWeight: 600,
		"& .MuiChip-icon": {
			color: "inherit",
		},
	},
	blue: {
		backgroundColor: "#2563eb",
		color: "#fff",
		fontWeight: 600,
		"& .MuiChip-icon": {
			color: "inherit",
		},
	},
	orange: {
		backgroundColor: "#ea580c",
		color: "#fff",
		fontWeight: 600,
		"& .MuiChip-icon": {
			color: "inherit",
		},
	},
	yellow: {
		backgroundColor: "#ca8a04",
		color: "#fff",
		fontWeight: 600,
		"& .MuiChip-icon": {
			color: "inherit",
		},
	},
	red: {
		backgroundColor: "#dc2626",
		color: "#fff",
		fontWeight: 600,
		"& .MuiChip-icon": {
			color: "inherit",
		},
	},
};

export function ArticleCard({
	article,
}: {
	article: Article;
}) {
	const chipSx =
		chipSxByCategory[
			article.category.color
		];

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
				borderColor: "grey.400",
				backgroundColor: "#fff",
				boxShadow:
					"0 1px 3px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.06)",
				transition:
					"box-shadow 0.2s ease, border-color 0.2s ease",
				"&:hover": {
					boxShadow:
						"0 8px 24px rgba(15, 23, 42, 0.12), 0 4px 10px rgba(15, 23, 42, 0.08)",
					borderColor: "grey.500",
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
				<Typography
					variant="h6"
					component="h2"
					fontWeight={700}
					sx={{
						fontSize: "1.125rem",
						lineHeight: 1.35,
						color: "#0f172a",
					}}>
					{article.title}
				</Typography>

				<Box sx={{ mt: 1.5 }}>
					<Chip
						size="small"
						icon={
							<Tag
								size={16}
								strokeWidth={2.25}
								aria-hidden
							/>
						}
						label={
							article.category.label
						}
						sx={{ ...chipSx, padding: "3px 6px" }}
					/>
				</Box>

				<Typography
					variant="body2"
					sx={{
						mt: 2,
						flexGrow: 1,
						lineHeight: 1.6,
						color: "#475569",
						display: "-webkit-box",
						WebkitLineClamp: 3,
						WebkitBoxOrient: "vertical",
						overflow: "hidden",
					}}>
					{article.smallDescription}
				</Typography>

				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					spacing={2}
					sx={{ mt: 3, pt: 1 }}>
					<Stack
						direction="row"
						alignItems="center"
						gap={1}
						sx={{
							minWidth: 0,
							flex: 1,
						}}>
						<User
							size={16}
							strokeWidth={2}
							className="shrink-0 text-gray-800"
							aria-hidden
						/>
						<Typography
							variant="body2"
							fontWeight={600}
							sx={{ color: "#1e293b" }}
							noWrap>
							{article.author}
						</Typography>
					</Stack>
					<Stack
						direction="row"
						alignItems="center"
						gap={0.75}
						sx={{ flexShrink: 0 }}>
						<Calendar
							size={16}
							strokeWidth={2}
							className="text-gray-600"
							aria-hidden
						/>
						<Typography
							variant="body2"
							component="time"
							dateTime={article.date}
							sx={{ color: "#475569", fontWeight: 500 }}>
							{article.date}
						</Typography>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
}
