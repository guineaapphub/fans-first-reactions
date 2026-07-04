"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Creator = {
  id: string;
  name: string | null;
  slug: string | null;
  club: string | null;
  country: string | null;
  subscriber_count?: string | null;
  subscribers?: string | null;
  avatar_url: string | null;
  banner_url?: string | null;
  description?: string | null;
  league: string | null;
};

function numberValue(value: string | null | undefined) {
  return Number(String(value || "0").replace(/[^0-9]/g, "")) || 0;
}

function cleanText(value: string | null | undefined, fallback = "Unknown") {
  return value?.trim() || fallback;
}

function normaliseLeague(league: string | null | undefined) {
  const value = (league || "").trim().toLowerCase();

  if (
    value === "spl" ||
    value === "spfl" ||
    value === "scottish league" ||
    value === "scottish premiership"
  ) {
    return "Scottish Premiership";
  }

  if (value === "premier league") return "Premier League";
  if (value === "championship") return "Championship";
  if (value === "league one") return "League One";
  if (value === "league two") return "League Two";
  if (value === "la liga") return "La Liga";
  if (value === "serie a") return "Serie A";
  if (value === "bundesliga") return "Bundesliga";
  if (value === "ligue 1") return "Ligue 1";

  return league?.trim() || "Other";
}

function getSubscribers(creator: Creator) {
  return creator.subscribers || creator.subscriber_count || "Not listed";
}

export default function CreatorsPage() {
  const router = useRouter();

  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeague, setSelectedLeague] = useState("All Leagues");
  const [selectedClub, setSelectedClub] = useState("All Clubs");
  const [sortMode, setSortMode] = useState<"subs" | "az">("subs");
  const [showSignupNotice, setShowSignupNotice] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchCreators();
  }, []);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsSignedIn(!!user);
    }

    checkUser();
  }, []);

  async function fetchCreators() {
    const { data, error } = await supabase
      .from("creators")
      .select("*")
      .order("name");

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setCreators((data || []) as Creator[]);
    setLoading(false);
  }

  const fixedCreators = useMemo(() => {
    return creators
      .filter((creator) => cleanText(creator.name, "") && cleanText(creator.slug, ""))
      .map((creator) => ({
        ...creator,
        name: cleanText(creator.name, "Unknown Creator"),
        slug: cleanText(creator.slug, ""),
        club: cleanText(creator.club, "Unknown"),
        league: normaliseLeague(creator.league),
      }));
  }, [creators]);

  const leagueCounts = useMemo(() => {
    const counts: Record<string, number> = {
      "All Leagues": fixedCreators.length,
      "Premier League": 0,
      Championship: 0,
      "League One": 0,
      "League Two": 0,
      "Scottish Premiership": 0,
      "La Liga": 0,
      "Serie A": 0,
      Bundesliga: 0,
      "Ligue 1": 0,
      Other: 0,
    };

    fixedCreators.forEach((creator) => {
      const league = creator.league || "Other";
      counts[league] = (counts[league] || 0) + 1;
    });

    return counts;
  }, [fixedCreators]);

  const leagues = [
    "All Leagues",
    "Premier League",
    "Championship",
    "League One",
    "League Two",
    "Scottish Premiership",
    "La Liga",
    "Serie A",
    "Bundesliga",
    "Ligue 1",
    "Other",
  ];

  const topClubs = useMemo(() => {
    const counts: Record<string, number> = {};

    fixedCreators.forEach((creator) => {
      const club = cleanText(creator.club, "Unknown");
      counts[club] = (counts[club] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [fixedCreators]);

  const filteredCreators = useMemo(() => {
    let list = [...fixedCreators];

    if (selectedLeague !== "All Leagues") {
      list = list.filter((creator) => creator.league === selectedLeague);
    }

    if (selectedClub !== "All Clubs") {
      list = list.filter(
        (creator) => cleanText(creator.club, "Unknown") === selectedClub
      );
    }

    if (sortMode === "az") {
      list.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    } else {
      list.sort(
        (a, b) => numberValue(getSubscribers(b)) - numberValue(getSubscribers(a))
      );
    }

    return list;
  }, [fixedCreators, selectedLeague, selectedClub, sortMode]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020817] p-10 text-white">
        Loading creators...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="border-b border-white/10 px-8 py-16">
        <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-[#67e1f9]">
          Database
        </p>

        <h1 className="text-5xl font-black">Creator Directory</h1>

        <p className="mt-4 text-xl text-[#67e1f9]">
          {filteredCreators.length} creators shown / {fixedCreators.length} indexed
        </p>
      </section>

      <section className="grid gap-8 px-8 py-10 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-white/10 bg-[#081028] p-4">
          {leagues.map((league) => (
            <button
              key={league}
              onClick={() => {
                setSelectedLeague(league);
                setSelectedClub("All Clubs");
              }}
              className={`mb-2 flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left font-black transition ${
                selectedLeague === league
                  ? "bg-[#67e1f9] text-black"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <span>{league}</span>
              <span>{leagueCounts[league] || 0}</span>
            </button>
          ))}
        </aside>

        <div>
          <div className="mb-8 rounded-3xl border border-white/10 bg-[#081028] p-5">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setSortMode("subs")}
                className={`rounded-full px-6 py-3 font-black ${
                  sortMode === "subs"
                    ? "bg-[#67e1f9] text-black"
                    : "border border-white/20 text-white"
                }`}
              >
                📈 Most Subs
              </button>

              <button
                onClick={() => setSortMode("az")}
                className={`rounded-full px-6 py-3 font-black ${
                  sortMode === "az"
                    ? "bg-[#67e1f9] text-black"
                    : "border border-white/20 text-white"
                }`}
              >
                A–Z
              </button>

              <button
                onClick={() => {
                  if (isSignedIn) {
                    router.push("/favourites");
                  } else {
                    setShowSignupNotice(true);
                  }
                }}
                className="rounded-full border border-white/20 px-6 py-3 font-black text-white hover:border-[#67e1f9] hover:text-[#67e1f9]"
              >
                ★ Favorites
              </button>

              {isSignedIn && (
                <Link
                  href="/account"
                  className="rounded-full border border-white/20 px-6 py-3 font-black text-white hover:border-[#67e1f9] hover:text-[#67e1f9]"
                >
                  👤 Account
                </Link>
              )}
            </div>
          </div>

          <h2 className="mb-6 text-2xl font-black">Top Clubs</h2>

          <div className="mb-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {topClubs.map(([club, count]) => (
              <button
                key={club}
                onClick={() => {
                  setSelectedClub(club);
                  setSelectedLeague("All Leagues");
                }}
                className={`rounded-3xl border p-6 text-left transition ${
                  selectedClub === club
                    ? "border-[#67e1f9] bg-[#67e1f9] text-black"
                    : "border-[#122347] bg-[#081028] text-white hover:border-[#67e1f9]"
                }`}
              >
                <h3 className="text-xl font-black">{club}</h3>
                <p className="mt-2">{count} creators</p>
              </button>
            ))}
          </div>

          <h2 className="mb-6 text-2xl font-black">
            {selectedClub !== "All Clubs"
              ? `${selectedClub} Creators`
              : selectedLeague === "All Leagues"
              ? "All Creators"
              : selectedLeague}
          </h2>

          {filteredCreators.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-[#081028] p-8">
              <h3 className="text-2xl font-black">No creators found yet</h3>
              <p className="mt-2 text-gray-400">
                This league or club exists, but there are no creators saved for it in Supabase yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredCreators.map((creator) => {
                const hasAvatar = creator.avatar_url && !brokenImages[creator.id];

                return (
                  <Link
                    key={creator.id}
                    href={`/creators/${creator.slug}`}
                    className="rounded-3xl border border-[#122347] bg-[#081028] p-6 text-white no-underline transition hover:border-[#67e1f9]"
                  >
                    {hasAvatar ? (
                      <img
                        src={creator.avatar_url || ""}
                        alt={creator.name || "Creator"}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setBrokenImages((prev) => ({
                            ...prev,
                            [creator.id]: true,
                          }))
                        }
                        className="mb-5 h-20 w-20 rounded-full border border-white/10 bg-white object-cover"
                      />
                    ) : (
                      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white text-xs font-black text-gray-400">
                        200 × 200
                      </div>
                    )}

                    <h3 className="text-2xl font-black">{creator.name}</h3>
                    <p className="mt-2 text-gray-400">{creator.club}</p>
                    <p className="mt-2 text-sm text-gray-500">{creator.league}</p>

                    <p className="mt-4 font-black text-[#67e1f9]">
                      {getSubscribers(creator)} subscribers
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {showSignupNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
          <div className="max-w-md rounded-3xl border border-[#67e1f9]/50 bg-[#081028] p-8 text-center">
            <h2 className="text-3xl font-black">Sign in to use Favorites</h2>
            <p className="mt-4 text-gray-400">
              Favorites are available for users who sign in with an email address.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/sign-in"
                className="rounded-full bg-[#67e1f9] px-6 py-3 font-black text-black"
              >
                Sign In
              </Link>

              <button
                onClick={() => setShowSignupNotice(false)}
                className="rounded-full border border-white/20 px-6 py-3 font-black text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}