import { supabase } from "@/lib/supabase";

export default async function TestClubsPage() {
  const { data: clubs, error } = await supabase
    .from("clubs")
    .select("*")
    .order("name");

  if (error) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        <h1 className="text-4xl font-bold text-red-500">
          Clubs Error
        </h1>
        <p>{error.message}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <h1 className="text-4xl font-bold text-cyan-400">
        Clubs Connected
      </h1>

      <p className="mt-4 text-xl">
        {clubs?.length || 0} clubs found
      </p>

      <div className="mt-8 space-y-3">
        {clubs?.map((club) => (
          <div key={club.id}>
            <h2 className="text-2xl font-bold">{club.name}</h2>
            <p className="text-gray-400">
              {club.league} • {club.country}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}