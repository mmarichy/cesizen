import { beforeEach, describe, expect, it, vi } from "vitest";

const { findManyMock } = vi.hoisted(() => ({
	findManyMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
	prisma: {
		article: {
			findMany: findManyMock,
		},
	},
}));

import { GET } from "@/app/api/articles/route";

describe("GET /api/articles", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("retourne les articles mappés (description/date/catégorie fallback)", async () => {
		findManyMock.mockResolvedValue([
			{
				id: "a1",
				title: "Titre",
				tag: "inconnu",
				description: `  ${"x".repeat(110)}  `,
				content: "<p>Contenu</p>",
				author: "Auteur",
				date: new Date("2026-01-15T00:00:00.000Z"),
			},
		]);

		const response = await GET();
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toHaveLength(1);
		expect(body[0].category.label).toBe("Bien-être");
		expect(body[0].smallDescription.endsWith("...")).toBe(true);
		expect(body[0].date).toMatch(/janvier 2026/i);
	});

	it("retourne un tableau vide si aucune donnée", async () => {
		findManyMock.mockResolvedValue([]);
		const response = await GET();
		const body = await response.json();
		expect(response.status).toBe(200);
		expect(body).toEqual([]);
	});

	it("retourne 500 si erreur DB", async () => {
		findManyMock.mockRejectedValue(new Error("db error"));
		const response = await GET();
		expect(response.status).toBe(500);
	});
});
