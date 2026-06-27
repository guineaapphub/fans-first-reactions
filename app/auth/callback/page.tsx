"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function finishLogin() {
      await supabase.auth.exchangeCodeForSession(window.location.href);
      router.push("/favourites");
    }

    finishLogin();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <p className="text-xl font-black text-[#67e1f9]">Signing you in...</p>
    </main>
  );
}