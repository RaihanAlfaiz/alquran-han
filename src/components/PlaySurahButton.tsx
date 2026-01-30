"use client";

import { useAudio } from "@/context/AudioContext";
import { Play, Pause } from "lucide-react";

export default function PlaySurahButton({
  surah,
}: {
  surah: { name: string; url: string; nomor: string };
}) {
  const { playSurah, isPlaying, currentSurah } = useAudio();

  const isCurrent = currentSurah?.nomor === surah.nomor;
  const active = isCurrent && isPlaying;

  return (
    <button
      onClick={() => playSurah(surah)}
      className={`group relative flex items-center justify-center gap-3 px-8 py-4 rounded-full transition-all duration-300 shadow-xl ${
        active
          ? "bg-rose-500 hover:bg-rose-600 text-white"
          : "bg-gradient-to-r from-sky-500 to-indigo-600 hover:scale-105 text-white"
      }`}
    >
      {active ? (
        <>
          <Pause className="w-5 h-5 fill-current" />
          <span className="text-sm font-bold tracking-widest uppercase">
            Pause Audio
          </span>
        </>
      ) : (
        <>
          <Play className="w-5 h-5 fill-current ml-1" />
          <span className="text-sm font-bold tracking-widest uppercase">
            Listen Surah
          </span>
        </>
      )}

      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-full blur-xl opacity-40 transition-opacity ${active ? "bg-rose-500" : "bg-sky-500 group-hover:opacity-60"}`}
      />
    </button>
  );
}
