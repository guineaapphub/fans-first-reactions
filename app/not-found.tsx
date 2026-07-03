import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-black px-6 text-white">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#67e1f9]">
          Fans First Reactions
        </p>

        <h1 className="mt-6 text-6xl font-black md:text-8xl">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-black">
          Page not found
        </h2>

        <p className="mt-6 text-lg text-white/70">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-xl bg-[#67e1f9] px-8 py-4 font-bold text-black transition hover:opacity-90"
          >
            Home
          </Link>

          <Link
            href="/creators"
            className="rounded-xl border border-[#67e1f9]/40 px-8 py-4 font-bold text-[#67e1f9] transition hover:bg-[#67e1f9]/10"
          >
            Browse Creators
          </Link>

          <Link
            href="/clubs"
            className="rounded-xl border border-[#67e1f9]/40 px-8 py-4 font-bold text-[#67e1f9] transition hover:bg-[#67e1f9]/10"
          >
            Browse Clubs
          </Link>
        </div>
      </div>
    </main>
  );
}