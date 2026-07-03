import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/creators",
          "/clubs",
          "/club-fixtures",
          "/generators",
          "/become-a-creator",
        ],
        disallow: [
          "/admin",
          "/api",
          "/account",
          "/favourites",
          "/sign-in",
          "/create-account",
          "/forgot-password",
        ],
      },
    ],
    sitemap: "https://fansfirstreactions.com/sitemap.xml",
  };
}