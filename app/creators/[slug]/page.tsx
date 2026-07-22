import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import FavouriteButton from "./FavouriteButton";

function makeSlug(value: string | null) {
  return (value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function numberValue(value: string | null | undefined) {
  return Number(String(value || "0").replace(/[^0-9]/g, "")) || 0;
}

function getSubscribers(creator: any) {
  return creator.subscribers || creator.subscriber_count || "Not listed";
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

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: creator, error } = await supabase
    .from("creators")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !creator) {
    notFound();
  }

  const { data: moreCreators } = await supabase
    .from("creators")
    .select("*")
    .eq("club", creator.club)
    .neq("slug", slug)
    .limit(4);

  const sortedMoreCreators = [...(moreCreators || [])].sort(
    (a, b) => numberValue(getSubscribers(b)) - numberValue(getSubscribers(a))
  );

  const name = creator.name || "Unknown Creator";
  const clubName = creator.club || "Football";
  const clubSlug = makeSlug(creator.club);

  const description =
    creator.description ||
    `${name} is a football creator covering ${clubName} fan reactions, videos, and match content.`;

  const youtubeUrl = creator.youtube_url || "";
  const hasYoutube = youtubeUrl.trim().length > 0;
  const subscriberText = getSubscribers(creator);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 bg-[#05070a]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
          <Link href="/creators" className="font-bold text-[#67e1f9]">
            ← Back to Creators
          </Link>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[36px] border border-[#67e1f9]/30 bg-[#0c1020] p-8">
              <div className="flex aspect-video items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#10192f] to-black">
                {creator.avatar_url ? (
                  <img
                    src={creator.avatar_url}
                    alt={name}
                    referrerPolicy="no-referrer"
                    className="h-32 w-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#67e1f9] text-5xl font-black text-black">
                    {name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.5em] text-[#67e1f9]">
                Creator Profile
              </p>

              <h1 className="mt-4 text-5xl font-black md:text-7xl">{name}</h1>

              <div className="mt-5 flex items-center gap-2 text-2xl font-bold text-gray-300">
  <p>{clubName}</p>

  {creator.country && countryFlag(creator.country) && (
    <img
      src={countryFlag(creator.country) || ""}
      alt={creator.country}
      className="h-4 w-auto"
    />
  )}
</div>

              <p className="mt-4 max-w-3xl text-xl text-gray-400">
                {description}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                {hasYoutube ? (
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#67e1f9] px-8 py-4 font-bold text-black transition duration-300 hover:bg-[#ff0000] hover:text-white"
                  >
                    ▶ Watch on YouTube 
                  </a>
                ) : (
                  <button
                    disabled
                    className="cursor-not-allowed rounded-full bg-gray-700 px-8 py-4 font-bold text-gray-400"
                  >
                    ▶ YouTube Link Missing
                  </button>
                )}

                <FavouriteButton creatorId={creator.id} />
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-2xl border border-white/10 bg-[#0c1020] px-6 py-4">
                  <p className="text-sm text-gray-500">Subscribers</p>
                  <p className="text-3xl font-black text-[#67e1f9]">
                    {subscriberText}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0c1020] px-6 py-4">
                  <p className="text-sm text-gray-500">League</p>
                  <p className="text-3xl font-black">
                    {creator.league || "Not listed"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0c1020] px-6 py-4">
                  <p className="text-sm text-gray-500">Uploads</p>
                  <p className="text-3xl font-black">
                    {creator.upload_frequency || "Not listed"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 md:px-12">
        <div className="rounded-[36px] border border-white/10 bg-[#0c1020] p-8">
          <h2 className="text-3xl font-black">About this creator</h2>
          <p className="mt-5 text-lg text-gray-400">{description}</p>
        </div>
      </section>

      {sortedMoreCreators.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-14 md:px-12">
          <div className="rounded-[36px] border border-white/10 bg-[#0c1020] p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-3xl font-black">
                More {clubName} Creators
              </h2>

              <Link
                href={`/clubs/${clubSlug}`}
                className="font-bold text-[#67e1f9] hover:underline"
              >
                View all →
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {sortedMoreCreators.map((item) => (
                <Link
                  key={item.id}
                  href={`/creators/${item.slug}`}
                  className="rounded-2xl border border-white/10 bg-black p-5 hover:border-[#67e1f9]"
                >
                  {item.avatar_url ? (
                    <img
                      src={item.avatar_url}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="mb-4 h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#67e1f9] text-xl font-black text-black">
                      {(item.name || "?").charAt(0)}
                    </div>
                  )}

                  <h3 className="text-xl font-black">{item.name}</h3>
                  <div className="mt-2 flex items-center gap-2 text-gray-400">
  {item.country && countryFlag(item.country) && (
    <img
      src={countryFlag(item.country) || ""}
      alt={item.country}
      className="h-4 w-auto"
    />
  )}
</div>
                  <p className="mt-3 font-bold text-[#67e1f9]">
                    {getSubscribers(item)} subscribers
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 pb-14 md:px-12">
        <div className="rounded-[36px] bg-[#67e1f9] p-8 text-black md:flex md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-black">
              Know a great {clubName} creator?
            </h2>
            <p className="mt-2 text-lg">
              Help us grow the database — submissions reviewed manually.
            </p>
          </div>

          <Link
            href="/submit"
            className="mt-6 inline-block rounded-full bg-black px-8 py-4 font-bold text-white transition duration-300 hover:bg-[#ffffff] hover:text-[#000000] md:mt-0"
          >
            + Suggest a Creator
          </Link>
        </div>
      </section>
    </main>
  );
}