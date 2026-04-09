"use client";

import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { categories } from "@/app/(front-ofice)/articles/data";
import {
	PER_PAGE_OPTIONS,
	type PerPageChoice,
} from "@/constants/listing-per-page";
import { FilterSelect } from "@/components/ui/filter-select";

export type ArticleCategoryFiltersProps = {
	selectedLabel: string | null;
	onChange: (label: string | null) => void;
	/** Sélecteur « Par page » (affiché si `showPerPage`). */
	perPage?: PerPageChoice;
	onPerPageChange?: (n: PerPageChoice) => void;
	showPerPage?: boolean;
};

/**
 * Filtre catégories pour la page Articles (même menu déroulant que les activités).
 */
export function ArticleCategoryFilters({
	selectedLabel,
	onChange,
	perPage,
	onPerPageChange,
	showPerPage,
}: ArticleCategoryFiltersProps) {
	return (
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
				fieldId="articles-filtre-categorie"
				label="Catégorie"
				value={selectedLabel ?? ""}
				onChange={(e) => {
					const v = e.target.value as string;
					onChange(v === "" ? null : v);
				}}
				aria-label="Filtrer les articles par catégorie"
				formSx={{
					flex: { md: "1 1 0" },
					minWidth: { xs: 0, md: 220 },
					maxWidth: { md: 480 },
				}}>
				<MenuItem value="">
					<em>Tous les articles</em>
				</MenuItem>
				{categories.map((c) => (
					<MenuItem key={c.label} value={c.label}>
						{c.label}
					</MenuItem>
				))}
			</FilterSelect>

			{showPerPage &&
			perPage !== undefined &&
			onPerPageChange ? (
				<FilterSelect
					fieldId="articles-filtre-par-page"
					label="Par page"
					value={perPage}
					onChange={(e) => {
						onPerPageChange(
							Number(
								e.target.value,
							) as PerPageChoice,
						);
					}}
					aria-label="Nombre d’articles par page"
					formSx={{
						flex: { md: "1 1 0" },
						minWidth: { xs: 0, md: 160 },
					}}>
					{PER_PAGE_OPTIONS.map((n) => (
						<MenuItem key={n} value={n}>
							{n} articles
						</MenuItem>
					))}
				</FilterSelect>
			) : null}
		</Stack>
	);
}
