"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setErrorMessage("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMessage("Password updated. You can now sign in with your new password.");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16">
        <div className="w-full">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-[#67e1f9]">
            Account Help
          </p>

          <h1 className="text-5xl font-black md:text-7xl">Reset Password</h1>

          <p className="mt-6 max-w-2xl text-xl text-gray-400">
            Enter a new password for your Fans First Reactions account.
          </p>

          <form
            onSubmit={handleResetPassword}
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
              New Password
            </label>

            <div className="mt-4 flex rounded-2xl border border-white/10 bg-black focus-within:border-[#67e1f9]">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
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
              {loading ? "Updating..." : "Update Password"}
            </button>

            <p className="mt-8 text-center text-gray-400">
              Back to{" "}
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