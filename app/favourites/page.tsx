"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type FavouriteCreator = {
  id: string;
  name: string | null;
  slug: string | null;
  club: string | null;
  league: string | null;
  country: string | null;
  avatar_url: string | null;
  subscribers: string | null;
  subscriber_count: string | null;
};

export default function FavouritesPage() {
  const [loading, setLoading] = useState(true);
  const [creators, setCreators] = useState<FavouriteCreator[]>([]);

  useEffect(() => {
    async function loadFavourites() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/sign-in";
        return;
      }

      const { data: favourites, error: favError } = await supabase
        .from("favourites")
        .select("creator_id")
        .eq("user_id", user.id);

      if (favError || !favourites || favourites.length === 0) {
        setCreators([]);
        setLoading(false);
        return;
      }

      const creatorIds = favourites.map((item) => item.creator_id);

      const { data: creatorRows, error: creatorError } = await supabase
        .from("creators")
        .select(
          "id, name, slug, club, league, country, avatar_url, subscribers, subscriber_count"
        )
        .in("id", creatorIds);

      if (!creatorError && creatorRows) {
        setCreators(creatorRows as FavouriteCreator[]);
      }

      setLoading(false);
    }

    loadFavourites();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        Loading favourites...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-[#67e1f9]">
          Your Watchlist
        </p>

        <h1 className="text-5xl font-black md:text-7xl">
          Favourite Creators
        </h1>

        <p className="mt-6 max-w-3xl text-xl text-gray-400">
          Your saved football creators will appear here whenever you sign in.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        {creators.length === 0 ? (
          <div className="rounded-[36px] border border-[#67e1f9]/40 bg-[#0c1020] p-8">
            <h2 className="text-3xl font-black">No favourites saved yet</h2>
            <p className="mt-4 text-gray-400">
              Browse the creator directory and tap Favourite to build your personal watchlist.
            </p>

            <Link
              href="/creators"
              className="mt-8 inline-block rounded-full bg-[#67e1f9] px-8 py-4 font-black text-black"
            >
              Browse Creators
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {creators.map((creator) => (
              <Link
                key={creator.id}
                href={`/creators/${creator.slug}`}
                className="rounded-3xl border border-white/10 bg-[#0c1020] p-6 text-white transition hover:border-[#67e1f9]"
              >
                {creator.avatar_url ? (
                  <img
                    src={creator.avatar_url}
                    alt={creator.name || "Creator"}
                    className="mb-5 h-20 w-20 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#67e1f9] text-2xl font-black text-black">
                    {(creator.name || "?").charAt(0)}
                  </div>
                )}

                <h2 className="text-2xl font-black">{creator.name}</h2>
                <p className="mt-2 text-gray-400">{creator.club}</p>
                <p className="mt-2 text-sm text-gray-500">{creator.league}</p>

                <p className="mt-4 font-black text-[#67e1f9]">
                  {creator.subscribers || creator.subscriber_count || "Not listed"} subscribers
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}