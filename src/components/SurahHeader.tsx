"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { SurahInfo } from "@/lib/surah-list";

interface SurahHeaderProps {
  surah: SurahInfo;
}

export default function SurahHeader({ surah }: SurahHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      // Padding normal saja, tidak perlu padding raksasa karena parent sudah handle
      className="pb-12 text-center relative flex flex-col items-center w-full"
    >
      <Link
        href="/"
        // Tombol Back "Fixed" mungkin mengganggu di desktop jika layout berubah
        // Ganti jadi "Absolute" relatif terhadap container konten, atau biarkan fixed tapi posisikan cerdas
        className="fixed top-24 left-6 md:absolute md:top-0 md:left-0 z-40 p-3 rounded-full bg-slate-900/50 backdrop-blur-md border border-white/10 text-white/60 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </Link>

      <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 mb-8 backdrop-blur-sm">
          <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-bold">
            {surah.tempat_turun}
          </span>
          <span className="w-1 h-1 rounded-full bg-emerald-500/40" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-bold">
            {surah.jumlah_ayat} Verses
          </span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">
          {surah.nama_latin}
        </h1>

        <p className="text-lg md:text-2xl text-white/40 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
          {surah.arti}
        </p>

        {surah.nomor !== 9 && surah.nomor !== 1 && (
          <div className="flex justify-center mt-8 mb-4 w-full border-b border-white/5 pb-12 w-2/3">
            <p
              className="text-3xl md:text-5xl text-white/60 font-arabic leading-relaxed"
              style={{ fontFamily: "'Amiri', serif" }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>
        )}
      </div>
    </motion.header>
  );
}
