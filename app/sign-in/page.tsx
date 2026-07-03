"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [magicEmail, setMagicEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const redirectUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : "https://www.fansfirstreactions.com/auth/callback";

  async function handlePasswordSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    window.location.href = "/favourites";
  }

  async function handleMagicLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email: magicEmail,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMessage("Check your email for the magic sign-in link.");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16">
        <div className="w-full">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-[#67e1f9]">
            Member Access
          </p>

          <h1 className="text-5xl font-black md:text-7xl">Sign In</h1>

          <p className="mt-6 max-w-2xl text-xl text-gray-400">
            Sign in to save your favourite creators and build your football watchlist.
          </p>

          <div className="mt-10 max-w-xl rounded-[36px] border border-[#67e1f9]/40 bg-[#0c1020] p-8 shadow-2xl shadow-[#67e1f9]/10">
            {message && (
              <p className="mb-5 rounded-2xl border border-[#67e1f9]/40 bg-[#67e1f9]/10 px-5 py-4 font-bold text-[#67e1f9]">
                {message}
              </p>
            )}

            {errorMessage && (
              <p className="mb-5 rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-4 font-bold text-red-300">
                {errorMessage}
              </p>
            )}

            <form onSubmit={handlePasswordSignIn}>
              <label className="text-sm font-black uppercase tracking-[0.35em] text-[#67e1f9]">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-4 w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-[#67e1f9]"
              />

              <label className="mt-6 block text-sm font-black uppercase tracking-[0.35em] text-[#67e1f9]">
                Password
              </label>

              <div className="mt-4 flex rounded-2xl border border-white/10 bg-black focus-within:border-[#67e1f9]">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full rounded-l-2xl bg-black px-5 py-4 text-white outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="rounded-r-2xl px-5 font-bold text-[#67e1f9]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-2xl bg-[#67e1f9] px-8 py-4 text-lg font-black text-black hover:bg-white disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-black uppercase tracking-[0.35em] text-gray-500">
                Magic Link
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <form onSubmit={handleMagicLink}>
              <label className="text-sm font-black uppercase tracking-[0.35em] text-[#67e1f9]">
                Email
              </label>

              <input
                type="email"
                required
                value={magicEmail}
                onChange={(e) => setMagicEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-4 w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-[#67e1f9]"
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-2xl border border-[#67e1f9]/50 px-8 py-4 text-lg font-black text-[#67e1f9] hover:bg-[#67e1f9]/10 disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Magic Link"}
              </button>
            </form>

            <div className="mt-8 flex flex-col gap-4 text-center sm:flex-row sm:justify-between">
              <Link href="/forgot-password" className="font-bold text-[#67e1f9] hover:underline">
                Forgot Password?
              </Link>

              <p className="text-gray-400">
                Don&apos;t have an account?{" "}
                <Link href="/create-account" className="font-bold text-[#67e1f9] hover:underline">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}