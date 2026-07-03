import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

    const { error: dbError } = await supabaseAdmin
      .from("creator_submissions")
      .insert([
        {
          youtube_url: youtubeUrl,
          league,
          team,
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
        <p><strong>YouTube:</strong><br>${youtubeUrl}</p>
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