"use client";

import { useAudio } from "@/context/AudioContext";
import { Pause, Play, Settings2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AudioSettingsModal from "./AudioSettingsModal";

export default function GlobalPlayer() {
  const {
    currentSurah,
    isPlaying,
    togglePlay,
    duration,
    currentTime,
    qari,
    sleepTimer,
    startSleepTimer,
    cancelSleepTimer,
  } = useAudio();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (!currentSurah) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        key="player-bar"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 pt-2 pointer-events-none"
      >
        <div className="pointer-events-auto max-w-lg mx-auto bg-slate-900/90 backdrop-blur-2xl border border-sky-500/30 rounded-full shadow-[0_0_50px_rgba(14,165,233,0.4)] p-3 flex items-center justify-between gap-4 relative overflow-hidden group">
          {/* === AUDIO VISUALIZER (Liquid Waves) === */}
          {/* Hanya muncul saat playing untuk efek dramatis */}
          <div className="absolute inset-0 flex items-end justify-center gap-[2px] opacity-20 pointer-events-none pb-2">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-t-full bg-sky-400 transition-all duration-100 ${isPlaying ? "animate-music-bar" : "h-1"}`}
                style={{
                  // Randomize animation delay for organic look
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${0.4 + Math.random() * 0.4}s`,
                }}
              />
            ))}
          </div>

          {/* Progress Bar Background (Thin Line at Bottom) */}
          <div className="absolute bottom-0 left-0 h-[3px] bg-white/10 w-full">
            <div
              className="h-full bg-sky-400 shadow-[0_0_10px_#38bdf8] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Info */}
          <div className="flex items-center gap-3 pl-2 flex-1 min-w-0 relative z-10">
            {/* Spinning Vinyl Effect */}
            <div
              className={`w-10 h-10 rounded-full bg-slate-950 border border-sky-500/30 flex items-center justify-center relative overflow-hidden ${isPlaying ? "animate-spin-slow" : ""}`}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-500 to-transparent opacity-50" />
              <span className="text-[10px] font-bold text-white relative z-10">
                {currentSurah.nomor}
              </span>
            </div>

            <div className="flex flex-col truncate">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest truncate flex items-center gap-2">
                Now Playing
                {isPlaying && (
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                )}
              </span>
              <span className="text-sm font-bold text-white truncate">
                {currentSurah.name}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 pr-2 relative z-10">
            <p className="hidden sm:block text-[10px] font-mono text-sky-400/80">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-10 h-10 rounded-full bg-slate-800 text-sky-400 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-all border border-sky-500/20"
              title={`Qari: ${qari?.name || "Default"}`}
            >
              <Settings2 className="w-4 h-4" />
            </button>

            {/* SLEEP TIMER */}
            <button
              onClick={() => {
                // Cycle timers: Off -> 15 -> 30 -> 60 -> Off
                if (!sleepTimer) startSleepTimer(15);
                else if (sleepTimer === 15) startSleepTimer(30);
                else if (sleepTimer === 30) startSleepTimer(60);
                else cancelSleepTimer();
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border border-sky-500/20 text-xs font-bold ${sleepTimer ? "bg-indigo-500 text-white animate-pulse" : "bg-slate-800 text-sky-400 hover:bg-slate-700"}`}
              title="Sleep Timer"
            >
              {sleepTimer ? `${sleepTimer}m` : <Clock className="w-4 h-4" />}
            </button>

            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-1" />
              )}
            </button>
          </div>
        </div>
      </motion.div>
      <AudioSettingsModal
        key="settings-modal"
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </AnimatePresence>
  );
}
