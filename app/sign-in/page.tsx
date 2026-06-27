"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setMessage(error ? error.message : "Check your email for the sign-in link.");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-4xl px-6 py-24">
        <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-[#67e1f9]">
          Member Access
        </p>

        <h1 className="text-5xl font-black md:text-7xl">Sign In</h1>

        <p className="mt-6 max-w-2xl text-xl text-gray-400">
          Sign in with your email to save your favourite creators and build your watchlist.
        </p>

        <form
          onSubmit={handleSignIn}
          className="mt-12 rounded-[36px] border border-[#67e1f9]/40 bg-[#0c1020] p-8"
        >
          <label className="text-sm font-black uppercase tracking-[0.35em] text-[#67e1f9]">
            Email Address
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-4 w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-[#67e1f9]"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-[#67e1f9] px-8 py-4 text-lg font-black text-black hover:bg-white disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Sign-In Link"}
          </button>

          {message && <p className="mt-5 font-bold text-[#67e1f9]">{message}</p>}

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/creators"
              className="rounded-full border border-[#67e1f9]/40 px-6 py-3 font-bold text-[#67e1f9]"
            >
              Browse Creators
            </Link>

            <Link
              href="/submit"
              className="rounded-full border border-[#67e1f9]/40 px-6 py-3 font-bold text-[#67e1f9]"
            >
              Suggest a Creator
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}