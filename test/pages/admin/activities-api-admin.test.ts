import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";

const { requireAdminSessionMock, transactionMock, activityFindUniqueMock, txMock } = vi.hoisted(
	() => ({
		requireAdminSessionMock: vi.fn(),
		transactionMock: vi.fn(),
		activityFindUniqueMock: vi.fn(),
		txMock: {
			activity: { findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() },
			adminAuditLog: { create: vi.fn() },
		},
	}),
);

vi.mock("@/lib/admin/require-admin-session", () => ({ requireAdminSession: requireAdminSessionMock }));
vi.mock("@/lib/prisma", () => ({
	prisma: {
		$transaction: transactionMock,
		activity: { findMany: vi.fn(), count: vi.fn(), findUnique: activityFindUniqueMock },
	},
}));

import { DELETE, GET, PATCH } from "@/app/api/admin/activities/route";

describe("API admin activities (essentiel)", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		requireAdminSessionMock.mockResolvedValue({
			session: { user: { id: "admin-id", email: "admin@test.local", role: "ADMIN" } },
			response: null,
		});
	});

	it("retourne 401/403 si accès refusé", async () => {
		requireAdminSessionMock.mockResolvedValueOnce({ session: null, response: NextResponse.json({}, { status: 401 }) });
		expect((await GET(new Request("http://localhost/api/admin/activities"))).status).toBe(401);

		requireAdminSessionMock.mockResolvedValueOnce({ session: null, response: NextResponse.json({}, { status: 403 }) });
		expect((await GET(new Request("http://localhost/api/admin/activities"))).status).toBe(403);
	});

	it("GET renvoie pagination", async () => {
		transactionMock.mockResolvedValue([[{ id: "act1", title: "A", author: "X", tag: "t", status: "PUBLISHED" }], 1]);
		const response = await GET(new Request("http://localhost/api/admin/activities?page=1&limit=10"));
		const body = await response.json();
		expect(response.status).toBe(200);
		expect(body.pagination.total).toBe(1);
	});

	it("PATCH archive et crée un audit", async () => {
		activityFindUniqueMock.mockResolvedValue({ id: "act1", status: "PUBLISHED" });
		txMock.activity.findUnique.mockResolvedValue({ id: "act1", title: "A", status: "PUBLISHED" });
		transactionMock.mockImplementation(async (fn: (tx: typeof txMock) => unknown) => fn(txMock));
		const response = await PATCH(
			new Request("http://localhost/api/admin/activities", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ activityId: "act1", archived: true }),
			}),
		);
		expect(response.status).toBe(200);
		expect(txMock.adminAuditLog.create).toHaveBeenCalled();
	});

	it("DELETE gère succès + 400 + 404", async () => {
		txMock.activity.findUnique.mockResolvedValue({ id: "act1", title: "A" });
		transactionMock.mockImplementation(async (fn: (tx: typeof txMock) => unknown) => fn(txMock));
		expect(
			(
				await DELETE(
					new Request("http://localhost/api/admin/activities", {
						method: "DELETE",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ activityId: "act1" }),
					}),
				)
			).status,
		).toBe(200);

		expect(
			(
				await DELETE(
					new Request("http://localhost/api/admin/activities", {
						method: "DELETE",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({}),
					}),
				)
			).status,
		).toBe(400);

		txMock.activity.findUnique.mockResolvedValue(null);
		expect(
			(
				await DELETE(
					new Request("http://localhost/api/admin/activities", {
						method: "DELETE",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ activityId: "missing" }),
					}),
				)
			).status,
		).toBe(404);
	});
});
