import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function normalizeYoutubeUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { youtubeUrl, league, team } = body;

    if (!youtubeUrl || !league || !team) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const cleanYoutubeUrl = normalizeYoutubeUrl(youtubeUrl);

    const { data: existingCreator } = await supabaseAdmin
      .from("creators")
      .select("id")
      .eq("youtube_url", cleanYoutubeUrl)
      .maybeSingle();

    if (existingCreator) {
      return NextResponse.json(
        { error: "This YouTube channel is already listed." },
        { status: 409 }
      );
    }

    const { data: existingPendingSubmission } = await supabaseAdmin
      .from("creator_submissions")
      .select("id")
      .eq("youtube_url", cleanYoutubeUrl)
      .eq("status", "pending")
      .maybeSingle();

    if (existingPendingSubmission) {
      return NextResponse.json(
        { error: "This YouTube channel has already been submitted and is waiting for review." },
        { status: 409 }
      );
    }

    const { error: dbError } = await supabaseAdmin
      .from("creator_submissions")
      .insert([
        {
          youtube_url: cleanYoutubeUrl,
          league,
          team,
          status: "pending",
        },
      ]);

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save submission." },
        { status: 500 }
      );
    }

    await resend.emails.send({
      from: "Fans First Reactions <noreply@fansfirstreactions.com>",
      to: process.env.SUBMIT_TO_EMAIL!,
      subject: "New Creator Submission",
      html: `
        <h2>New Creator Submission</h2>
        <p><strong>YouTube:</strong><br>${cleanYoutubeUrl}</p>
        <p><strong>League:</strong> ${league}</p>
        <p><strong>Team:</strong> ${team}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit route error:", error);

    return NextResponse.json(
      { error: "Failed to send submission." },
      { status: 500 }
    );
  }
}