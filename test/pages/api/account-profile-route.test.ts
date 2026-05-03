import { beforeEach, describe, expect, it, vi } from "vitest";

const { getServerSessionMock, findUniqueMock, updateMock, compareMock } =
	vi.hoisted(() => ({
		getServerSessionMock: vi.fn(),
		findUniqueMock: vi.fn(),
		updateMock: vi.fn(),
		compareMock: vi.fn(),
	}));

vi.mock("next-auth/next", () => ({
	getServerSession: getServerSessionMock,
}));

vi.mock("bcrypt", () => ({
	default: {
		compare: compareMock,
		hash: vi.fn().mockResolvedValue("hashed"),
	},
}));

vi.mock("@/lib/prisma", () => ({
	prisma: {
		user: {
			findUnique: findUniqueMock,
			update: updateMock,
		},
	},
}));

import { PATCH } from "@/app/api/account/profile/route";

describe("PATCH /api/account/profile", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("retourne 401 si non connecté", async () => {
		getServerSessionMock.mockResolvedValue(null);
		const response = await PATCH(
			new Request("http://localhost/api/account/profile", {
				method: "PATCH",
				body: JSON.stringify({ firstname: "A", lastname: "B" }),
				headers: { "Content-Type": "application/json" },
			}),
		);
		expect(response.status).toBe(401);
	});

	it("retourne 400 si payload invalide", async () => {
		getServerSessionMock.mockResolvedValue({
			user: { id: "u1" },
		});
		const response = await PATCH(
			new Request("http://localhost/api/account/profile", {
				method: "PATCH",
				body: JSON.stringify({ firstname: "", lastname: "" }),
				headers: { "Content-Type": "application/json" },
			}),
		);
		expect(response.status).toBe(400);
	});

	it("retourne 200 si connecté avec payload valide", async () => {
		getServerSessionMock.mockResolvedValue({
			user: { id: "u1" },
		});
		findUniqueMock.mockResolvedValue({
			id: "u1",
			password: "hash",
		});
		updateMock.mockResolvedValue({});

		const response = await PATCH(
			new Request("http://localhost/api/account/profile", {
				method: "PATCH",
				body: JSON.stringify({
					firstname: "alice",
					lastname: "dupont",
					phone: "0600000000",
				}),
				headers: { "Content-Type": "application/json" },
			}),
		);
		const body = await response.json();
		expect(response.status).toBe(200);
		expect(body.ok).toBe(true);
	});

	it("retourne 400 si changement mdp et password actuel faux", async () => {
		getServerSessionMock.mockResolvedValue({
			user: { id: "u1" },
		});
		findUniqueMock.mockResolvedValue({
			id: "u1",
			password: "hash",
		});
		compareMock.mockResolvedValue(false);

		const response = await PATCH(
			new Request("http://localhost/api/account/profile", {
				method: "PATCH",
				body: JSON.stringify({
					firstname: "Alice",
					lastname: "Dupont",
					currentPassword: "bad",
					newPassword: "Test1234!",
					confirmNewPassword: "Test1234!",
				}),
				headers: { "Content-Type": "application/json" },
			}),
		);
		expect(response.status).toBe(400);
	});
});
