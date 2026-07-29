import { clubBadges } from "@/lib/club-badges";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import ClubSearch from "./ClubSearch";

function makeSlug(value: string | null) {
  return (value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function clubCountry(club: string, league?: string | null) {
  const clubCountries: Record<string, string> = {
    Barcelona: "Spain",
    "AC Milan": "Italy",
    "Man United": "England",
    Arsenal: "England",
    Rangers: "Scotland",
  };

  const leagueCountries: Record<string, string> = {
    "Premier League": "England",
    Championship: "England",
    "League One": "England",
    "League Two": "England",
    "Scottish Premiership": "Scotland",
    "La Liga": "Spain",
    "Serie A": "Italy",
    Bundesliga: "Germany",
    "Ligue 1": "France",
  };

  return (
    clubCountries[club.trim()] ||
    leagueCountries[String(league || "").trim()] ||
    null
  );
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

function normaliseClubSearch(value: string) {
  const query = value.trim().toLowerCase();

  const aliases: Record<string, string[]> = {
    spfl: [
      "scottish premiership",
      "scottish championship",
      "scottish league",
      "scotland",
    ],
    "scottish professional football league": [
      "scottish premiership",
      "scottish championship",
      "scottish league",
      "scotland",
    ],
    "scottish league": [
      "scottish premiership",
      "scottish championship",
      "scotland",
    ],

    epl: ["premier league", "english premier league", "england"],
    "english premier league": ["premier league", "england"],

    efl: [
      "championship",
      "league one",
      "league two",
      "english football league",
      "england",
    ],
    "english football league": [
      "championship",
      "league one",
      "league two",
      "england",
    ],
    "english league": [
      "premier league",
      "championship",
      "league one",
      "league two",
      "england",
    ],

    "efl championship": ["championship", "england"],
    "efl league one": ["league one", "england"],
    "efl league two": ["league two", "england"],

    bundesliga: ["bundesliga", "fußball-bundesliga", "german league", "germany"],
    "fußball-bundesliga": ["bundesliga", "german league", "germany"],
    "german league": ["bundesliga", "germany"],

    "serie a": [
      "serie a",
      "serie a enilive",
      "scudetto",
      "italian league",
      "italy",
    ],
    "serie a enilive": ["serie a", "italian league", "italy"],
    scudetto: ["serie a", "italian league", "italy"],
    "italian league": ["serie a", "italy"],

    "la liga": [
      "la liga",
      "primera división",
      "primera division",
      "spanish league",
      "spain",
    ],
    "primera división": ["la liga", "spanish league", "spain"],
    "primera division": ["la liga", "spanish league", "spain"],
    "spanish league": ["la liga", "spain"],

    "ligue 1": [
      "ligue 1",
      "division 1",
      "le championnat",
      "french league",
      "france",
    ],
    "division 1": ["ligue 1", "french league", "france"],
    "le championnat": ["ligue 1", "french league", "france"],
    "french league": ["ligue 1", "france"],
  };

  return aliases[query] || [query];
}
export default async function ClubsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search = "" } = await searchParams;
  const { data: creators, error } = await supabase
    .from("creators")
    .select("club, league, country");

  if (error) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        <h1 className="text-4xl font-black text-red-500">Clubs Error</h1>
        <p className="mt-4">{error.message}</p>
      </main>
    );
  }

  const clubMap = new Map<
    string,
    { name: string; slug: string; league: string; country: string; count: number }
  >();

  creators?.forEach((creator) => {
    const name = creator.club || "Unknown";
    const slug = makeSlug(name);

    if (!clubMap.has(slug)) {
      clubMap.set(slug, {
        name,
        slug,
        league: creator.league || "Football",
        country: clubCountry(name, creator.league) || "Unknown",
        count: 0,
      });
    }

    clubMap.get(slug)!.count += 1;
  });

  const clubs = Array.from(clubMap.values()).sort((a, b) =>
  a.name.localeCompare(b.name)
);

const searchTerms = normaliseClubSearch(search);

const filteredClubs = search.trim()
  ? clubs.filter((club) => {
      const searchableText = [
        club.name,
        club.league,
        club.country,
      ]
        .join(" ")
        .toLowerCase();

      return searchTerms.some((term) =>
        searchableText.includes(term.toLowerCase())
      );
    })
  : clubs;

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 bg-[#05070a]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
          <Link href="/creators" className="font-bold text-[#67e1f9]">
            ← Back to Creators
          </Link>

          <h1 className="mt-10 text-5xl font-black md:text-7xl">
            Football Clubs
          </h1>

          <p className="mt-5 max-w-3xl text-xl text-gray-400">
            Browse football fan creators by club.
          </p>

          <p className="mt-4 text-2xl font-bold text-[#67e1f9]">
            {clubs.length} clubs indexed
          </p>
                </div>
      </section>

     <section className="mx-auto max-w-7xl px-6 pt-10 md:px-12">
  <ClubSearch initialSearch={search} />
</section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClubs.map((club) => (
            <Link
              key={club.slug}
              href={`/clubs/${club.slug}`}
              className="rounded-[28px] border border-white/10 bg-[#0c1020] p-6 transition hover:border-[#67e1f9]"
            >
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#67e1f9]">
                {club.league}
              </p>

              <div className="mt-4 flex items-center gap-3">
               <h2 className="text-3xl font-black">{club.name}</h2>

               {clubBadges[club.name.trim()] && (
                 <img
                   src={clubBadges[club.name.trim()]}
                   alt={`${club.name} badge`}
                   className="h-10 w-10 object-contain"
                 />
         )}
             </div>

              <div className="mt-3 flex items-center gap-2">
              {club.country && countryFlag(club.country) && (
              <>
             <img
              src={countryFlag(club.country) || ""}
              alt={club.country}
              className="h-4 w-auto"
            />

             <span className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
             {club.country}
             </span>
             </>
           )}
        </div>

              <p className="mt-5 text-xl font-black text-[#67e1f9]">
                {club.count} creators
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
