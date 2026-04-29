export type ActivityCategory =
	| "Méditation"
	| "Respiration"
	| "Musique"
	| "Exercice"
	| "Relaxation";

export type ActivityDifficulty = "Facile" | "Moyen" | "Difficile";

export type Activity = {
	id: number | string;
	title: string;
	description: string;
	category: ActivityCategory;
	accentColor: string;
	difficulty: ActivityDifficulty;
	durationMinutes: number;
	defaultFavorite?: boolean;
};

export const activityCategories: ActivityCategory[] = [
	"Méditation",
	"Respiration",
	"Musique",
	"Exercice",
	"Relaxation",
];

export const activityDifficulties: ActivityDifficulty[] = [
	"Facile",
	"Moyen",
	"Difficile",
];

/** Pastel + texte foncé, identique aux puces des cartes activité (liste / détail). */
export const activityDifficultyChipStyle: Record<
	ActivityDifficulty,
	{ backgroundColor: string; color: string }
> = {
	Facile: {
		backgroundColor: "#dcfce7",
		color: "#166534",
	},
	Moyen: {
		backgroundColor: "#fef9c3",
		color: "#854d0e",
	},
	Difficile: {
		backgroundColor: "#fee2e2",
		color: "#991b1b",
	},
};

/** Valeur du filtre durée (minutes, aligné sur l’API). */
export type ActivityDurationFilter = 15 | 30 | 45 | 60;

export const activityDurationFilterOptions: {
	value: ActivityDurationFilter;
	urlValue: string;
	label: string;
}[] = [
	{ value: 15, urlValue: "15", label: "15 minutes" },
	{ value: 30, urlValue: "30", label: "30 minutes" },
	{ value: 45, urlValue: "45", label: "45 minutes" },
	{ value: 60, urlValue: "60", label: "60 minutes" },
];

export function parseActivityDurationFilterFromUrl(
	raw: string | null,
): ActivityDurationFilter | null {
	if (raw === null || raw === "") return null;
	const normalized = raw.trim().toLowerCase();
	if (normalized === "max60" || normalized === "plus") {
		return 60;
	}
	const n = parseInt(raw, 10);
	if (!Number.isFinite(n)) return null;
	if (n === 15 || n === 30 || n === 45 || n === 60) {
		return n as ActivityDurationFilter;
	}
	return null;
}

export function activityDurationFilterToUrlValue(
	filter: ActivityDurationFilter,
): string {
	return String(filter);
}

/** Couleur de la pilule lorsque la catégorie est sélectionnée (texte blanc). */
export const categoryFilterActiveColor: Record<
	ActivityCategory,
	string
> = {
	Méditation: "#9333ea",
	Respiration: "#2563eb",
	Musique: "#e11d48",
	Exercice: "#ea580c",
	Relaxation: "#0d9488",
};

/** Couleur de la pilule lorsque la difficulté est sélectionnée (texte blanc). */
export const difficultyFilterActiveColor: Record<
	ActivityDifficulty,
	string
> = {
	Facile: "#16a34a",
	Moyen: "#ca8a04",
	Difficile: "#dc2626",
};

type ActivityCategoryDefinition = {
	label: ActivityCategory;
	tagAliases: string[];
};

export const ACTIVITY_CATEGORY_DEFINITIONS: ActivityCategoryDefinition[] =
	[
		{
			label: "Méditation",
			tagAliases: ["meditation"],
		},
		{
			label: "Respiration",
			tagAliases: ["respiration"],
		},
		{
			label: "Musique",
			tagAliases: ["musique"],
		},
		{
			label: "Exercice",
			tagAliases: ["exercice"],
		},
		{
			label: "Relaxation",
			tagAliases: ["relaxation"],
		},
	];

const DEFAULT_ACTIVITY_CATEGORY: ActivityCategory =
	"Relaxation";

function normalizeActivityTag(tag: string): string {
	return tag
		.trim()
		.toLowerCase()
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.replace(/\s+/g, "-");
}

const tagAliasToCategory = new Map<
	string,
	ActivityCategory
>();

for (const def of ACTIVITY_CATEGORY_DEFINITIONS) {
	for (const alias of def.tagAliases) {
		tagAliasToCategory.set(
			normalizeActivityTag(alias),
			def.label,
		);
	}
}

export function activityTagToCategory(tag: string): {
	label: ActivityCategory;
	accentColor: string;
} {
	const label =
		tagAliasToCategory.get(
			normalizeActivityTag(tag),
		) ?? DEFAULT_ACTIVITY_CATEGORY;
	return {
		label,
		accentColor: categoryFilterActiveColor[label],
	};
}
