import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CareTable",
    short_name: "CareTable",
    description: "Thoughtful meal planning for your household.",
    start_url: "/",
    display: "standalone",
    background_color: "#10212b",
    theme_color: "#10212b",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
    lang: "en",
  };
}
