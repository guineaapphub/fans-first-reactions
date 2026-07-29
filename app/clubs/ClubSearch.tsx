"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClubSearch({
  initialSearch,
}: {
  initialSearch: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmedSearch = search.trim();

      if (trimmedSearch) {
        params.set("search", trimmedSearch);
      } else {
        params.delete("search");
      }

      const queryString = params.toString();
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(nextUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, pathname, router, searchParams]);

  return (
    <div className="rounded-[32px] border border-white/10 bg-[#0c1020] p-6">
      <label htmlFor="club-search" className="sr-only">
        Search football clubs
      </label>

      <input
        id="club-search"
        name="search"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search clubs by name, league or country..."
        className="w-full rounded-2xl border border-[#67e1f9]/30 bg-[#0b1025] px-6 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-[#67e1f9]"
      />
    </div>
  );
}