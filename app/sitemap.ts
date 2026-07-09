import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://fansfirstreactions.com";
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/creators`, lastModified, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/clubs`, lastModified, changeFrequency: "daily", priority: 0.95 },
    { url: `${baseUrl}/club-fixtures`, lastModified, changeFrequency: "hourly", priority: 0.95 },
    { url: `${baseUrl}/generators`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/become-a-creator`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/submit`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/cookies`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/copyright`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/create-account`, lastModified, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/sign-in`, lastModified, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/forgot-password`, lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/reset-password`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];

  const { data: creators } = await supabase
    .from("creators")
    .select("slug")
    .not("slug", "is", null);

  const creatorRoutes: MetadataRoute.Sitemap =
    creators
      ?.filter((creator) => creator.slug)
      .map((creator) => ({
        url: `${baseUrl}/creators/${creator.slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.85,
      })) || [];

  const { data: clubs } = await supabase
    .from("clubs")
    .select("slug")
    .not("slug", "is", null);

  const clubRoutes: MetadataRoute.Sitemap =
    clubs
      ?.filter((club) => club.slug)
      .map((club) => ({
        url: `${baseUrl}/clubs/${club.slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.85,
      })) || [];

  return [...staticRoutes, ...creatorRoutes, ...clubRoutes];
}