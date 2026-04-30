import { beforeEach, describe, expect, it, vi } from "vitest";

const { findManyMock, mapDtoMock } = vi.hoisted(() => ({
	findManyMock: vi.fn(),
	mapDtoMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
	prisma: {
		activity: {
			findMany: findManyMock,
		},
	},
}));

vi.mock("@/lib/map-prisma-activity", () => ({
	mapPrismaActivityToDto: mapDtoMock,
}));

import { GET } from "@/app/api/activities/route";

describe("GET /api/activities", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("retourne les activités mappées", async () => {
		findManyMock.mockResolvedValue([{ id: "act-1" }]);
		mapDtoMock.mockReturnValue({
			id: "act-1",
			title: "Respiration",
			description: "Desc",
			category: "Respiration",
			accentColor: "#2563eb",
			difficulty: "Facile",
			durationMinutes: 15,
		});

		const response = await GET();
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body).toHaveLength(1);
		expect(body[0].title).toBe("Respiration");
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
