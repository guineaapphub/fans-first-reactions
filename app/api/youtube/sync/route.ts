import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function cleanText(value: string | null | undefined) {
  const text = String(value ?? "").trim();
  if (!text || text === "NULL" || text === "EMPTY") return null;
  return text;
}

function cleanHandle(value: string | null | undefined) {
  const text = cleanText(value);
  if (!text) return null;
  return text.startsWith("@") ? text : `@${text}`;
}

function getHandleFromUrl(url: string | null | undefined) {
  const text = cleanText(url);
  if (!text) return null;

  const match = text.match(/youtube\.com\/@([^/?#]+)/i);
  return match ? `@${match[1]}` : null;
}

function getChannelIdFromUrl(url: string | null | undefined) {
  const text = cleanText(url);
  if (!text) return null;

  const match = text.match(/youtube\.com\/channel\/([^/?#]+)/i);
  return match?.[1] ?? null;
}

function formatSubscribers(count: string | null | undefined) {
  const raw = cleanText(count);
  if (!raw) return "Not listed";

  const num = Number(raw);
  if (Number.isNaN(num)) return raw;

  if (num >= 1000000) return `${Math.round(num / 100000) / 10}M`;
  if (num >= 1000) return `${Math.round(num / 1000)}K`;

  return String(num);
}

async function youtubeFetch(url: URL) {
  const response = await fetch(url.toString(), { cache: "no-store" });
  const data = await response.json();

  if (!response.ok) {
    return { channel: null, error: data };
  }

  return { channel: data.items?.[0] ?? null, error: null };
}

async function fetchChannelById(channelId: string, apiKey: string) {
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "snippet,statistics,brandingSettings");
  url.searchParams.set("id", channelId);
  url.searchParams.set("key", apiKey);

  return youtubeFetch(url);
}

async function fetchChannelByHandle(handle: string, apiKey: string) {
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "snippet,statistics,brandingSettings");
  url.searchParams.set("forHandle", handle);
  url.searchParams.set("key", apiKey);

  return youtubeFetch(url);
}

async function searchChannelByName(name: string, apiKey: string) {
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", name);
  url.searchParams.set("type", "channel");
  url.searchParams.set("maxResults", "1");
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), { cache: "no-store" });
  const data = await response.json();

  if (!response.ok) return null;

  return data.items?.[0]?.id?.channelId ?? null;
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      success: false,
      error: "Missing YOUTUBE_API_KEY",
    });
  }

  const { data: creators, error } = await supabase
    .from("creators")
    .select(
      "id, name, youtube_url, youtube_handle, youtube_channel_id, avatar_url, subscriber_count, subscribers"
    )
    .limit(1000);

  if (error) {
    return NextResponse.json({ success: false, error });
  }

  const results = [];

  for (const creator of creators || []) {
    const dbChannelId = cleanText(creator.youtube_channel_id);
    const urlChannelId = getChannelIdFromUrl(creator.youtube_url);
    const dbHandle = cleanHandle(creator.youtube_handle);
    const urlHandle = getHandleFromUrl(creator.youtube_url);

    let channel = null;
    let method = "";
    let lookupError = null;

    if (dbChannelId) {
      const result = await fetchChannelById(dbChannelId, apiKey);
      channel = result.channel;
      lookupError = result.error;
      method = "youtube_channel_id";
    }

    if (!channel && urlChannelId) {
      const result = await fetchChannelById(urlChannelId, apiKey);
      channel = result.channel;
      lookupError = result.error;
      method = "channel id from youtube_url";
    }

    if (!channel && dbHandle) {
      const result = await fetchChannelByHandle(dbHandle, apiKey);
      channel = result.channel;
      lookupError = result.error;
      method = "youtube_handle";
    }

    if (!channel && urlHandle) {
      const result = await fetchChannelByHandle(urlHandle, apiKey);
      channel = result.channel;
      lookupError = result.error;
      method = "handle from youtube_url";
    }

    if (!channel && creator.name) {
      const searchedChannelId = await searchChannelByName(creator.name, apiKey);

      if (searchedChannelId) {
        const result = await fetchChannelById(searchedChannelId, apiKey);
        channel = result.channel;
        lookupError = result.error;
        method = "name search fallback";
      }
    }

    if (!channel) {
      results.push({
        name: creator.name,
        updated: false,
        reason: "No channel found",
        tried: {
          dbChannelId,
          urlChannelId,
          dbHandle,
          urlHandle,
        },
        lookupError,
      });
      continue;
    }

    const rawSubscribers = channel.statistics?.subscriberCount ?? null;
    const formattedSubscribers = formatSubscribers(rawSubscribers);

    const realHandle =
      cleanHandle(channel.snippet?.customUrl) ||
      dbHandle ||
      urlHandle ||
      null;

    const updates = {
      youtube_channel_id: channel.id,
      youtube_handle: realHandle,
      youtube_url: realHandle
        ? `https://www.youtube.com/${realHandle}`
        : `https://www.youtube.com/channel/${channel.id}`,
      avatar_url: channel.snippet?.thumbnails?.high?.url ?? null,
      banner_url: channel.brandingSettings?.image?.bannerExternalUrl ?? null,
      subscribers: formattedSubscribers,
      subscriber_count: formattedSubscribers,
      description: channel.snippet?.description ?? null,
    };

    const { error: updateError } = await supabase
      .from("creators")
      .update(updates)
      .eq("id", creator.id);

    results.push({
      name: creator.name,
      method,
      updated: !updateError,
      error: updateError,
      updates,
    });
  }

  return NextResponse.json({
    success: true,
    checked: creators?.length || 0,
    updated: results.filter((r) => r.updated).length,
    failed: results.filter((r) => !r.updated).length,
    results,
  });
}