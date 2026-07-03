import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/@/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getHandleFromUrl(url: string) {
  const match = url.match(/youtube\.com\/@([^/?]+)/i);
  return match ? match[1] : "new-creator";
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
      return NextResponse.json({ error: "Submission not found." }, { status: 404 });
    }

    const handle = getHandleFromUrl(submission.youtube_url);
    const slug = makeSlug(handle);

    const { data: existingCreator } = await supabaseAdmin
      .from("creators")
      .select("id")
      .eq("youtube_url", submission.youtube_url)
      .maybeSingle();

    if (!existingCreator) {
      const { error: insertError } = await supabaseAdmin.from("creators").insert({
        slug,
        name: handle,
        club: submission.team,
        league: submission.league,
        youtube_url: submission.youtube_url,
        youtube_handle: handle,
        status: "approved",
        featured: false,
        subscribers: "0 subscribers",
        subscriber_count: "0",
        description: "",
        avatar_url: "",
        banner_url: "",
        upload_frequency: "",
        country: "",
      });

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    const { error: updateError } = await supabaseAdmin
      .from("creator_submissions")
      .update({ status: "approved" })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Approval failed." }, { status: 500 });
  }
}