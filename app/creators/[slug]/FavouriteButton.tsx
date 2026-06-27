"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FavouriteButton({ creatorId }: { creatorId: string }) {
  const [loading, setLoading] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    checkFavourite();
  }, [creatorId]);

  async function checkFavourite() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("favourites")
      .select("id")
      .eq("user_id", user.id)
      .eq("creator_id", creatorId)
      .maybeSingle();

    setIsFavourite(!!data);
    setLoading(false);
  }

  async function toggleFavourite() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = `/sign-in?creator=${creatorId}`;
      return;
    }

    setLoading(true);

    if (isFavourite) {
      await supabase
        .from("favourites")
        .delete()
        .eq("user_id", user.id)
        .eq("creator_id", creatorId);

      setIsFavourite(false);
    } else {
      await supabase.from("favourites").insert({
        user_id: user.id,
        creator_id: creatorId,
      });

      setIsFavourite(true);
    }

    setLoading(false);
  }

  return (
    <button
      onClick={toggleFavourite}
      disabled={loading}
      className={`rounded-full px-8 py-4 font-bold transition ${
        isFavourite
          ? "bg-[#67e1f9] text-black hover:bg-white"
          : "border border-[#67e1f9]/40 text-[#67e1f9] hover:bg-[#67e1f9] hover:text-black"
      }`}
    >
      {loading ? "Checking..." : isFavourite ? "★ Favourited" : "☆ Favourite"}
    </button>
  );
}