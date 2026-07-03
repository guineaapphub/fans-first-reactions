"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Club = {
  name: string;
  league: string | null;
};

const MULTI_CLUB = "Multi-Club / Other";

const leagueOrder = [
  MULTI_CLUB,
  "Premier League",
  "Championship",
  "League One",
  "League Two",
  "Scottish Premiership",
  "Bundesliga",
  "La Liga",
  "Serie A",
  "Ligue 1",
];

function cleanText(value: string | null) {
  return (value || "").trim();
}

export default function SubmitPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [league, setLeague] = useState("");
  const [team, setTeam] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadClubs() {
      const { data, error } = await supabase
        .from("clubs")
        .select("name, league")
        .order("league", { ascending: true })
        .order("name", { ascending: true });

      if (error) {
        console.error("Failed to load clubs:", error.message);
        return;
      }

      setClubs(data || []);
    }

    loadClubs();
  }, []);

  const cleanedClubs = useMemo(() => {
    const seen = new Set<string>();

    return clubs
      .map((club) => ({
        name: cleanText(club.name),
        league: cleanText(club.league),
      }))
      .filter((club) => club.name && club.league)
      .filter((club) => {
        const key = `${club.league.toLowerCase()}__${club.name.toLowerCase()}`;

        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      });
  }, [clubs]);

  const leagues = useMemo(() => {
    const availableLeagues = new Set<string>();

    availableLeagues.add(MULTI_CLUB);

    cleanedClubs.forEach((club) => {
      if (club.league) {
        availableLeagues.add(club.league);
      }
    });

    return leagueOrder.filter((item) => availableLeagues.has(item));
  }, [cleanedClubs]);

  const teams = useMemo(() => {
    if (league === MULTI_CLUB) {
      return [MULTI_CLUB];
    }

    return cleanedClubs
      .filter((club) => club.league.toLowerCase() === league.toLowerCase())
      .map((club) => club.name)
      .sort();
  }, [cleanedClubs, league]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          youtubeUrl,
          league,
          team,
        }),
      });

      if (!res.ok) {
        throw new Error();
      }

      alert("✅ Submission sent successfully!");

      setYoutubeUrl("");
      setLeague("");
      setTeam("");
    } catch {
      alert("❌ Failed to send submission.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 bg-[#05070a]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
          <Link href="/creators" className="font-bold text-[#67e1f9]">
            ← Back to Creators
          </Link>

          <p className="mt-10 text-sm font-bold uppercase tracking-[0.5em] text-[#67e1f9]">
            Community
          </p>

          <h1 className="mt-4 text-5xl font-black md:text-7xl">
            Submit a Creator
          </h1>

          <p className="mt-5 max-w-3xl text-xl text-gray-400">
            Know a great football reaction channel? Suggest them for the Fans
            First Reactions database.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-14 md:px-12">
        <div className="overflow-hidden rounded-[36px] border border-[#67e1f9]/30 bg-[#0c1020]">
          <div className="border-b border-white/10 p-8">
            <h2 className="text-3xl font-black">Creator Details</h2>
            <p className="mt-2 text-gray-400">
              Submissions are reviewed manually before being added.
            </p>
          </div>

          <form className="space-y-6 p-8" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-[0.25em] text-[#67e1f9]">
                YouTube Channel URL
              </label>

              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/@channelname"
                className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-gray-600 focus:border-[#67e1f9]"
                required
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-[0.25em] text-[#67e1f9]">
                  League
                </label>

                <select
                  value={league}
                  onChange={(e) => {
                    const selectedLeague = e.target.value;
                    setLeague(selectedLeague);
                    setTeam(selectedLeague === MULTI_CLUB ? MULTI_CLUB : "");
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-[#67e1f9]"
                  required
                >
                  <option value="">
                    {clubs.length === 0
                      ? "Loading leagues..."
                      : "Select league..."}
                  </option>

                  {leagues.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-[0.25em] text-[#67e1f9]">
                  Team
                </label>

                <select
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-[#67e1f9] disabled:cursor-not-allowed disabled:opacity-60"
                  required
                  disabled={!league}
                >
                  <option value="">
                    {!league ? "Select league first..." : "Select team..."}
                  </option>

                  {teams.map((teamName) => (
                    <option key={teamName} value={teamName}>
                      {teamName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#67e1f9] py-4 text-lg font-black text-black disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit For Review"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}