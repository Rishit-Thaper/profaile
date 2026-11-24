import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Profaile — Your personal portfolio",
    short_name: "Profaile",
    description: "Create a personal portfolio and share a card that feels like you.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/pwa-icon-192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-icon-192", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
