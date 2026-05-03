import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cesizen — Bien-être",
    short_name: "Cesizen",
    description:
      "Cesizen — la plateforme pour se ressourcer et s'apaiser ensemble.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    orientation: "portrait",
    categories: ["health", "lifestyle", "mental-health", "stress-management"],
    icons: [
      {
        src: "/img/logo-small-bg-white-192px.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/img/logo-small-bg-white-192px.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/img/logo-full-bg-white-1000px.png",
        sizes: "1000x1000",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
