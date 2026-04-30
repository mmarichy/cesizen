import { describe, expect, it } from "vitest";
import {
	activityMatchesQuery,
	filterActivitiesForListing,
} from "@/lib/activity-list-client";
import type { Activity } from "@/lib/activities";

const MOCK_ACTIVITIES: Activity[] = [
	{
		id: 1,
		title: "Respiration carrée",
		description: "Exercice guidé pour se calmer",
		category: "Respiration",
		accentColor: "#2563eb",
		difficulty: "Facile",
		durationMinutes: 15,
	},
	{
		id: 2,
		title: "Méditation du soir",
		description: "Séance pour relâcher les tensions",
		category: "Méditation",
		accentColor: "#9333ea",
		difficulty: "Moyen",
		durationMinutes: 30,
	},
	{
		id: 3,
		title: "Étirements anti-stress",
		description: "Routine douce du quotidien",
		category: "Exercice",
		accentColor: "#ea580c",
		difficulty: "Difficile",
		durationMinutes: 45,
	},
];

describe("Recherche et filtres des activités", () => {
	it("trouve une activité via la recherche texte", () => {
		const result = filterActivitiesForListing(
			MOCK_ACTIVITIES,
			"méditation",
			null,
			null,
			null,
		);
		expect(result).toHaveLength(1);
		expect(result[0]?.title).toBe("Méditation du soir");
	});

	it("ignore la casse et les espaces pour la recherche", () => {
		expect(
			activityMatchesQuery(
				MOCK_ACTIVITIES[0],
				"  RESPIRATION  ",
			),
		).toBe(true);
	});

	it("filtre correctement par catégorie", () => {
		const result = filterActivitiesForListing(
			MOCK_ACTIVITIES,
			"",
			"Exercice",
			null,
			null,
		);
		expect(result).toHaveLength(1);
		expect(result[0]?.title).toBe("Étirements anti-stress");
	});

	it("filtre correctement par difficulté", () => {
		const result = filterActivitiesForListing(
			MOCK_ACTIVITIES,
			"",
			null,
			"Moyen",
			null,
		);
		expect(result).toHaveLength(1);
		expect(result[0]?.title).toBe("Méditation du soir");
	});

	it("filtre correctement par durée", () => {
		const result = filterActivitiesForListing(
			MOCK_ACTIVITIES,
			"",
			null,
			null,
			15,
		);
		expect(result).toHaveLength(1);
		expect(result[0]?.title).toBe("Respiration carrée");
	});

	it("combine recherche + filtres", () => {
		const result = filterActivitiesForListing(
			MOCK_ACTIVITIES,
			"soir",
			"Méditation",
			"Moyen",
			30,
		);
		expect(result).toHaveLength(1);
		expect(result[0]?.title).toBe("Méditation du soir");
	});

	it("retourne 0 si la combinaison de filtres est incompatible", () => {
		const result = filterActivitiesForListing(
			MOCK_ACTIVITIES,
			"soir",
			"Respiration",
			"Difficile",
			60,
		);
		expect(result).toHaveLength(0);
	});
});
