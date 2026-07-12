export type Fixture = {
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

export interface FootballProvider {
  getUpcomingFixtures(): Promise<Fixture[]>;
}