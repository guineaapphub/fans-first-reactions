import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "snippet,statistics");
  url.searchParams.set("id", "UCnU7ly6zEcQxUScjhkgFYAQ");
  url.searchParams.set("key", apiKey || "");

  const response = await fetch(url.toString());
  const data = await response.json();

  return NextResponse.json(data.items?.[0]);
}