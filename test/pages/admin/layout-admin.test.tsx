import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { redirectMock, getServerSessionMock } = vi.hoisted(
	() => ({
		redirectMock: vi.fn(),
		getServerSessionMock: vi.fn(),
	}),
);

vi.mock("next/navigation", () => ({
	redirect: redirectMock,
}));

vi.mock("next-auth/next", () => ({
	getServerSession: getServerSessionMock,
}));

vi.mock(
	"@/components/back-office/layout/back-office-header",
	() => ({
		BackOfficeHeader: ({
			adminName,
		}: {
			adminName: string;
		}) => <div>Header admin: {adminName}</div>,
	}),
);

vi.mock("@/components/back-office/layout/back-office-nav", () => ({
	BackOfficeNav: () => <div>Navigation admin</div>,
}));

import BackOfficeLayout from "@/app/(back-office)/layout";

describe("Layout back-office (admin connecté)", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		redirectMock.mockImplementation((url: string) => {
			throw new Error(`REDIRECT:${url}`);
		});
	});

	it("affiche la page admin sans redirection", async () => {
		getServerSessionMock.mockResolvedValue({
			user: {
				id: "admin-id",
				role: "ADMIN",
				name: "Alice Admin",
			},
		});

		const element = await BackOfficeLayout({
			children: <div>Contenu admin</div>,
		});
		const html = renderToStaticMarkup(element);

		expect(redirectMock).not.toHaveBeenCalled();
		expect(html).toContain("Administration");
		expect(html).toContain("Header admin: Alice Admin");
		expect(html).toContain("Contenu admin");
	});

	it("redirige vers login si non connecté", async () => {
		getServerSessionMock.mockResolvedValue(null);

		await expect(
			BackOfficeLayout({
				children: <div>Contenu admin</div>,
			}),
		).rejects.toThrow(
			"REDIRECT:/auth/login?callbackUrl=/admin/dashboard",
		);
	});

	it("redirige vers profil si utilisateur non admin", async () => {
		getServerSessionMock.mockResolvedValue({
			user: {
				id: "user-id",
				role: "USER",
				name: "User",
			},
		});

		await expect(
			BackOfficeLayout({
				children: <div>Contenu admin</div>,
			}),
		).rejects.toThrow("REDIRECT:/profil");
	});
});
