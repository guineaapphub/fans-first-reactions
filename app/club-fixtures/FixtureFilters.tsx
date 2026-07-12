"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Creator = {
  name: string;
  slug: string;
  club: string;
  youtube_url: string | null;
  avatar_url: string | null;
  subscribers: string | null;
  subscriber_count: string | null;
};

type Fixture = {
  id: string;
  leagueId: number;
  league: string;
  leagueLogo: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  kickoff: string;
};

const FOOTBALL_PREDICTOR_URL =
  "https://www.playpredictwin.com/leagues?join=3088746C";

const LEAGUES = [
  { id: 0, label: "ALL", logo: null },
  {
    id: 39,
    label: "PL",
    logo: "/league-logos/premier-league.png",
  },
  {
    id: 40,
    label: "CH",
    logo: "/league-logos/championship.png",
  },
  {
    id: 41,
    label: "L1",
    logo: "/league-logos/league-one.png",
  },
  {
    id: 42,
    label: "L2",
    logo: "/league-logos/league-two.png",
  },
  {
    id: 179,
    label: "SP",
    logo: "/league-logos/scottish-premiership.png",
  },
  {
    id: 78,
    label: "BL",
    logo: "/league-logos/bundesliga.png",
  },
  {
    id: 140,
    label: "LL",
    logo: "/league-logos/la-liga.png",
  },
  {
    id: 135,
    label: "SA",
    logo: "/league-logos/serie-a.png",
  },
  {
    id: 61,
    label: "L1",
    logo: "/league-logos/ligue-1.png",
  },
  {
    id: 2,
    label: "UCL",
    logo: "/league-logos/champions-league.png",
  },
  {
    id: 3,
    label: "UEL",
    logo: "/league-logos/europa-league.png",
  },
];

function getLocalLeagueLogo(leagueId: number) {
  return LEAGUES.find((item) => item.id === leagueId)?.logo || null;
}

const CLUB_ALIASES: Record<string, string[]> = {
  "Manchester United": ["Man United", "Manchester Utd"],
  "Manchester City": ["Man City"],
  Tottenham: ["Tottenham Hotspur", "Spurs"],
  Barcelona: ["FC Barcelona"],
  "Real Madrid": ["Real Madrid CF"],
};

function normalizeClubName(name: string) {
  return name.toLowerCase().trim();
}

function clubMatches(creatorClub: string, fixtureClub: string) {
  const creator = normalizeClubName(creatorClub);
  const fixture = normalizeClubName(fixtureClub);

  if (creator === fixture) return true;

  const aliases = CLUB_ALIASES[fixtureClub] || [];

  return aliases.some(
    (alias) => normalizeClubName(alias) === creator
  );
}

function getCreatorsForClub(creators: Creator[], club: string) {
  return creators
    .filter(
      (creator) =>
        creator.club && clubMatches(creator.club, club)
    )
    .slice(0, 4);
}

function getCreatorCount(creators: Creator[], club: string) {
  return creators.filter(
    (creator) =>
      creator.club && clubMatches(creator.club, club)
  ).length;
}

function clubSlug(club: string) {
  const slugMap: Record<string, string> = {
    "Manchester United": "man-united",
    "Manchester City": "man-city",
    "Tottenham Hotspur": "tottenham",
    "Newcastle United": "newcastle",
    "Nottingham Forest": "nottm-forest",
    "Wolverhampton Wanderers": "wolves",
    "West Ham United": "west-ham",
    "Brighton & Hove Albion": "brighton",
  };

  if (slugMap[club]) return slugMap[club];

  return club
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatFixtureDate(kickoff: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  }).format(new Date(kickoff));
}

function CreatorChip({
  creator,
}: {
  creator: Creator;
}) {
  return (
    <Link
      href={`/creators/${creator.slug}`}
      className="flex items-center gap-3 rounded-full border border-[#67e1f9]/70 bg-black/40 px-4 py-3 text-sm font-bold text-[#67e1f9] transition hover:bg-[#67e1f9] hover:text-black"
    >
      {creator.avatar_url ? (
        <img
          src={creator.avatar_url}
          alt={`${creator.name} avatar`}
          className="h-9 w-9 rounded-full object-cover"
        />
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#67e1f9] text-xs font-black text-black">
          {creator.name.slice(0, 1)}
        </span>
      )}

      <span>{creator.name}</span>
      <span>↗</span>
    </Link>
  );
}

function AffiliateBox() {
  return (
    <a
      href={FOOTBALL_PREDICTOR_URL}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="mt-6 flex max-w-sm items-center gap-4 rounded-2xl border border-[#67e1f9]/40 bg-black/40 p-4 transition hover:border-[#67e1f9] hover:bg-[#67e1f9]/10 md:mt-0"
    >
      <img
        src="/football-predictor-league.png"
        alt="The Football Predictor League"
        className="h-20 w-20 rounded-xl object-contain"
      />

      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#67e1f9]">
          The Football Predictor League
        </p>

        <p className="mt-1 text-sm font-black text-white">
          Play. Predict. Win.
        </p>

        <p className="mt-1 text-xs text-zinc-400">
          Call every scoreline. Climb the leaderboard. Show your mates you know
          football.
        </p>

        <p className="mt-2 text-xs font-black text-[#67e1f9]">
          FREE to play →
        </p>
      </div>
    </a>
  );
}

export default function FixtureFilters({
  fixtures = [],
  creators = [],
}: {
  fixtures?: Fixture[];
  creators?: Creator[];
}) {
  const [selectedLeague, setSelectedLeague] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const safeFixtures = Array.isArray(fixtures) ? fixtures : [];
  const safeCreators = Array.isArray(creators) ? creators : [];

  const suggestions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (query.length < 2) return [];

    const names = new Set<string>();

    safeFixtures.forEach((fixture) => {
      names.add(fixture.homeTeam);
      names.add(fixture.awayTeam);
      names.add(fixture.league);
    });

    return Array.from(names)
      .filter((name) => name.toLowerCase().startsWith(query))
      .sort((a, b) => a.localeCompare(b))
      .slice(0, 8);
  }, [safeFixtures, searchQuery]);

  const filteredFixtures = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return safeFixtures.filter((fixture) => {
      const leagueMatches =
        selectedLeague === 0 || fixture.leagueId === selectedLeague;

      const searchMatches =
        !query ||
        fixture.homeTeam.toLowerCase().includes(query) ||
        fixture.awayTeam.toLowerCase().includes(query) ||
        fixture.league.toLowerCase().includes(query);

      return leagueMatches && searchMatches;
    });
  }, [safeFixtures, selectedLeague, searchQuery]);

  return (
    <>
      <section className="mb-10">
        <div className="relative mb-8">
          <input
            type="search"
            value={searchQuery}
            onFocus={() => setShowSuggestions(true)}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setShowSuggestions(true);
            }}
            placeholder="Search clubs..."
            className="w-full rounded-full border-4 border-[#67e1f9] bg-white px-8 py-6 pr-16 text-xl font-medium text-black outline-none placeholder:text-zinc-500"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setShowSuggestions(false);
              }}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl font-black text-blue-900"
            >
              ×
            </button>
          )}

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-3 overflow-hidden rounded-3xl border border-[#67e1f9]/60 bg-[#070b14] shadow-2xl">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setShowSuggestions(false);
                  }}
                  className="block w-full px-6 py-4 text-left text-sm font-bold text-white transition hover:bg-[#67e1f9] hover:text-black"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {LEAGUES.map((league) => (
            <button
              key={league.id}
              type="button"
              onClick={() => setSelectedLeague(league.id)}
              className={`rounded-full border px-5 py-3 font-semibold transition ${
                selectedLeague === league.id
                  ? "border-[#67e1f9] bg-[#67e1f9] text-black"
                  : "border-[#67e1f9]/50 bg-transparent text-white hover:border-[#67e1f9]"
              }`}
            >
              <span className="flex items-center gap-2">
                {league.logo && (
                  <img
                    src={league.logo}
                    alt={`${league.label} logo`}
                    className="h-5 w-5 object-contain"
                  />
                )}

                <span>{league.label}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {filteredFixtures.length === 0 ? (
        <div className="rounded-3xl border border-[#67e1f9]/40 bg-[#070b14] p-8">
          <h2 className="text-2xl font-black">
            No upcoming fixtures found yet.
          </h2>

          <p className="mt-3 text-zinc-400">
            No fixtures matched your selected league or search.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredFixtures.map((fixture) => {
            const homeCreators = getCreatorsForClub(
              safeCreators,
              fixture.homeTeam
            );

            const awayCreators = getCreatorsForClub(
              safeCreators,
              fixture.awayTeam
            );

            const homeTotal = getCreatorCount(
              safeCreators,
              fixture.homeTeam
            );

            const awayTotal = getCreatorCount(
              safeCreators,
              fixture.awayTeam
            );

            const displayLeagueLogo =
              getLocalLeagueLogo(fixture.leagueId) ||
              fixture.leagueLogo;

            return (
              <div
                key={fixture.id}
                className="overflow-hidden rounded-3xl border border-[#67e1f9]/40 bg-[#070b14]"
              >
                <div className="flex flex-col justify-between gap-6 border-b border-white/10 p-6 md:flex-row md:items-center">
                  <div>
                    <p className="text-sm font-bold text-[#67e1f9]">
                      {formatFixtureDate(fixture.kickoff)}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <img
                        src={fixture.homeLogo}
                        alt={`${fixture.homeTeam} crest`}
                        className="h-12 w-12 object-contain"
                      />

                      <h2 className="text-3xl font-black">
                        {fixture.homeTeam} vs {fixture.awayTeam}
                      </h2>

                      <img
                        src={fixture.awayLogo}
                        alt={`${fixture.awayTeam} crest`}
                        className="h-12 w-12 object-contain"
                      />
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      {displayLeagueLogo && (
                        <img
                          src={displayLeagueLogo}
                          alt={`${fixture.league} logo`}
                          className="h-7 w-7 object-contain"
                        />
                      )}

                      <p className="text-zinc-400">
                        {fixture.league}
                      </p>
                    </div>
                  </div>

                  <AffiliateBox />
                </div>

                <div className="grid md:grid-cols-2">
                  <div className="border-white/10 p-6 md:border-r">
                    <h3 className="mb-5 text-sm font-black uppercase tracking-[0.3em] text-[#67e1f9]">
                      {fixture.homeTeam}
                    </h3>

                    <div className="flex flex-col gap-3">
                      {homeCreators.length > 0 ? (
                        homeCreators.map((creator) => (
                          <CreatorChip
                            key={creator.slug}
                            creator={creator}
                          />
                        ))
                      ) : (
                        <p className="text-zinc-500">
                          No creators found yet.
                        </p>
                      )}
                    </div>

                    {homeTotal > 4 && (
                      <Link
                        href={`/clubs/${clubSlug(fixture.homeTeam)}`}
                        className="mt-4 inline-block text-sm font-black text-[#67e1f9] hover:underline"
                      >
                        View all {homeTotal} {fixture.homeTeam} creators →
                      </Link>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="mb-5 text-sm font-black uppercase tracking-[0.3em] text-[#67e1f9]">
                      {fixture.awayTeam}
                    </h3>

                    <div className="flex flex-col gap-3">
                      {awayCreators.length > 0 ? (
                        awayCreators.map((creator) => (
                          <CreatorChip
                            key={creator.slug}
                            creator={creator}
                          />
                        ))
                      ) : (
                        <p className="text-zinc-500">
                          No creators found yet.
                        </p>
                      )}
                    </div>

                    {awayTotal > 4 && (
                      <Link
                        href={`/clubs/${clubSlug(fixture.awayTeam)}`}
                        className="mt-4 inline-block text-sm font-black text-[#67e1f9] hover:underline"
                      >
                        View all {awayTotal} {fixture.awayTeam} creators →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}