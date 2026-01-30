import { getAllSurahs } from "@/lib/api";
import SurahCard from "@/components/SurahCard";
import LastReadWidget from "@/components/LastReadWidget";
import MoodWidget from "@/components/MoodWidget";
import CommandPalette from "@/components/CommandPalette";
import { BookOpen } from "lucide-react";

export default async function Home() {
  const surahs = await getAllSurahs();

  return (
    <main className="min-h-screen pt-[160px] pb-32 relative">
      {/* COMMAND PALETTE (Global Search) */}
      <CommandPalette surahs={surahs} />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-4 gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-[0_0_40px_rgba(56,189,248,0.5)] transform rotate-3 hover:rotate-6 transition-transform">
              <BookOpen className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white drop-shadow-lg">
                Alquran<span className="text-sky-400">-Han</span>
              </h1>
              <p className="text-sky-200/60 text-sm font-medium tracking-widest uppercase mt-1">
                Digital Recitation by Raihan
              </p>
            </div>
          </div>

          <div className="px-6 py-2 rounded-full glass-panel text-xs font-bold text-sky-300 tracking-[0.2em] border border-sky-500/20 shadow-lg animate-pulse-slow">
            {surahs.length} SURAHS AVAILABLE
          </div>
        </header>

        {/* WIDGETS AREA */}
        <div className="flex flex-col gap-6">
          <LastReadWidget />
          <MoodWidget />
        </div>

        {/* Grid Layout */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surahs.map((surah) => (
            <SurahCard key={surah.nomor} surah={surah} />
          ))}
        </section>
      </div>
    </main>
  );
}
