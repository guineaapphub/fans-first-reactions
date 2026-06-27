const API_KEY = process.env.YOUTUBE_API_KEY;

export async function getChannel(channelId: string) {
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");

  url.searchParams.set("part", "snippet,statistics");
  url.searchParams.set("id", channelId);
  url.searchParams.set("key", API_KEY || "");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch YouTube channel");
  }

  const data = await response.json();

  return data.items?.[0] ?? null;
}
