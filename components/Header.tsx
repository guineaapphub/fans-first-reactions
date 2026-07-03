"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const [signedIn, setSignedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setSignedIn(!!data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSignedIn(!!session?.user);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    window.location.href = "/";
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/creators", label: "Discover" },
    { href: "/clubs", label: "Clubs" },
    { href: "/club-fixtures", label: "Club Fixtures" },
    { href: "/generators", label: "Generators" },
    { href: "/become-a-creator", label: "Become a Creator" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8 md:py-5">
        <Link
          href="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-3 md:gap-4"
        >
          <Image
            src="/f1r-logo.png"
            alt="Fans First Reactions"
            width={58}
            height={58}
            className="h-14 w-14 rounded-xl md:h-[58px] md:w-[58px]"
            priority
          />

          <div className="shrink-0 leading-tight">
            <div className="text-2xl font-black text-white md:text-2xl">
              Fans <span className="text-[#67e1f9]">First</span>
            </div>
            <div className="text-2xl font-black text-white md:text-2xl">
              Reactions
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-base font-black text-white xl:gap-10 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap hover:text-[#67e1f9]"
            >
              {link.label}
            </Link>
          ))}

          <a
            href="https://www.youtube.com/@FansFirstReactions"
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap hover:text-[#67e1f9]"
          >
            YouTube ↗
          </a>

          <a
            href="https://x.com/Fans1R"
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap hover:text-[#67e1f9]"
          >
            X ↗
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {signedIn ? (
            <button
              onClick={signOut}
              className="hidden whitespace-nowrap rounded-2xl bg-[#67e1f9] px-7 py-4 text-lg font-black text-black hover:bg-white lg:block"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/sign-in"
              onClick={closeMenu}
              className="hidden whitespace-nowrap rounded-2xl bg-[#67e1f9] px-7 py-4 text-lg font-black text-black hover:bg-white lg:block"
            >
              Sign In
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="rounded-2xl border border-[#67e1f9]/40 px-4 py-3 text-2xl font-black text-[#67e1f9] hover:bg-[#67e1f9] hover:text-black lg:hidden"
            aria-label="Open menu"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-black px-4 pb-6 pt-3 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-3 text-lg font-black text-white">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-2xl border border-white/10 bg-[#0c1020] px-5 py-4 hover:border-[#67e1f9] hover:text-[#67e1f9]"
              >
                {link.label}
              </Link>
            ))}

            <a
              href="https://www.youtube.com/@FansFirstReactions"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="rounded-2xl border border-white/10 bg-[#0c1020] px-5 py-4 hover:border-[#67e1f9] hover:text-[#67e1f9]"
            >
              YouTube ↗
            </a>

            <a
              href="https://x.com/Fans1R"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="rounded-2xl border border-white/10 bg-[#0c1020] px-5 py-4 hover:border-[#67e1f9] hover:text-[#67e1f9]"
            >
              X ↗
            </a>

            {signedIn ? (
              <button
                onClick={signOut}
                className="mt-2 rounded-2xl bg-[#67e1f9] px-6 py-4 text-lg font-black text-black hover:bg-white"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/sign-in"
                onClick={closeMenu}
                className="mt-2 rounded-2xl bg-[#67e1f9] px-6 py-4 text-center text-lg font-black text-black hover:bg-white"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}