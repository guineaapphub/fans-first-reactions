import type { Fixture, FootballProvider } from "./football-provider";

const API_FOOTBALL_BASE_URL = "https://v3.football.api-sports.io";
const CURRENT_SEASON = 2026;
const FIXTURES_PER_LEAGUE = 80;

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
];

type ApiFootballFixture = {
  fixture: {
    id: number;
    date: string;
  };
  league: {
    id: number;
    name: string;
    logo: string;
  };
  teams: {
    home: {
      name: string;
      logo: string;
    };
    away: {
      name: string;
      logo: string;
    };
  };
};

async function fetchLeagueFixtures(leagueId: number): Promise<Fixture[]> {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    console.error("Missing API_FOOTBALL_KEY in .env.local");
    return [];
  }

  const url = new URL(`${API_FOOTBALL_BASE_URL}/fixtures`);
  url.searchParams.set("league", String(leagueId));
  url.searchParams.set("season", String(CURRENT_SEASON));
  url.searchParams.set("next", String(FIXTURES_PER_LEAGUE));
  url.searchParams.set("timezone", "Europe/London");

  try {
    const response = await fetch(url.toString(), {
      headers: {
        "x-apisports-key": apiKey,
      },
      next: {
        revalidate: 60 * 60,
      },
    });

    const data = await response.json();

    console.log("API-Football debug", {
      leagueId,
      httpStatus: response.status,
      apiErrors: data.errors,
      apiResults: data.results,
      responseCount: data.response?.length,
    });

    if (!response.ok || Object.keys(data.errors || {}).length > 0) {
      return [];
    }

    const fixtures = (data.response || []) as ApiFootballFixture[];

    return fixtures.map((item) => ({
      id: String(item.fixture.id),
      league: item.league.name,
      leagueLogo: item.league.logo || "",
      homeTeam: item.teams.home.name,
      awayTeam: item.teams.away.name,
      homeLogo: item.teams.home.logo || "",
      awayLogo: item.teams.away.logo || "",
      kickoff: item.fixture.date,
    }));
  } catch (error) {
    console.error("API-Football fetch failed", {
      leagueId,
      error,
    });

    return [];
  }
}

export const apiFootballProvider: FootballProvider = {
  async getUpcomingFixtures() {
    const results = await Promise.allSettled(
      LEAGUES.map((league) => fetchLeagueFixtures(league.id))
    );

    return results
      .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
      .sort(
        (a, b) =>
          new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
      );
  },
};