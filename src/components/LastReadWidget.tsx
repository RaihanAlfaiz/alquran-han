"use client";

import { useBookmark } from "@/context/BookmarkContext";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export default function LastReadWidget() {
  const { lastRead } = useBookmark();

  if (!lastRead) return null;

  return (
    <div className="w-full mb-8">
      <Link href={`/surah/${lastRead.surahNomor}#ayah-${lastRead.ayatNomor}`}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 to-indigo-700 p-6 md:p-8 flex items-center justify-between group shadow-2xl border border-sky-400/20">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)",
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-sky-200 mb-2">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest uppercase">
                Continue Reading
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
              {lastRead.surahNama}
            </h2>
            <p className="text-white/80 font-medium">
              Verse {lastRead.ayatNomor}
            </p>
          </div>

          <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all group-hover:scale-110">
            <ArrowRight className="w-6 h-6 text-white" />
          </div>
        </div>
      </Link>
    </div>
  );
}
