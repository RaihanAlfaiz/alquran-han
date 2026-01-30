import { getAllSurahs } from "@/lib/api";
import SurahCard from "@/components/SurahCard";
import LastReadWidget from "@/components/LastReadWidget";
import MoodWidget from "@/components/MoodWidget";
import CommandPalette from "@/components/CommandPalette";
import { BookOpen } from "lucide-react";
import PrayerTimesWidget from "@/components/PrayerTimesWidget";
import Link from "next/link";

export default async function Home() {
  const surahs = await getAllSurahs();

  return (
    <main className="min-h-screen pt-5 pb-32 relative">
      {/* COMMAND PALETTE (Global Search) - Moved to Layout via Trigger */}
      {/* <CommandPalette surahs={surahs} /> */}

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

        {/* QUICK MENU */}
        <div className="flex gap-4 mb-2 overflow-x-auto no-scrollbar">
          <Link
            href="/asmaul-husna"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/20 hover:border-indigo-500/50 transition-all flex-shrink-0 group"
          >
            <span className="text-xl group-hover:scale-125 transition-transform">
              🌌
            </span>
            <div>
              <h4 className="text-white font-bold text-sm">Asmaul Husna</h4>
              <p className="text-[10px] text-white/40">Cosmic 99 Names</p>
            </div>
          </Link>

          <Link
            href="/tasbih"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border border-emerald-500/20 hover:border-emerald-500/50 transition-all flex-shrink-0 group"
          >
            <span className="text-xl group-hover:scale-125 transition-transform">
              📿
            </span>
            <div>
              <h4 className="text-white font-bold text-sm">Digital Tasbih</h4>
              <p className="text-[10px] text-white/40">Haptic Counter</p>
            </div>
          </Link>

          <Link
            href="/khatam"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-br from-rose-900/50 to-pink-900/50 border border-rose-500/20 hover:border-rose-500/50 transition-all flex-shrink-0 group"
          >
            <span className="text-xl group-hover:scale-125 transition-transform">
              🎯
            </span>
            <div>
              <h4 className="text-white font-bold text-sm">Khatam Tracker</h4>
              <p className="text-[10px] text-white/40">Finish 30 Juz</p>
            </div>
          </Link>
        </div>

        {/* WIDGETS AREA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <LastReadWidget />
            <PrayerTimesWidget />
          </div>
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
