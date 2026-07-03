"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-black px-6 text-white">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#67e1f9]">
          Fans First Reactions
        </p>

        <h1 className="mt-6 text-5xl font-black md:text-6xl">
          Something went wrong
        </h1>

        <p className="mt-6 text-lg text-white/70">
          An unexpected error occurred while loading this page.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="rounded-xl bg-[#67e1f9] px-8 py-4 font-bold text-black transition hover:opacity-90"
          >
            Try Again
          </button>

          <a
            href="/"
            className="rounded-xl border border-[#67e1f9]/40 px-8 py-4 font-bold text-[#67e1f9] transition hover:bg-[#67e1f9]/10"
          >
            Home
          </a>
        </div>
      </div>
    </main>
  );
}