"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AccountPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/sign-in");
        return;
      }

      setEmail(user.email ?? "");
    }

    loadUser();
  }, [router]);

  function resetMessages() {
    setMessage("");
    setErrorMessage("");
  }

  async function handleChangeEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    resetMessages();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      email: newEmail,
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMessage("Check your new email address to confirm the change.");
    setNewEmail("");
  }

  async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    resetMessages();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMessage("Password updated successfully.");
    setNewPassword("");
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );

    if (!confirmed) return;

    resetMessages();
    setLoading(true);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      setLoading(false);
      setErrorMessage("Auth session missing. Please sign in again.");
      return;
    }

    const response = await fetch("/api/delete-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
      }),
    });

    setLoading(false);

    if (!response.ok) {
      setErrorMessage("Account could not be deleted. Please try again.");
      return;
    }

    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-[#67e1f9]">
          Member Account
        </p>

        <h1 className="text-5xl font-black md:text-7xl">Account</h1>

        <p className="mt-6 max-w-2xl text-xl text-gray-400">
          Manage your Fans First Reactions login details.
        </p>

        <div className="mt-10 max-w-2xl rounded-[36px] border border-[#67e1f9]/40 bg-[#0c1020] p-8">
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

          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#67e1f9]">
              Current Email
            </p>

            <p className="mt-4 rounded-2xl border border-white/10 bg-black px-5 py-4 font-bold text-white">
              {email || "Loading..."}
            </p>
          </div>

          <form onSubmit={handleChangeEmail} className="mt-8">
            <label className="text-sm font-black uppercase tracking-[0.35em] text-[#67e1f9]">
              New Email
            </label>

            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="new-email@example.com"
              className="mt-4 w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none focus:border-[#67e1f9]"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-2xl bg-[#67e1f9] px-8 py-4 text-lg font-black text-black hover:bg-white disabled:opacity-60"
            >
              {loading ? "Updating..." : "Change Email"}
            </button>
          </form>

          <div className="my-8 h-px bg-white/10" />

          <form onSubmit={handleChangePassword}>
            <label className="text-sm font-black uppercase tracking-[0.35em] text-[#67e1f9]">
              New Password
            </label>

            <div className="mt-4 flex rounded-2xl border border-white/10 bg-black focus-within:border-[#67e1f9]">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
              className="mt-5 w-full rounded-2xl bg-[#67e1f9] px-8 py-4 text-lg font-black text-black hover:bg-white disabled:opacity-60"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>

          <div className="my-8 h-px bg-white/10" />

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full rounded-2xl border border-[#67e1f9]/50 px-8 py-4 text-lg font-black text-[#67e1f9] hover:bg-[#67e1f9]/10"
          >
            Sign Out
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={loading}
            className="mt-5 w-full rounded-2xl border border-red-500/50 px-8 py-4 text-lg font-black text-red-300 hover:bg-red-500/10 disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete My Account"}
          </button>
        </div>
      </section>
    </main>
  );
}