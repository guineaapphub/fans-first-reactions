import { supabase } from "@/lib/supabase";

export default async function TestPage() {
  const { data: creators, error } = await supabase
    .from("creators")
    .select("*");

  if (error) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        <h1 className="text-4xl font-bold text-red-500">
          Supabase Error
        </h1>
        <p>{error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <h1 className="text-4xl font-bold text-cyan-400">
        Connected to Supabase
      </h1>

      <div className="mt-8">
        {creators?.map((creator) => (
          <div key={creator.id}>
            <h2>{creator.name}</h2>
            <p>{creator.slug}</p>
          </div>
        ))}
      </div>
    </main>
  );
}