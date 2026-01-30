"use client";

import { useState, useEffect } from "react";
import { Ayah } from "@/lib/api";
import AyahItem from "./AyahItem";
import {
  Maximize2,
  Minimize2,
  Type,
  ArrowDownCircle,
  PauseCircle,
  Eye,
  EyeOff,
  Palette,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SurahReader({
  ayat,
  surah,
  tajwidMap,
  tafsirMap,
}: {
  ayat: Ayah[];
  surah: { nomor: string; nama: string };
  tajwidMap?: Record<string, string>;
  tafsirMap?: Record<string, string>;
}) {
  const [isZenMode, setIsZenMode] = useState(false);
  const [isTajwidMode, setIsTajwidMode] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState(1);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(0);

  // HAFALAN MODE STATE
  // 0 = Normal, 1 = Blur Arabic, 2 = Blur Translation
  const [hafalanMode, setHafalanMode] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoScrollSpeed > 0) {
      interval = setInterval(() => {
        window.scrollBy({ top: 1, behavior: "auto" });
      }, 50 / autoScrollSpeed);
    }
    return () => clearInterval(interval);
  }, [autoScrollSpeed]);

  const toggleScroll = () => {
    setAutoScrollSpeed((prev) => (prev === 0 ? 1 : 0));
  };

  // Helper untuk toggle hafalan
  const cycleHafalan = () => {
    setHafalanMode((prev) => (prev + 1) % 3);
  };

  return (
    <div
      className={`transition-all duration-700 ${isZenMode ? "fixed inset-0 z-[200] bg-[#050510] overflow-y-auto px-4 py-20" : ""}`}
    >
      {/* --- READER CONTROLS (Floating) --- */}
      <motion.div
        className={`fixed top-24 right-6 flex flex-col gap-3 z-[201] transition-opacity duration-300 ${isZenMode ? "opacity-20 hover:opacity-100" : "opacity-100"}`}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        {/* Zen Toggle */}
        <button
          onClick={() => setIsZenMode(!isZenMode)}
          className="p-3 rounded-full glass-panel bg-slate-900/80 text-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-400 shadow-xl transition-all"
          title={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
        >
          {isZenMode ? (
            <Minimize2 className="w-5 h-5" />
          ) : (
            <Maximize2 className="w-5 h-5" />
          )}
        </button>

        {!isZenMode && (
          <>
            {/* Font Size */}
            <button
              onClick={() => setFontSizeLevel((prev) => (prev + 1) % 3)}
              className="p-3 rounded-full glass-panel bg-slate-900/80 text-white hover:bg-white/10"
              title="Change Font Size"
            >
              <Type className="w-5 h-5" />
            </button>

            {/* Auto Scroll */}
            <button
              onClick={toggleScroll}
              className={`p-3 rounded-full glass-panel shadow-xl transition-all ${autoScrollSpeed > 0 ? "bg-green-500/20 text-green-400 border-green-500/50" : "bg-slate-900/80 text-white hover:bg-white/10"}`}
              title="Auto Scroll"
            >
              {autoScrollSpeed > 0 ? (
                <PauseCircle className="w-5 h-5" />
              ) : (
                <ArrowDownCircle className="w-5 h-5" />
              )}
            </button>

            {/* HAFALAN TOGGLE */}
            <button
              onClick={cycleHafalan}
              className={`p-3 rounded-full glass-panel shadow-xl transition-all ${hafalanMode > 0 ? "bg-rose-500/20 text-rose-400 border-rose-500/50" : "bg-slate-900/80 text-white hover:bg-white/10"}`}
              title="Memorization Mode (Blur Text)"
            >
              {hafalanMode === 0 ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
              {hafalanMode > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-[10px] px-2 h-4 rounded-full flex items-center justify-center font-bold">
                  {hafalanMode === 1 ? "AR" : "TR"}
                </span>
              )}
            </button>

            {/* TAJWID TOGGLE */}
            <button
              onClick={() => setIsTajwidMode(!isTajwidMode)}
              className={`p-3 rounded-full glass-panel shadow-xl transition-all ${isTajwidMode ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/50" : "bg-slate-900/80 text-white hover:bg-white/10"}`}
              title="Tajwid Mode"
            >
              <Palette className="w-5 h-5" />
              {isTajwidMode && (
                <span className="absolute -top-2 -right-2 bg-indigo-500 text-[10px] px-2 h-4 rounded-full flex items-center justify-center font-bold">
                  ON
                </span>
              )}
            </button>
          </>
        )}
      </motion.div>

      {/* --- ZEN HEADER --- */}
      <AnimatePresence>
        {isZenMode && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none"
          >
            <div className="pointer-events-auto">
              <h2 className="text-white/50 text-sm font-bold tracking-[0.3em] uppercase">
                {surah.nama}
              </h2>
            </div>

            <div className="pointer-events-auto flex items-center gap-4">
              <button
                onClick={cycleHafalan}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/50 hover:bg-white/10"
              >
                {hafalanMode === 0 ? (
                  <Eye className="w-3 h-3" />
                ) : (
                  <EyeOff className="w-3 h-3 text-rose-400" />
                )}
                <span>
                  {hafalanMode === 0
                    ? "View All"
                    : hafalanMode === 1
                      ? "Blur Arab"
                      : "Blur Trans"}
                </span>
              </button>

              <div className="flex gap-2">
                {[0, 1, 2, 3].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setAutoScrollSpeed(speed)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs font-bold transition-all ${
                      autoScrollSpeed === speed
                        ? "bg-sky-500 border-sky-400 text-white"
                        : "bg-white/5 border-white/10 text-white/30 hover:bg-white/10"
                    }`}
                  >
                    {speed === 0 ? "OFF" : `${speed}x`}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CONTENT STREAM --- */}
      <div
        className={`max-w-3xl mx-auto px-6 transition-all duration-500 ${isZenMode ? "pt-32 pb-64" : ""}`}
      >
        <div
          style={{
            zoom: fontSizeLevel === 0 ? 0.85 : fontSizeLevel === 1 ? 1 : 1.25,
          }}
        >
          {ayat.map((ayah) => (
            <div
              key={ayah.nomor}
              className={
                hafalanMode === 1
                  ? "blur-arabic"
                  : hafalanMode === 2
                    ? "blur-trans"
                    : ""
              }
            >
              <AyahItem
                ayah={ayah}
                surah={surah}
                tajwidText={
                  isTajwidMode && tajwidMap ? tajwidMap[ayah.nomor] : undefined
                }
                tafsirData={tafsirMap ? tafsirMap[ayah.nomor] : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
