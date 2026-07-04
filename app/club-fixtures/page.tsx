import { createClient } from "@supabase/supabase-js";
import { apiFootballProvider } from "@/lib/providers/api-football";
import FixtureFilters from "./FixtureFilters";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function ClubFixturesPage() {
  const [{ data: creators, error }, fixtures] = await Promise.all([
    supabaseAdmin
      .from("creators")
      .select(
        "name, slug, club, youtube_url, avatar_url, subscribers, subscriber_count"
      )
      .order("name"),
    apiFootballProvider.getUpcomingFixtures().catch(() => []),
  ]);

  if (error) {
    return (
      <main className="min-h-screen bg-black px-6 py-20 text-white">
        <h1 className="text-4xl font-black">Club Fixtures</h1>
        <p className="mt-4 text-red-400">
          Could not load creators from Supabase.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-[#67e1f9]">
          Matchday Creator Finder
        </p>

        <h1 className="text-5xl font-black md:text-7xl">
          Club Fixtures → Matchday Creators
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-zinc-400">
          Find upcoming football matches and discover which fan creators are
          covering each fixture.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <FixtureFilters fixtures={fixtures || []} creators={creators || []} />
      </section>
    </main>
  );
}