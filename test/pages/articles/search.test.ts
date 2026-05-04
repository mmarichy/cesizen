import { describe, expect, it } from "vitest";
import {
	articleMatchesCategory,
	articleMatchesQuery,
	filterArticlesForListing,
} from "@/lib/article-list-client";
import type { Article } from "@/lib/articles";

const MOCK_ARTICLES: Article[] = [
	{
		id: 1,
		title: "Mieux dormir",
		category: {
			label: "Santé Mentale",
			color: "#9333ea",
		},
		smallDescription: "Conseils sommeil",
		description: "Contenu",
		author: "Admin",
		date: "1 janvier 2026",
	},
	{
		id: 2,
		title: "Respirer en pleine conscience",
		category: { label: "Bien-être", color: "#16a34a" },
		smallDescription: "Respiration",
		description: "Contenu",
		author: "Admin",
		date: "2 janvier 2026",
	},
	{
		id: 3,
		title: "Nutrition anti-stress",
		category: { label: "Nutrition", color: "#ca8a04" },
		smallDescription: "Nutrition",
		description: "Contenu",
		author: "Admin",
		date: "3 janvier 2026",
	},
];

describe("Recherche et filtrage des articles", () => {
	it("recherche texte : titre ou libellé de catégorie", () => {
		const parTitre = filterArticlesForListing(
			MOCK_ARTICLES,
			"respirer",
			null,
		);
		expect(parTitre).toHaveLength(1);
		expect(parTitre[0]?.title).toBe("Respirer en pleine conscience");

		const parCatégorie = filterArticlesForListing(
			MOCK_ARTICLES,
			"nutrition",
			null,
		);
		expect(parCatégorie).toHaveLength(1);
		expect(parCatégorie[0]?.category.label).toBe("Nutrition");
	});

	it("normalise casse et espaces pour la recherche", () => {
		expect(
			articleMatchesQuery(MOCK_ARTICLES[0], "  MIEUX  "),
		).toBe(true);
	});

	it("sans filtre : recherche vide et catégorie null retournent la liste complète", () => {
		expect(
			filterArticlesForListing(MOCK_ARTICLES, "", null),
		).toHaveLength(3);
	});

	it("filtre par catégorie sélectionnée", () => {
		const result = filterArticlesForListing(
			MOCK_ARTICLES,
			"",
			"Bien-être",
		);

		expect(result).toHaveLength(1);
		expect(result[0]?.title).toBe("Respirer en pleine conscience");
	});

	it("articleMatchesCategory reflète la catégorie active", () => {
		expect(
			articleMatchesCategory(
				MOCK_ARTICLES[0],
				"Santé Mentale",
			),
		).toBe(true);
		expect(
			articleMatchesCategory(
				MOCK_ARTICLES[0],
				"Nutrition",
			),
		).toBe(false);
	});
});
