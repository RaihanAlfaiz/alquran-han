import Link from "next/link";
import GlassCard from "./GlassCard";
import { Surah } from "@/lib/api";

export default function SurahCard({ surah }: { surah: Surah }) {
  return (
    <Link href={`/surah/${surah.nomor}`} className="block h-full">
      <GlassCard
        hoverEffect={true}
        className="h-full flex flex-col justify-between group"
      >
        {/* Top Row: Number & Arabic Name */}
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-mono text-sky-400 font-bold group-hover:bg-sky-500/20 group-hover:text-sky-200 transition-colors">
            {surah.nomor}
          </div>
          <span className="font-arabic text-2xl text-slate-200 group-hover:text-white transition-colors group-hover:scale-110 duration-300 origin-right">
            {surah.asma}
          </span>
        </div>

        {/* Bottom Row: Latin Name & Meaning */}
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
            {surah.nama}
          </h3>
          <p className="text-sm text-slate-400 font-medium mt-1 uppercase tracking-wider text-[10px]">
            {surah.type} • {surah.ayat} Verses
          </p>
        </div>
      </GlassCard>
    </Link>
  );
}
