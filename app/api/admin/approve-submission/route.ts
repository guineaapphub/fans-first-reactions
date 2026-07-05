import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function cleanText(value: string | null | undefined) {
  const text = String(value ?? "").trim();
  if (!text || text === "NULL" || text === "EMPTY") return null;
  return text;
}

function normalizeText(value: string | null | undefined) {
  return cleanText(value)?.toLowerCase() ?? "";
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/@/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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
  if (!raw) return "0";

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

async function markSubmissionApproved(id: string) {
  return supabaseAdmin
    .from("creator_submissions")
    .update({ status: "approved" })
    .eq("id", id);
}

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing id." }, { status: 400 });
    }

    const { data: submission, error: fetchError } = await supabaseAdmin
      .from("creator_submissions")
      .select("id, youtube_url, league, team, status")
      .eq("id", id)
      .single();

    if (fetchError || !submission) {
      return NextResponse.json(
        { error: "Submission not found." },
        { status: 404 }
      );
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    const submittedUrl = cleanText(submission.youtube_url) || "";

    const urlHandle = getHandleFromUrl(submittedUrl);
    const urlChannelId = getChannelIdFromUrl(submittedUrl);

    let channel = null;

    if (apiKey && urlChannelId) {
      const result = await fetchChannelById(urlChannelId, apiKey);
      channel = result.channel;
    }

    if (apiKey && !channel && urlHandle) {
      const result = await fetchChannelByHandle(urlHandle, apiKey);
      channel = result.channel;
    }

    const fallbackHandle = urlHandle ?? "@new-creator";
    const fallbackName = fallbackHandle.replace("@", "");

    const channelHandle = cleanHandle(channel?.snippet?.customUrl) ?? fallbackHandle;
    const channelId = cleanText(channel?.id) ?? urlChannelId;
    const name = channel?.snippet?.title ?? fallbackName;
    const slug = makeSlug(channelHandle || name);

    const rawSubscribers = channel?.statistics?.subscriberCount ?? "0";
    const formattedSubscribers = formatSubscribers(rawSubscribers);

    const youtubeUrl = channelHandle
      ? `https://www.youtube.com/${channelHandle}`
      : submittedUrl;

    const { data: existingCreators, error: duplicateError } = await supabaseAdmin
      .from("creators")
      .select("id, youtube_url, youtube_handle, youtube_channel_id, slug")
      .limit(5000);

    if (duplicateError) {
      return NextResponse.json(
        { error: duplicateError.message },
        { status: 500 }
      );
    }

    const normalizedSubmittedUrl = normalizeText(submittedUrl);
    const normalizedYoutubeUrl = normalizeText(youtubeUrl);
    const normalizedHandle = normalizeText(channelHandle);
    const normalizedChannelId = cleanText(channelId) || "";
    const normalizedSlug = normalizeText(slug);

    const duplicate = (existingCreators || []).find((creator) => {
      const creatorUrl = normalizeText(creator.youtube_url);
      const creatorHandle = normalizeText(creator.youtube_handle);
      const creatorChannelId = cleanText(creator.youtube_channel_id) || "";
      const creatorSlug = normalizeText(creator.slug);

      return (
        (!!creatorUrl &&
          (creatorUrl === normalizedYoutubeUrl ||
            creatorUrl === normalizedSubmittedUrl)) ||
        (!!creatorHandle && creatorHandle === normalizedHandle) ||
        (!!creatorChannelId &&
          !!normalizedChannelId &&
          creatorChannelId === normalizedChannelId) ||
        (!!creatorSlug && creatorSlug === normalizedSlug)
      );
    });

    if (duplicate) {
      const { error: updateError } = await markSubmissionApproved(id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        duplicate: true,
        message: "Creator already exists. Submission marked as approved.",
      });
    }

    const { error: insertError } = await supabaseAdmin.from("creators").insert({
      slug,
      name,
      club: submission.team,
      league: submission.league,
      youtube_url: youtubeUrl,
      youtube_handle: channelHandle,
      youtube_channel_id: channelId,
      status: "approved",
      featured: false,
      subscribers: formattedSubscribers,
      subscriber_count: formattedSubscribers,
      description: channel?.snippet?.description ?? "",
      avatar_url: channel?.snippet?.thumbnails?.high?.url ?? "",
      banner_url: channel?.brandingSettings?.image?.bannerExternalUrl ?? "",
      upload_frequency: "",
      country: "",
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const { error: updateError } = await markSubmissionApproved(id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Approval failed." }, { status: 500 });
  }
}