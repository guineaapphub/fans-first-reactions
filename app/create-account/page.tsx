"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function CreateAccountPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleCreateAccount(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setErrorMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMessage("Account created. Check your email to confirm your account.");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16">
        <div className="w-full">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-[#67e1f9]">
            Member Access
          </p>

          <h1 className="text-5xl font-black md:text-7xl">Create Account</h1>

          <p className="mt-6 max-w-2xl text-xl text-gray-400">
            Create your Fans First Reactions account to save your favourite creators.
          </p>

          <form
            onSubmit={handleCreateAccount}
            className="mt-10 max-w-xl rounded-[36px] border border-[#67e1f9]/40 bg-[#0c1020] p-8"
          >
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
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
              {loading ? "Creating..." : "Create Account"}
            </button>

            <p className="mt-8 text-center text-gray-400">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-bold text-[#67e1f9] hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}