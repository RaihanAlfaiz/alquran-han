"use client";

import Link from "next/link";
import { useBookmark } from "@/context/BookmarkContext";
import { BookOpen, ChevronRight, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function LastReadWidget() {
  const { lastRead } = useBookmark();

  if (!lastRead) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full mb-0"
    >
      <Link href={`/surah/${lastRead.surahNomor}#ayah-${lastRead.ayatNomor}`}>
        <div className="group relative overflow-hidden rounded-2xl glass-card p-6 flex items-center justify-between hover:bg-white/5 transition-all duration-500 border border-white/10 hover:border-sky-500/30">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform duration-500">
              <BookOpen className="w-6 h-6" />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sky-400/80 text-xs font-bold tracking-widest uppercase mb-1">
                <Clock className="w-3 h-3" />
                <span>Continue Reading</span>
              </div>
              <h3 className="text-xl md:text-3xl font-bold text-white font-arabic group-hover:text-sky-200 transition-colors">
                Surah {lastRead.surahNama}
              </h3>
              <p className="text-white/50 text-sm">Ayah {lastRead.ayatNomor}</p>
            </div>
          </div>

          <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 group-hover:bg-sky-500 group-hover:text-white group-hover:border-transparent transition-all duration-300">
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
