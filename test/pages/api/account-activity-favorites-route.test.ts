import { beforeEach, describe, expect, it, vi } from "vitest";

const {
	getServerSessionMock,
	favFindManyMock,
	activityFindFirstMock,
	upsertMock,
	deleteManyMock,
} = vi.hoisted(() => ({
	getServerSessionMock: vi.fn(),
	favFindManyMock: vi.fn(),
	activityFindFirstMock: vi.fn(),
	upsertMock: vi.fn(),
	deleteManyMock: vi.fn(),
}));

vi.mock("next-auth/next", () => ({
	getServerSession: getServerSessionMock,
}));

vi.mock("@/lib/prisma", () => ({
	prisma: {
		activityFavorite: {
			findMany: favFindManyMock,
			upsert: upsertMock,
			deleteMany: deleteManyMock,
		},
		activity: {
			findFirst: activityFindFirstMock,
		},
	},
}));

import {
	DELETE,
	GET,
	POST,
} from "@/app/api/account/activity-favorites/route";

describe("/api/account/activity-favorites", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("GET retourne 401 si non connecté", async () => {
		getServerSessionMock.mockResolvedValue(null);
		const response = await GET();
		expect(response.status).toBe(401);
	});

	it("GET retourne 200 si connecté", async () => {
		getServerSessionMock.mockResolvedValue({
			user: { id: "u1" },
		});
		favFindManyMock.mockResolvedValue([
			{ activityId: "a1" },
			{ activityId: "a2" },
		]);
		const response = await GET();
		const body = await response.json();
		expect(response.status).toBe(200);
		expect(body.ids).toEqual(["a1", "a2"]);
	});

	it("POST retourne 400 si payload invalide", async () => {
		getServerSessionMock.mockResolvedValue({
			user: { id: "u1" },
		});
		const response = await POST(
			new Request("http://localhost/api/account/activity-favorites", {
				method: "POST",
				body: JSON.stringify({}),
				headers: { "Content-Type": "application/json" },
			}),
		);
		expect(response.status).toBe(400);
	});

	it("POST retourne 200 si connecté et payload valide", async () => {
		getServerSessionMock.mockResolvedValue({
			user: { id: "u1" },
		});
		activityFindFirstMock.mockResolvedValue({ id: "a1" });
		upsertMock.mockResolvedValue({});
		const response = await POST(
			new Request("http://localhost/api/account/activity-favorites", {
				method: "POST",
				body: JSON.stringify({ activityId: "a1" }),
				headers: { "Content-Type": "application/json" },
			}),
		);
		expect(response.status).toBe(200);
	});

	it("DELETE retourne 400 si activityId manquant", async () => {
		getServerSessionMock.mockResolvedValue({
			user: { id: "u1" },
		});
		const response = await DELETE(
			new Request("http://localhost/api/account/activity-favorites", {
				method: "DELETE",
			}),
		);
		expect(response.status).toBe(400);
	});
});
