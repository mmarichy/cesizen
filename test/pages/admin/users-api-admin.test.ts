import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";

const { requireAdminSessionMock, transactionMock, userFindUniqueMock, hashMock, txMock } = vi.hoisted(
	() => ({
		requireAdminSessionMock: vi.fn(),
		transactionMock: vi.fn(),
		userFindUniqueMock: vi.fn(),
		hashMock: vi.fn(),
		txMock: {
			user: {
				findUnique: vi.fn(),
				create: vi.fn(),
				update: vi.fn(),
				delete: vi.fn(),
			},
			adminAuditLog: { create: vi.fn() },
		},
	}),
);

vi.mock("@/lib/admin/require-admin-session", () => ({ requireAdminSession: requireAdminSessionMock }));
vi.mock("bcrypt", () => ({ default: { hash: hashMock } }));
vi.mock("@/lib/prisma", () => ({
	prisma: {
		$transaction: transactionMock,
		user: { findMany: vi.fn(), count: vi.fn(), findUnique: userFindUniqueMock },
	},
}));

import { DELETE, GET, PATCH, POST } from "@/app/api/admin/users/route";

describe("API admin users (essentiel)", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		requireAdminSessionMock.mockResolvedValue({
			session: { user: { id: "admin-id", email: "admin@test.local", role: "ADMIN" } },
			response: null,
		});
	});

	it("retourne 401/403 si accès refusé", async () => {
		requireAdminSessionMock.mockResolvedValueOnce({ session: null, response: NextResponse.json({}, { status: 401 }) });
		expect((await GET(new Request("http://localhost/api/admin/users"))).status).toBe(401);

		requireAdminSessionMock.mockResolvedValueOnce({ session: null, response: NextResponse.json({}, { status: 403 }) });
		expect((await GET(new Request("http://localhost/api/admin/users"))).status).toBe(403);
	});

	it("GET renvoie pagination", async () => {
		transactionMock.mockResolvedValue([[{ id: "u1", firstname: "A", lastname: "B", email: "a@b.c", phone: null, role: "ADMIN", status: "ACTIVE", createdAt: new Date() }], 1]);
		const response = await GET(new Request("http://localhost/api/admin/users?page=1&limit=20"));
		const body = await response.json();
		expect(response.status).toBe(200);
		expect(body.pagination.total).toBe(1);
	});

	it("POST crée un user, ou retourne 409 si déjà existant", async () => {
		userFindUniqueMock.mockResolvedValueOnce(null);
		hashMock.mockResolvedValue("hashed");
		txMock.user.create.mockResolvedValue({
			id: "u2",
			firstname: "Bob",
			lastname: "User",
			email: "bob@cesizen.local",
			phone: "+33600000000",
			role: "USER",
			status: "ACTIVE",
			createdAt: new Date(),
		});
		transactionMock.mockImplementation(async (fn: (tx: typeof txMock) => unknown) => fn(txMock));
		const ok = await POST(
			new Request("http://localhost/api/admin/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: "bob@cesizen.local",
					password: "Test1234!",
					confirmPassword: "Test1234!",
					firstName: "Bob",
					lastName: "User",
					phone: "0600000000",
					role: "USER",
				}),
			}),
		);
		expect(ok.status).toBe(201);
		expect(txMock.adminAuditLog.create).toHaveBeenCalled();

		userFindUniqueMock.mockResolvedValueOnce({ id: "u1" });
		const exists = await POST(
			new Request("http://localhost/api/admin/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: "existing@cesizen.local",
					password: "Test1234!",
					confirmPassword: "Test1234!",
					firstName: "A",
					lastName: "B",
					phone: "0600000000",
				}),
			}),
		);
		expect(exists.status).toBe(409);
	});

	it("PATCH met à jour, ou retourne 400/404 sur erreurs", async () => {
		txMock.user.findUnique.mockResolvedValue({
			id: "u2",
			firstname: "Bob",
			lastname: "User",
			email: "bob@cesizen.local",
			phone: "+33600000000",
			role: "USER",
			status: "ACTIVE",
			createdAt: new Date(),
		});
		txMock.user.update.mockResolvedValue({
			id: "u2",
			firstname: "Bob",
			lastname: "User",
			email: "bob@cesizen.local",
			phone: "+33600000000",
			role: "ADMIN",
			status: "ACTIVE",
			createdAt: new Date(),
		});
		transactionMock.mockImplementation(async (fn: (tx: typeof txMock) => unknown) => fn(txMock));
		expect(
			(
				await PATCH(
					new Request("http://localhost/api/admin/users", {
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ userId: "u2", role: "ADMIN" }),
					}),
				)
			).status,
		).toBe(200);

		expect(
			(
				await PATCH(
					new Request("http://localhost/api/admin/users", {
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ role: "ADMIN" }),
					}),
				)
			).status,
		).toBe(400);

		txMock.user.findUnique.mockResolvedValue(null);
		expect(
			(
				await PATCH(
					new Request("http://localhost/api/admin/users", {
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ userId: "missing", role: "ADMIN" }),
					}),
				)
			).status,
		).toBe(404);
	});

	it("DELETE supprime, ou retourne 400/404 sur erreurs", async () => {
		txMock.user.findUnique.mockResolvedValue({ id: "u2", email: "u2@x.y" });
		transactionMock.mockImplementation(async (fn: (tx: typeof txMock) => unknown) => fn(txMock));
		expect(
			(
				await DELETE(
					new Request("http://localhost/api/admin/users", {
						method: "DELETE",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ userId: "u2" }),
					}),
				)
			).status,
		).toBe(200);

		expect(
			(
				await DELETE(
					new Request("http://localhost/api/admin/users", {
						method: "DELETE",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({}),
					}),
				)
			).status,
		).toBe(400);

		txMock.user.findUnique.mockResolvedValue(null);
		expect(
			(
				await DELETE(
					new Request("http://localhost/api/admin/users", {
						method: "DELETE",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ userId: "missing" }),
					}),
				)
			).status,
		).toBe(404);
	});
});
