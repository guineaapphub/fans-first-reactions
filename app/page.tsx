"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Creator = {
  id: string;
  slug: string | null;
  name: string | null;
  club: string | null;
  league: string | null;
  country: string | null;
  subscribers: string | null;
  subscriber_count: string | null;
  description: string | null;
  youtube_url: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  featured: boolean | null;
  status: string | null;
};

type Fixture = {
  id: string;
  home_team?: string | null;
  away_team?: string | null;
  home?: string | null;
  away?: string | null;
  league?: string | null;
  match_date?: string | null;
  fixture_date?: string | null;
  date?: string | null;
};

function makeSlug(value: string | null) {
  return (value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function subscriberNumber(value?: string | null) {
  if (!value) return 0;
  const clean = value.toUpperCase().replace(/,/g, "").trim();
  if (clean.endsWith("M")) return Number(clean.replace("M", "")) * 1000000;
  if (clean.endsWith("K")) return Number(clean.replace("K", "")) * 1000;
  return Number(clean) || 0;
}

function displaySubs(creator: Creator) {
  return creator.subscriber_count || creator.subscribers || "Not listed";
}

function creatorHref(creator: Creator) {
  return creator.slug ? `/creators/${creator.slug}` : creator.youtube_url || "/creators";
}

function safeText(value?: string | null) {
  return value && value.trim() ? value : "Football fan reaction creator.";
}
function countryFlag(country?: string | null) {
  if (!country) return null;

  const flags: Record<string, string> = {
    Australia: "au",
    Belgium: "be",
    Canada: "ca",
    Colombia: "co",
    England: "gb-eng",
    France: "fr",
    Germany: "de",
    India: "in",
    Indonesia: "id",
    Ireland: "ie",
    Italy: "it",
    Jordan: "jo",
    Latvia: "lv",
    Nigeria: "ng",
    Scotland: "gb-sct",
    "South Korea": "kr",
    Spain: "es",
    Sweden: "se",
    Uganda: "ug",
    USA: "us",
  };

  const code = flags[country];

  return code ? `/flags/${code}.svg` : null;
}
export default function Home() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadData() {
      const { data: creatorsData } = await supabase
        .from("creators")
        .select(
          "id, slug, name, club, league, country, subscribers, subscriber_count, description, youtube_url, avatar_url, banner_url, featured, status"
        )
        .limit(1000);

      if (creatorsData) {
        setCreators(creatorsData as Creator[]);
      }

      const { data: fixturesData } = await supabase
        .from("fixtures")
        .select("*")
        .limit(3);

      if (fixturesData) {
        setFixtures(fixturesData as Fixture[]);
      }
    }

    loadData();
  }, []);

  const filteredCreators = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return [];

    return creators.filter((creator) =>
      [
        creator.name,
        creator.club,
        creator.league,
        creator.country,
        creator.description,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [creators, search]);

  const featuredCreators = useMemo(() => {
    const featured = creators.filter((creator) => creator.featured);
    const source = featured.length ? featured : creators;

    return [...source]
      .sort((a, b) => subscriberNumber(displaySubs(b)) - subscriberNumber(displaySubs(a)))
      .slice(0, 6);
  }, [creators]);

  const allClubs = useMemo(() => {
    const map = new Map<string, { name: string; count: number }>();

    creators.forEach((creator) => {
      const name = creator.club?.trim();
      if (!name) return;

      const slug = makeSlug(name);

      if (!map.has(slug)) {
        map.set(slug, { name, count: 0 });
      }

      map.get(slug)!.count += 1;
    });

    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [creators]);

  const topClubs = allClubs.slice(0, 8);

  const leaguesCount = useMemo(() => {
    return new Set(
      creators
        .map((creator) => creator.league?.trim())
        .filter(Boolean)
    ).size;
  }, [creators]);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-4 py-20 text-center md:px-6">
        <p className="mb-6 text-sm tracking-[0.45em] text-[#67e1f9] md:text-base">
          FOOTBALL CREATOR HUB
        </p>

        <h1 className="text-4xl font-black leading-tight md:text-7xl">
          Find football fan reaction creators for every matchday
        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-base text-zinc-400 md:text-lg">
          Discover football fan channels, browse creators by club, and connect with football
          communities across every league.
        </p>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-10 w-full max-w-4xl rounded-full border-4 border-[#67e1f9] bg-white px-6 py-4 text-black outline-none md:px-8 md:py-5"
          placeholder="Search creators, clubs, fixtures, or leagues..."
        />
      </section>

      <section className="grid grid-cols-2 border-y border-white/10 md:grid-cols-4">
        {[
          [String(creators.length), "Creators Indexed"],
          [String(allClubs.length), "Clubs Covered"],
          [String(leaguesCount), "Leagues"],
          ["Matchday", "Creators"],
        ].map(([big, small]) => (
          <div key={small} className="border-white/10 p-6 text-center md:border-r md:p-8">
            <h3 className="text-3xl font-black text-[#67e1f9] md:text-4xl">{big}</h3>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-500 md:text-xs">
              {small}
            </p>
          </div>
        ))}
      </section>

      {search && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <h2 className="mb-8 text-3xl font-black md:text-4xl">Search Results</h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCreators.slice(0, 12).map((creator) => (
              <Link
                key={creator.id}
                href={creatorHref(creator)}
                className="rounded-3xl border border-[#67e1f9]/30 bg-[#0c1020] p-6 transition hover:border-[#67e1f9]"
              >
               <h3 className="text-xl font-black">{creator.name}</h3>

<div className="mt-2 flex items-center gap-2 text-zinc-400">
  <p>{creator.club}</p>

  {creator.country && countryFlag(creator.country) && (
    <img
      src={countryFlag(creator.country) || ""}
      alt={creator.country}
      className="h-4 w-auto"
    />
  )}
</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-black md:text-4xl">Featured Creators</h2>
          <Link className="font-bold text-[#67e1f9]" href="/creators">
            View all →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCreators.map((creator) => (
            <Link
              key={creator.id}
              href={creatorHref(creator)}
              className="overflow-hidden rounded-3xl border border-white/10 bg-[#0c1020] transition hover:border-[#67e1f9]"
            >
              <div className="flex h-48 items-center justify-center bg-gradient-to-br from-[#10192f] to-black">
                {creator.avatar_url ? (
                  <img
                    src={creator.avatar_url}
                    alt={creator.name || "Creator"}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#67e1f9] text-3xl font-black text-black">
                    {creator.name?.[0] || "?"}
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-black">{creator.name}</h3>

<div className="mt-1 flex items-center gap-2 text-gray-400">
  <p>{creator.club}</p>

  {creator.country && (
    <img
      src={countryFlag(creator.country) || ""}
      alt={creator.country}
      className="h-4 w-auto"
    />
  )}
</div>
                <p className="mt-6 text-xl font-black text-[#67e1f9]">
                  {displaySubs(creator)} subscribers
                </p>

                <p className="mt-4 line-clamp-2 text-gray-300">
                  {safeText(creator.description)}
                </p>

                <div className="mt-8 rounded-2xl bg-[#67e1f9] py-4 text-center font-black text-black">
                  Visit Channel
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 rounded-3xl bg-[#67e1f9] p-8 text-black md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-2xl font-black">Know a great football content creator?</h3>
            <p className="mt-2 text-black/70">Help grow the football creator database.</p>
          </div>
          <Link
            href="/submit"
            className="rounded-full bg-black px-8 py-4 text-center font-bold text-[#67e1f9]"
          >
            + Suggest a Creator
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-black md:text-4xl">Browse by Club</h2>
          <Link className="font-bold text-[#67e1f9]" href="/clubs">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
          {topClubs.map((club) => (
            <Link
              key={club.name}
              href={`/creators?club=${encodeURIComponent(club.name)}`}
              className="rounded-3xl border border-white/10 bg-[#0c1020] p-6 transition hover:-translate-y-1 hover:border-[#67e1f9]"
            >
              <h3 className="mb-2 text-xl font-bold md:text-2xl">{club.name}</h3>
              <p className="text-base text-gray-400 md:text-lg">{club.count} creators</p>
            </Link>
          ))}
        </div>
      </section>

      {fixtures.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-black md:text-4xl">
              Club Fixtures → Matchday Creators
            </h2>
            <Link href="/club-fixtures" className="font-bold text-[#67e1f9]">
              View fixtures →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {fixtures.map((fixture) => {
              const home = fixture.home_team || fixture.home || "Home";
              const away = fixture.away_team || fixture.away || "Away";
              const date = fixture.match_date || fixture.fixture_date || fixture.date;

              return (
                <Link
                  key={fixture.id}
                  href="/club-fixtures"
                  className="rounded-3xl border border-[#67e1f9]/30 bg-[#070b1f] p-8 transition hover:border-[#67e1f9]"
                >
                  <p className="text-sm font-bold text-[#67e1f9]">
                    {date ? new Date(date).toLocaleString() : "Upcoming"}
                  </p>
                  <h3 className="mt-4 text-2xl font-black">
                    {home} vs {away}
                  </h3>
                  <p className="mt-3 text-gray-400">
                    {fixture.league || "Football fixture"}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
