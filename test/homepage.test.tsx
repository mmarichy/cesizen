import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/home-stats", () => ({
  getHomeStats: vi.fn().mockResolvedValue([
    {
      label: "Articles",
      value: "12",
      gradient: "from-emerald-500 to-green-500",
      icon: () => null,
    },
  ]),
}));

import Page from "@/app/(front-office)/page";

describe("Page d'accueil", () => {
  it("affiche le hero principal", async () => {
    const element = await Page();
    const html = renderToStaticMarkup(element);

    expect(html).toContain("Cultivez votre");
    expect(html).toContain("sérénité");
  });

  it("affiche les statistiques de la home", async () => {
    const element = await Page();
    const html = renderToStaticMarkup(element);

    expect(html).toContain("Articles");
    expect(html).toContain("12");
  });
});
