import { unstable_cache } from "next/cache";
import type { Fixture, FootballProvider } from "./football-provider";

const API_FOOTBALL_BASE_URL = "https://v3.football.api-sports.io";
const CURRENT_SEASON = 2026;
const FIXTURES_PER_LEAGUE = 80;

/**
 * Pro plan allows five requests per second.
 *
 * We deliberately use only two requests per batch because Next.js development
 * mode can sometimes render a page more than once, and Vercel may use shared
 * outbound infrastructure.
 */
const REQUESTS_PER_BATCH = 2;
const BATCH_DELAY_MS = 1100;

/**
 * Successful fixture snapshots are reused for six hours.
 */
const CACHE_SECONDS = 6 * 60 * 60;

const LEAGUES = [
  { id: 39, name: "Premier League", shortName: "PL" },
  { id: 40, name: "Championship", shortName: "CH" },
  { id: 41, name: "League One", shortName: "L1" },
  { id: 42, name: "League Two", shortName: "L2" },
  { id: 179, name: "Scottish Premiership", shortName: "SP" },
  { id: 78, name: "Bundesliga", shortName: "BL" },
  { id: 140, name: "La Liga", shortName: "LL" },
  { id: 135, name: "Serie A", shortName: "SA" },
  { id: 61, name: "Ligue 1", shortName: "LIG1" },
  { id: 2, name: "Champions League", shortName: "UCL" },
  { id: 3, name: "Europa League", shortName: "UEL" },
] as const;

type League = (typeof LEAGUES)[number];

type ApiFootballFixture = {
  fixture: {
    id: number;
    date: string;
  };
  league: {
    id: number;
    name: string;
    logo: string | null;
  };
  teams: {
    home: {
      name: string;
      logo: string | null;
    };
    away: {
      name: string;
      logo: string | null;
    };
  };
};

type ApiFootballResponse = {
  errors?: unknown;
  results?: number;
  response?: ApiFootballFixture[];
};

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function hasApiErrors(errors: unknown): boolean {
  if (!errors) return false;

  if (Array.isArray(errors)) {
    return errors.length > 0;
  }

  if (typeof errors === "object") {
    return Object.keys(errors as Record<string, unknown>).length > 0;
  }

  return true;
}

function normalizeApiErrors(errors: unknown): unknown {
  if (!errors) return {};

  return errors;
}

async function fetchLeagueFixtures(league: League): Promise<Fixture[]> {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    throw new Error("Missing API_FOOTBALL_KEY");
  }

  const url = new URL(`${API_FOOTBALL_BASE_URL}/fixtures`);

  url.searchParams.set("league", String(league.id));
  url.searchParams.set("season", String(CURRENT_SEASON));
  url.searchParams.set("next", String(FIXTURES_PER_LEAGUE));
  url.searchParams.set("timezone", "Europe/London");

  const response = await fetch(url.toString(), {
    headers: {
      "x-apisports-key": apiKey,
    },

    /**
     * The complete combined snapshot is cached below.
     * Individual API responses must not be cached separately because
     * API-Football can return a rate-limit error with HTTP status 200.
     */
    cache: "no-store",
  });

  const data = (await response.json()) as ApiFootballResponse;
  const apiErrors = normalizeApiErrors(data.errors);
  const responseFixtures = Array.isArray(data.response)
    ? data.response
    : [];

  const rateLimitHeaders = {
    minuteLimit: response.headers.get("x-ratelimit-limit"),
    minuteRemaining: response.headers.get("x-ratelimit-remaining"),
    dailyLimit: response.headers.get("x-ratelimit-requests-limit"),
    dailyRemaining: response.headers.get(
      "x-ratelimit-requests-remaining"
    ),
  };

  console.log("API-Football league request", {
    leagueId: league.id,
    leagueName: league.name,
    httpStatus: response.status,
    apiErrors,
    apiResults: data.results ?? 0,
    responseCount: responseFixtures.length,
    rateLimitHeaders,
  });

  if (!response.ok || hasApiErrors(data.errors)) {
    throw new Error(
      `API-Football request failed for ${league.name}: ${JSON.stringify(
        apiErrors
      )}`
    );
  }

  return responseFixtures.map((item) => ({
    id: String(item.fixture.id),
    leagueId: item.league.id,
    league: item.league.name,
    leagueLogo: item.league.logo ?? "",
    homeTeam: item.teams.home.name,
    awayTeam: item.teams.away.name,
    homeLogo: item.teams.home.logo ?? "",
    awayLogo: item.teams.away.logo ?? "",
    kickoff: item.fixture.date,
  }));
}

/**
 * Build one complete fixture snapshot.
 *
 * If any competition fails, this function throws instead of returning an
 * incomplete fixture list. That prevents a missing league from being cached
 * for six hours.
 */
async function buildFixtureSnapshot(): Promise<Fixture[]> {
  const allFixtures: Fixture[] = [];
  const failedLeagues: string[] = [];

  for (
    let startIndex = 0;
    startIndex < LEAGUES.length;
    startIndex += REQUESTS_PER_BATCH
  ) {
    const batch = LEAGUES.slice(
      startIndex,
      startIndex + REQUESTS_PER_BATCH
    );

    const batchResults = await Promise.allSettled(
      batch.map((league) => fetchLeagueFixtures(league))
    );

    batchResults.forEach((result, resultIndex) => {
      const league = batch[resultIndex];

      if (result.status === "fulfilled") {
        allFixtures.push(...result.value);
        return;
      }

      failedLeagues.push(league.name);

      console.warn("Fixture league request was not included", {
        leagueId: league.id,
        leagueName: league.name,
        reason:
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason),
      });
    });

    const hasAnotherBatch =
      startIndex + REQUESTS_PER_BATCH < LEAGUES.length;

    if (hasAnotherBatch) {
      await wait(BATCH_DELAY_MS);
    }
  }

  if (failedLeagues.length > 0) {
    throw new Error(
      `Fixture snapshot incomplete. Failed leagues: ${failedLeagues.join(
        ", "
      )}`
    );
  }

  const uniqueFixtures = Array.from(
    new Map(
      allFixtures.map((fixture) => [fixture.id, fixture])
    ).values()
  );

  const sortedFixtures = uniqueFixtures.sort(
    (a, b) =>
      new Date(a.kickoff).getTime() -
      new Date(b.kickoff).getTime()
  );

  console.log(
    "API-Football completed league summary",
    LEAGUES.map((league) => ({
      leagueId: league.id,
      leagueName: league.name,
      fixtureCount: sortedFixtures.filter(
        (fixture) => fixture.leagueId === league.id
      ).length,
    }))
  );

  return sortedFixtures;
}

/**
 * Cache the complete successful snapshot, rather than caching each API call.
 *
 * If buildFixtureSnapshot throws because one league failed, that incomplete
 * result is not returned as a successful snapshot.
 */
const getCachedFixtureSnapshot = unstable_cache(
  async () => buildFixtureSnapshot(),
  ["fans-first-reactions-fixture-snapshot-v1"],
  {
    revalidate: CACHE_SECONDS,
  }
);

/**
 * Prevent two overlapping page renders in the same running Next.js process
 * from starting two complete batches at once.
 */
let inFlightFixtureRequest: Promise<Fixture[]> | null = null;

export const apiFootballProvider: FootballProvider = {
  async getUpcomingFixtures() {
    if (!inFlightFixtureRequest) {
      inFlightFixtureRequest = getCachedFixtureSnapshot().finally(() => {
        inFlightFixtureRequest = null;
      });
    }

    return inFlightFixtureRequest;
  },
};