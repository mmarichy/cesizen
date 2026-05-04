"use client";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import type { SxProps, Theme } from "@mui/material/styles";

const SLATE = "#0f172a";
export const PILL_FILTER_SHADOW =
	"0 1px 3px rgba(15, 23, 42, 0.1), 0 1px 2px rgba(15, 23, 42, 0.06)";

export type PillFilterOption = {
	value: string;
	label: string;
	/**
	 * Fond du bouton lorsqu’il est sélectionné (texte blanc).
	 * Absent : couleur neutre (slate).
	 */
	activeColor?: string;
};

type InternalEntry = {
	key: string;
	label: string;
	value: string | null;
	activeColor?: string;
};

export type PillFilterGroupProps = {
	/** Options affichées (sans l’entrée « tout »). */
	options: PillFilterOption[];
	/** Valeur sélectionnée ; `null` = option « tout » si `includeAll`. */
	value: string | null;
	onChange: (next: string | null) => void;
	/** Afficher un premier bouton qui remet `null` (ex. « Tous »). Défaut : `true`. */
	includeAll?: boolean;
	/** Libellé du bouton « tout ». Défaut : « Tout ». */
	allLabel?: string;
	/** Une seule ligne qui revient à la ligne si besoin, ou deux lignes équilibrées. */
	layout?: "single" | "two-rows";
	/** Largeur max du bloc (centré). Défaut : 720. */
	maxWidth?: number | string;
	"aria-label": string;
	sx?: SxProps<Theme>;
};

export function PillFilterGroup({
	options,
	value,
	onChange,
	includeAll = true,
	allLabel = "Tout",
	layout = "single",
	maxWidth = 720,
	"aria-label": ariaLabel,
	sx,
}: PillFilterGroupProps) {
	const entries: InternalEntry[] = [
		...(includeAll
			? [
					{
						key: "__all__",
						label: allLabel,
						value: null,
					} satisfies InternalEntry,
				]
			: []),
		...options.map((o) => ({
			key: o.value,
			label: o.label,
			value: o.value,
			activeColor: o.activeColor,
		})),
	];

	const rows =
		layout === "two-rows"
			? splitInTwoRows(entries)
			: [entries];

	return (
		<Stack
			direction="column"
			alignItems="center"
			spacing={1.25}
			role="group"
			aria-label={ariaLabel}
			sx={{
				width: "100%",
				maxWidth,
				mx: "auto",
				px: { xs: 0.5, sm: 1 },
				...sx,
			}}>
			{rows.map((row, rowIndex) => (
				<Stack
					key={rowIndex}
					direction="row"
					flexWrap="wrap"
					justifyContent="center"
					alignItems="center"
					useFlexGap
					sx={{
						gap: 1.25,
						width: "100%",
					}}>
					{row.map((entry) => (
						<PillFilterButton
							key={entry.key}
							label={entry.label}
							selected={
								value === entry.value
							}
							activeColor={
								entry.activeColor
							}
							onClick={() =>
								onChange(entry.value)
							}
						/>
					))}
				</Stack>
			))}
		</Stack>
	);
}

function splitInTwoRows(
	entries: InternalEntry[],
): InternalEntry[][] {
	if (entries.length <= 1) return [entries];
	const half = Math.ceil(entries.length / 2);
	return [
		entries.slice(0, half),
		entries.slice(half),
	];
}

function PillFilterButton({
	label,
	selected,
	activeColor,
	onClick,
}: {
	label: string;
	selected: boolean;
	activeColor?: string;
	onClick: () => void;
}) {
	const selectedBg =
		selected && activeColor
			? activeColor
			: selected
				? SLATE
				: undefined;

	return (
		<Button
			disableElevation
			onClick={onClick}
			aria-pressed={selected}
			sx={{
				borderRadius: 9999,
				fontWeight: 700,
				textTransform: "none",
				minWidth: "unset",
				px: 2.5,
				py: 1,
				fontSize: "0.875rem",
				boxShadow: PILL_FILTER_SHADOW,
				transition:
					"background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s, filter 0.2s",
				...(selected
					? {
							bgcolor: selectedBg,
							color: "#fff",
							border: "none",
							"&:hover": activeColor
								? {
										filter:
											"brightness(0.92)",
										boxShadow:
											PILL_FILTER_SHADOW,
									}
								: {
										bgcolor: "#1e293b",
										boxShadow:
											PILL_FILTER_SHADOW,
									},
						}
					: {
							bgcolor: "#fff",
							color: SLATE,
							border: "1px solid #e2e8f0",
							"&:hover": {
								bgcolor: "#f8fafc",
								borderColor: "#cbd5e1",
								boxShadow: PILL_FILTER_SHADOW,
							},
						}),
			}}>
			{label}
		</Button>
	);
}
