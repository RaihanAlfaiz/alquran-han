"use client";

import { motion } from "framer-motion";
import SurahCard from "./SurahCard";
import { SurahInfo } from "@/lib/surah-list";

interface SurahGridProps {
  surahs: SurahInfo[];
}

export default function SurahGrid({ surahs }: SurahGridProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-32">
      {/* List Header */}
      <div className="hidden md:flex pb-3 mb-6 border-b border-white/10 items-center justify-between text-[11px] font-bold tracking-widest text-emerald-400/60 uppercase px-2">
        <span>Surah Collection</span>
        <span>Arabic Name</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-x-8 md:gap-y-6">
        {surahs.map((surah, index) => (
          <SurahCard key={surah.nomor} surah={surah} index={index} />
        ))}
      </div>
    </div>
  );
}
