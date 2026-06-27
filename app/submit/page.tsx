"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const teamsByLeague: Record<string, string[]> = {
  "Premier League": [
    "Arsenal",
    "Aston Villa",
    "Bournemouth",
    "Brighton",
    "Burnley",
    "Chelsea",
    "Crystal Palace",
    "Everton",
    "Fulham",
    "Leeds United",
    "Liverpool",
    "Man City",
    "Man United",
    "Newcastle",
    "Nottingham Forest",
    "Sunderland",
    "Tottenham",
    "West Ham",
    "Wolves",
  ],
  Championship: [
    "Birmingham",
    "Blackburn",
    "Bristol City",
    "Charlton",
    "Coventry",
    "Derby",
    "Hull",
    "Ipswich",
    "Leicester",
    "Middlesbrough",
    "Millwall",
    "Norwich",
    "Oxford Utd",
    "Portsmouth",
    "Preston",
    "QPR",
    "Sheffield Utd",
    "Sheffield Wed",
    "Southampton",
    "Stoke",
    "Swansea",
    "Watford",
    "West Brom",
    "Wrexham",
  ],
  "Scottish Premiership": [
    "Aberdeen",
    "Celtic",
    "Dundee",
    "Dundee United",
    "Falkirk",
    "Hearts",
    "Hibernian",
    "Kilmarnock",
    "Livingston",
    "Motherwell",
    "Rangers",
    "St Mirren",
  ],
  "La Liga": [
    "Alaves",
    "Athletic Bilbao",
    "Atletico Madrid",
    "Barcelona",
    "Celta Vigo",
    "Espanyol",
    "Getafe",
    "Girona",
    "Osasuna",
    "Real Betis",
    "Real Madrid",
    "Real Sociedad",
    "Sevilla",
    "Valencia",
    "Villarreal",
  ],
  "Serie A": [
    "AC Milan",
    "Atalanta",
    "Bologna",
    "Cagliari",
    "Como",
    "Empoli",
    "Fiorentina",
    "Genoa",
    "Hellas Verona",
    "Inter Milan",
    "Juventus",
    "Lazio",
    "Lecce",
    "Monza",
    "Napoli",
    "Parma",
    "Roma",
    "Torino",
    "Udinese",
    "Venezia",
  ],
  Bundesliga: [
    "Augsburg",
    "Bayer Leverkusen",
    "Bayern Munich",
    "Bochum",
    "Borussia Dortmund",
    "Borussia Monchengladbach",
    "Eintracht Frankfurt",
    "Freiburg",
    "Hamburg",
    "Heidenheim",
    "Hoffenheim",
    "Koln",
    "Mainz",
    "RB Leipzig",
    "St Pauli",
    "Stuttgart",
    "Union Berlin",
    "Werder Bremen",
    "Wolfsburg",
  ],
  "Ligue 1": [
    "Auxerre",
    "Brest",
    "Lens",
    "Lille",
    "Lyon",
    "Marseille",
    "Monaco",
    "Nantes",
    "Nice",
    "PSG",
    "Rennes",
    "Strasbourg",
    "Toulouse",
  ],
};

export default function SubmitPage() {
  const [league, setLeague] = useState("Premier League");
  const teams = useMemo(() => teamsByLeague[league] || [], [league]);

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

          <form
            className="space-y-6 p-8"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Form layout works. Database saving comes next.");
            }}
          >
            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-[0.25em] text-[#67e1f9]">
                YouTube Channel URL
              </label>

              <input
                type="url"
                placeholder="https://www.youtube.com/@channelname"
                className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none placeholder:text-gray-600 focus:border-[#67e1f9]"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-[0.25em] text-[#67e1f9]">
                  League
                </label>

                <select
                  value={league}
                  onChange={(e) => setLeague(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-[#67e1f9]"
                >
                  {Object.keys(teamsByLeague).map((item) => (
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

                <select className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-[#67e1f9]">
                  <option>Select team...</option>
                  {teams.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#67e1f9] py-4 text-lg font-black text-black"
            >
              Submit For Review
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}