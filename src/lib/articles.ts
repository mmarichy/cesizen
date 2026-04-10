export type ArticleCategoryDefinition = {
	label: string;
	color: string;
	tagAliases: string[];
};

export const ARTICLE_CATEGORY_DEFINITIONS: ArticleCategoryDefinition[] =
	[
		{
			label: "Santé Mentale",
			color: "#9333ea",
			tagAliases: ["sante-mentale", "sommeil"],
		},
		{
			label: "Bien-être",
			color: "#16a34a",
			tagAliases: ["bien-etre", "relaxation"],
		},
		{
			label: "Thérapies",
			color: "#2563eb",
			tagAliases: ["therapies"],
		},
		{
			label: "Activité physique",
			color: "#ea580c",
			tagAliases: [
				"activite-physique",
				"exercice",
			],
		},
		{
			label: "Nutrition",
			color: "#ca8a04",
			tagAliases: ["nutrition"],
		},
		{
			label: "Développement personnel",
			color: "#dc2626",
			tagAliases: [
				"developpement-personnel",
			],
		},
	];

export const categories: {
	label: string;
	color: string;
}[] = ARTICLE_CATEGORY_DEFINITIONS.map(
	({ label, color }) => ({ label, color }),
);

const DEFAULT_ARTICLE_CATEGORY: {
	label: string;
	color: string;
} = (() => {
	const def = ARTICLE_CATEGORY_DEFINITIONS.find(
		(d) => d.label === "Bien-être",
	);
	if (!def) {
		throw new Error(
			"ARTICLE_CATEGORY_DEFINITIONS : catégorie « Bien-être » manquante",
		);
	}
	return { label: def.label, color: def.color };
})();

function normalizeArticleTag(tag: string): string {
	return tag
		.trim()
		.toLowerCase()
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.replace(/\s+/g, "-");
}

const tagAliasToCategory = new Map<
	string,
	{ label: string; color: string }
>();

for (const def of ARTICLE_CATEGORY_DEFINITIONS) {
	const entry = {
		label: def.label,
		color: def.color,
	};
	for (const alias of def.tagAliases) {
		tagAliasToCategory.set(
			normalizeArticleTag(alias),
			entry,
		);
	}
}

export function articleTagToCategory(
	tag: string,
): {
	label: string;
	color: string;
} {
	const key = normalizeArticleTag(tag);
	return tagAliasToCategory.get(key) ?? DEFAULT_ARTICLE_CATEGORY;
}

export type Article = {
	id: number | string;
	title: string;
	category: {
		label: string;
		color: string;
	};
	smallDescription: string;
	description: string;
	author: string;
	date: string;
};
