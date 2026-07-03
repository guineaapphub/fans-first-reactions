"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type CreatorSubmission = {
  id: string;
  youtube_url: string;
  league: string;
  team: string;
  status: string;
};

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [submissions, setSubmissions] = useState<CreatorSubmission[]>([]);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  async function loadSubmissions() {
    const { data, error } = await supabase
      .from("creator_submissions")
      .select("id, youtube_url, league, team, status")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load submissions:", error.message);
      setSubmissions([]);
      return;
    }

    setSubmissions(data || []);
  }

  useEffect(() => {
    async function loadAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/sign-in";
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        window.location.href = "/";
        return;
      }

      await loadSubmissions();

      setAllowed(true);
      setLoading(false);
    }

    loadAdmin();
  }, []);

  async function approveSubmission(id: string) {
    const confirmed = window.confirm(
      "Approve this creator and move them into the live creators database?"
    );

    if (!confirmed) return;

    setActionLoadingId(id);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch("/api/admin/approve-submission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("Approve failed");
      }

      setSubmissions((current) =>
        current.filter((submission) => submission.id !== id)
      );

      alert("✅ Creator approved and moved to live creators.");
    } catch {
      alert("❌ Failed to approve creator.");
    }

    setActionLoadingId(null);
  }

  async function rejectSubmission(id: string) {
    const confirmed = window.confirm(
      "Reject this submission? It will be marked as rejected and removed from pending approvals."
    );

    if (!confirmed) return;

    setActionLoadingId(id);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch("/api/admin/reject-submission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("Reject failed");
      }

      setSubmissions((current) =>
        current.filter((submission) => submission.id !== id)
      );

      alert("✅ Submission rejected.");
    } catch {
      alert("❌ Failed to reject submission.");
    }

    setActionLoadingId(null);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        <p className="text-white/70">Checking admin access...</p>
      </main>
    );
  }

  if (!allowed) return null;

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#67e1f9]">
          Fans First Reactions
        </p>

        <h1 className="mt-4 text-4xl font-black md:text-5xl">Admin Panel</h1>

        <p className="mt-3 max-w-2xl text-white/70">
          Manage creator submissions and site data.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AdminCard
            title="Pending Approvals"
            text={`${submissions.length} submissions waiting`}
          />
          <AdminCard
            title="Creators"
            text="Edit, delete, or feature creators."
          />
          <AdminCard title="Users" text="View registered users." />
          <AdminCard title="Clubs" text="Manage football clubs." />
          <AdminCard title="Leagues" text="Manage leagues." />
        </div>

        <section className="mt-12 rounded-[28px] border border-[#67e1f9]/30 bg-white/5 p-6">
          <h2 className="text-2xl font-black">Pending Creator Approvals</h2>

          {submissions.length === 0 ? (
            <p className="mt-4 text-white/60">
              No creator submissions waiting for review.
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="text-[#67e1f9]">
                  <tr className="border-b border-white/10">
                    <th className="py-3 pr-4">YouTube URL</th>
                    <th className="py-3 pr-4">League</th>
                    <th className="py-3 pr-4">Team</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {submissions.map((submission) => {
                    const isBusy = actionLoadingId === submission.id;

                    return (
                      <tr
                        key={submission.id}
                        className="border-b border-white/10 text-white/80"
                      >
                        <td className="py-4 pr-4">
                          <a
                            href={submission.youtube_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-[#67e1f9] hover:underline"
                          >
                            {submission.youtube_url}
                          </a>
                        </td>

                        <td className="py-4 pr-4">{submission.league}</td>
                        <td className="py-4 pr-4">{submission.team}</td>

                        <td className="py-4 pr-4">
                          <span className="rounded-full border border-yellow-400/40 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">
                            {submission.status}
                          </span>
                        </td>

                        <td className="py-4 pr-4">
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => approveSubmission(submission.id)}
                              disabled={isBusy}
                              className="rounded-full bg-[#67e1f9] px-4 py-2 font-bold text-black disabled:opacity-50"
                            >
                              {isBusy ? "Working..." : "Approve"}
                            </button>

                            <button
                              type="button"
                              onClick={() => rejectSubmission(submission.id)}
                              disabled={isBusy}
                              className="rounded-full border border-red-400/60 px-4 py-2 font-bold text-red-300 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function AdminCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#67e1f9]/30 bg-white/5 p-6">
      <h2 className="text-xl font-black">{title}</h2>
      <p className="mt-2 text-sm text-white/60">{text}</p>
    </div>
  );
}