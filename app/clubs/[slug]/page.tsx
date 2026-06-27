import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";

function makeSlug(value: string | null) {
  return (value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function ClubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: allCreators, error } = await supabase
    .from("creators")
    .select("*")
    .order("subscriber_count", { ascending: false });

  if (error || !allCreators) {
    notFound();
  }

  const creators = allCreators.filter(
    (creator) => makeSlug(creator.club) === slug
  );

  if (creators.length === 0) {
    notFound();
  }

  const clubName = creators[0].club || titleFromSlug(slug);
  const league = creators[0].league || "Football";
  const country = creators[0].country || "Unknown";

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 bg-[#05070a]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
          <Link href="/creators" className="font-bold text-[#67e1f9]">
            ← Back to Creators
          </Link>

          <div className="mt-10 rounded-[36px] border border-[#67e1f9]/30 bg-[#0c1020] p-8">
            <p className="text-sm font-bold uppercase tracking-[0.5em] text-[#67e1f9]">
              {league}
            </p>

            <h1 className="mt-4 text-5xl font-black md:text-7xl">
              {clubName}
            </h1>

            <p className="mt-5 text-2xl font-bold text-gray-300">
              {creators.length} creators • {country}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/submit"
                className="rounded-full bg-[#67e1f9] px-8 py-4 font-bold text-black"
              >
                + Suggest Creator
              </Link>

              <Link
                href="/creators"
                className="rounded-full border border-[#67e1f9]/40 px-8 py-4 font-bold text-[#67e1f9]"
              >
                View All Creators
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 md:px-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="text-3xl font-black">
            {clubName} Creators
          </h2>

          <p className="text-gray-400">
            Sorted by subscribers
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => {
            const name = creator.name || "Unknown Creator";

            return (
              <Link
                key={creator.id}
                href={`/creators/${creator.slug}`}
                className="rounded-[28px] border border-white/10 bg-[#0c1020] p-6 transition hover:border-[#67e1f9]"
              >
                <div className="flex items-center gap-4">
                  {creator.avatar_url ? (
                    <img
                      src={creator.avatar_url}
                      alt={name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#67e1f9] text-2xl font-black text-black">
                      {name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h3 className="text-2xl font-black">{name}</h3>
                    <p className="text-gray-400">
                      {creator.club} • {creator.country || "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="text-xl font-black text-[#67e1f9]">
                    {creator.subscriber_count || "Not listed"} subscribers
                  </p>

                  <p className="mt-2 text-gray-400">
                    Uploads: {creator.upload_frequency || "Not listed"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14 md:px-12">
        <div className="rounded-[36px] bg-[#67e1f9] p-8 text-black md:flex md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-black">
              Know another {clubName} creator?
            </h2>
            <p className="mt-2 text-lg">
              Help us grow the database — submissions reviewed manually.
            </p>
          </div>

          <Link
            href="/submit"
            className="mt-6 inline-block rounded-full bg-black px-8 py-4 font-bold text-white md:mt-0"
          >
            + Suggest a Creator
          </Link>
        </div>
      </section>
    </main>
  );
}