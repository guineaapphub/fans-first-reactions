import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fans First Reactions",
    short_name: "F1R",
    description:
      "Discover football fan reaction creators, supporter channels, club fixtures and YouTube tools.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#67e1f9",
    orientation: "portrait",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}