"use client";

import { useState, useEffect } from "react";
import { useKhatam } from "@/context/KhatamContext";
import { useBookmark } from "@/context/BookmarkContext";
import Link from "next/link";
import {
  ChevronLeft,
  Target,
  Calendar,
  CheckCircle,
  Flame,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { surahList } from "@/lib/surah-list";
import { getSurahAyahFromGlobalIndex } from "@/lib/khatam-utils";

export default function KhatamPage() {
  const {
    state,
    startKhatam,
    updateProgress,
    resetKhatam,
    dailyGoal,
    percentage,
  } = useKhatam();
  const { lastRead } = useBookmark();

  // Setup State
  const [targetDays, setTargetDays] = useState<number>(30);
  const [targetDateInput, setTargetDateInput] = useState<string>("");

  // Update State
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [selectedAyah, setSelectedAyah] = useState<number>(1);

  // Sync with current progress on mount
  useEffect(() => {
    if (state.isActive) {
      const { surahNomor, ayahNomor } = getSurahAyahFromGlobalIndex(
        state.currentGlobalIndex,
      );
      setSelectedSurah(surahNomor);
      setSelectedAyah(ayahNomor);
    }
  }, [state.isActive, state.currentGlobalIndex]);

  const handleStartKhatam = () => {
    const date = new Date();
    if (targetDateInput) {
      startKhatam(targetDateInput);
    } else {
      date.setDate(date.getDate() + targetDays);
      startKhatam(date.toISOString());
    }
  };

  const handleUpdate = () => {
    updateProgress(selectedSurah, selectedAyah);
  };

  const handleSyncLastRead = () => {
    if (lastRead) {
      updateProgress(
        parseInt(lastRead.surahNomor),
        parseInt(lastRead.ayatNomor),
      );
    }
  };

  const currentSurahName =
    surahList.find((s) => s.nomor === selectedSurah)?.nama_latin ||
    "Al-Fatihah";

  if (!state.isActive) {
    return (
      <div className="min-h-screen p-6 pb-32 max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
        <Link
          href="/"
          className="absolute top-6 left-6 text-slate-400 hover:text-white transition"
        >
          <ChevronLeft size={24} />
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-3xl w-full"
        >
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="text-emerald-400 w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Start Your Khatam Journey
          </h1>
          <p className="text-slate-400 mb-8">
            Set a goal to complete the Quran. We'll track your daily progress.
          </p>

          <div className="space-y-6 text-left">
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Target Duration (Days)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[30, 40, 60].map((days) => (
                  <button
                    key={days}
                    onClick={() => {
                      setTargetDays(days);
                      setTargetDateInput("");
                    }}
                    className={`p-3 rounded-xl border ${targetDays === days && !targetDateInput ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-white/10 text-slate-400 hover:bg-white/5"}`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-900 px-2 text-slate-500">
                  OR SELECT DATE
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Target Date
              </label>
              <input
                type="date"
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 transition"
                onChange={(e) => {
                  setTargetDateInput(e.target.value);
                  setTargetDays(0);
                }}
              />
            </div>

            <button
              onClick={handleStartKhatam}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Start Tracking
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const daysLeft = state.targetDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(state.targetDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  return (
    <div className="min-h-screen p-6 pb-32 max-w-3xl mx-auto">
      <header className="flex items-center gap-4 mb-8 sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md py-4 -mx-6 px-6 border-b border-white/5">
        <Link
          href="/"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition text-white"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-white">Khatam Tracker</h1>
        <button
          onClick={resetKhatam}
          className="ml-auto text-xs text-rose-400 hover:text-rose-300"
        >
          Reset
        </button>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-panel p-5 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="mb-2 text-emerald-400">
            <Target size={24} />
          </div>
          <p className="text-2xl font-bold text-white mb-1">{percentage}%</p>
          <p className="text-xs text-slate-400">Completed</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="mb-2 text-amber-400">
            <Flame size={24} />
          </div>
          <p className="text-2xl font-bold text-white mb-1">{state.streak}</p>
          <p className="text-xs text-slate-400">Day Streak</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 rounded-3xl mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Daily Target</h2>
            <p className="text-slate-400 text-sm">
              To finish in {daysLeft} days
            </p>
          </div>
          <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium text-white">
            Goal: {dailyGoal} Ayahs
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-400"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="text-right text-xs text-slate-400">
          {state.currentGlobalIndex} / 6236 Ayahs
        </p>
      </motion.div>

      <div className="glass-panel p-6 rounded-3xl">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-sky-400" />
          Update Progress
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Surah</label>
            <select
              value={selectedSurah}
              onChange={(e) => {
                setSelectedSurah(parseInt(e.target.value));
                setSelectedAyah(1);
              }}
              className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-sky-500"
            >
              {surahList.map((surah) => (
                <option key={surah.nomor} value={surah.nomor}>
                  {surah.nomor}. {surah.nama_latin}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Ayah</label>
            <select
              value={selectedAyah}
              onChange={(e) => setSelectedAyah(parseInt(e.target.value))}
              className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-sky-500"
            >
              {Array.from({
                length: surahList[selectedSurah - 1].jumlah_ayat,
              }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Ayah {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleUpdate}
          className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-xl transition mb-4"
        >
          Update Progress
        </button>

        {lastRead && (
          <button
            onClick={handleSyncLastRead}
            className="w-full border border-white/10 text-slate-300 hover:bg-white/5 py-3 rounded-xl transition text-sm flex items-center justify-center gap-2"
          >
            <CheckCircle size={16} />
            Sync with Last Read ({lastRead.surahNama}: {lastRead.ayatNomor})
          </button>
        )}
      </div>
    </div>
  );
}
