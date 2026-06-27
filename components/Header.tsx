"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setSignedIn(!!data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session?.user);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/f1r-logo.png"
            alt="Fans First Reactions"
            width={58}
            height={58}
            className="rounded-xl"
            priority
          />

          <div className="leading-tight">
            <div className="text-2xl font-black text-white">
              Fans <span className="text-[#67e1f9]">First</span>
            </div>
            <div className="text-2xl font-black text-white">Reactions</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-10 text-base font-black text-white lg:flex">
          <Link href="/" className="hover:text-[#67e1f9]">Home</Link>
          <Link href="/creators" className="hover:text-[#67e1f9]">Discover</Link>
          <Link href="/clubs" className="hover:text-[#67e1f9]">Clubs</Link>
          <Link href="/club-fixtures" className="hover:text-[#67e1f9]">Club Fixtures</Link>
          <Link href="/generators" className="hover:text-[#67e1f9]">Generators</Link>
          <Link href="/become-a-creator" className="hover:text-[#67e1f9]">Become a Creator</Link>

          <a
            href="https://www.youtube.com/@FansFirstReactions"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#67e1f9]"
          >
            YouTube ↗
          </a>

          <a
            href="https://x.com/Fans1R"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#67e1f9]"
          >
            X ↗
          </a>
        </nav>

        {signedIn ? (
          <button
            onClick={signOut}
            className="rounded-2xl bg-[#67e1f9] px-7 py-4 text-lg font-black text-black hover:bg-white"
          >
            Sign Out
          </button>
        ) : (
          <Link
            href="/sign-in"
            className="rounded-2xl bg-[#67e1f9] px-7 py-4 text-lg font-black text-black hover:bg-white"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}