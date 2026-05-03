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

describe("Recherche d'articles", () => {
	it("trouve des articles via le titre", () => {
		const result = filterArticlesForListing(
			MOCK_ARTICLES,
			"respirer",
			null,
		);

		expect(result).toHaveLength(1);
		expect(result[0]?.title).toBe(
			"Respirer en pleine conscience",
		);
	});

	it("trouve des articles via le nom de catégorie", () => {
		const result = filterArticlesForListing(
			MOCK_ARTICLES,
			"nutrition",
			null,
		);

		expect(result).toHaveLength(1);
		expect(result[0]?.category.label).toBe("Nutrition");
	});

	it("ignore la casse et les espaces en début/fin", () => {
		expect(
			articleMatchesQuery(MOCK_ARTICLES[0], "  MIEUX  "),
		).toBe(true);
	});

	it("retourne tous les articles si la recherche est vide", () => {
		const result = filterArticlesForListing(
			MOCK_ARTICLES,
			"",
			null,
		);
		expect(result).toHaveLength(3);
	});
});

describe("Filtrage des articles par catégorie", () => {
	it("filtre correctement par catégorie", () => {
		const result = filterArticlesForListing(
			MOCK_ARTICLES,
			"",
			"Bien-être",
		);

		expect(result).toHaveLength(1);
		expect(result[0]?.title).toBe(
			"Respirer en pleine conscience",
		);
	});

	it("retourne tous les articles si catégorie à null", () => {
		const result = filterArticlesForListing(
			MOCK_ARTICLES,
			"",
			null,
		);

		expect(result).toHaveLength(3);
	});

	it("articleMatchesCategory gère la catégorie active", () => {
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
