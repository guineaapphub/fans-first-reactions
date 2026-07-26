"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { clubBadges } from "@/lib/club-badges";
import { supabase } from "@/lib/supabase";

export default function BadgeAdminPage() {
const [loading, setLoading] = useState(true);
const [allowed, setAllowed] = useState(false);

const ADMIN_EMAIL = "guineagamehub@gmail.com";

useEffect(() => {
  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/sign-in";
      return;
    }

    const userEmail = user.email?.toLowerCase() || "";

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, email")
      .eq("id", user.id)
      .single();

    const isAdmin =
      userEmail === ADMIN_EMAIL ||
      profile?.email?.toLowerCase() === ADMIN_EMAIL ||
      profile?.role === "admin";

    if (!isAdmin) {
      window.location.href = "/favourites";
      return;
    }

    setAllowed(true);
    setLoading(false);
  }

  checkAdmin();
}, []);

const [search, setSearch] = useState("");

const badges = useMemo(() => {
  return Object.entries(clubBadges)
    .filter(([club]) =>
      club.toLowerCase().includes(search.toLowerCase())
    )
    .sort(([a], [b]) => a.localeCompare(b));
}, [search]);

if (loading) {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <p className="text-white/70">Checking admin access...</p>
    </main>
  );
}

if (!allowed) return null;

return (
    <main className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Club Badge QA</h1>

      <p className="text-gray-500 mb-4">
  Showing: <strong>{badges.length}</strong> of{" "}
  <strong>{Object.keys(clubBadges).length}</strong> mappings
</p>

<input
  type="text"
  value={search}
  onChange={(event) => setSearch(event.target.value)}
  placeholder="Search club name..."
  className="mb-8 w-full max-w-md rounded-lg border border-white/20 bg-black px-4 py-3 text-white placeholder:text-white/40"
/>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map(([club, path]) => (
          <div
            key={club}
            className="border rounded-lg p-4 flex items-center gap-4"
          >
            <img
  src={path}
  alt={club}
  width={48}
  height={48}
  className="h-12 w-12 object-contain"
  onError={(event) => {
    event.currentTarget.style.display = "none";
    event.currentTarget.parentElement?.classList.add(
      "border-red-500",
      "bg-red-500/10"
    );
  }}
/>

            <div className="min-w-0">
              <div className="font-semibold">{club}</div>

              <div className="text-xs text-gray-500 break-all">
                {path}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}