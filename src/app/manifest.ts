import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CareTable",
    short_name: "CareTable",
    description: "Thoughtful meal planning for your household.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f5",
    theme_color: "#254c3e",
    lang: "en",
  };
}
