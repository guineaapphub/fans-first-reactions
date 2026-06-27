export type Fixture = {
  id: string;
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