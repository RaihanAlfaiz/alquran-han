"use client";

import { useState } from "react";
import { moodList, Mood } from "@/lib/moods";
import { X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function MoodWidget() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-white font-bold text-lg tracking-wide">
          Apa yang kamu rasakan hari ini?
        </h3>
        <span className="text-xs text-slate-400">Feelings</span>
      </div>

      {/* Mood List (Buttons) */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {moodList.map((mood) => (
          <button
            key={mood.id}
            onClick={() => setSelectedMood(mood)}
            className={`flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 group ${
              selectedMood?.id === mood.id
                ? "bg-slate-800 border-sky-500 scale-105 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
            }`}
          >
            <span className="text-xl group-hover:scale-125 transition-transform duration-300 block">
              {mood.emoji}
            </span>
            <span
              className={`text-sm font-bold ${selectedMood?.id === mood.id ? "text-sky-400" : "text-slate-300"}`}
            >
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      {/* Recommendations Panel (Expands when mood selected) */}
      <AnimatePresence mode="wait">
        {selectedMood && (
          <motion.div
            key={selectedMood.id}
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="overflow-hidden"
          >
            <div
              className={`mt-2 rounded-3xl bg-gradient-to-r ${selectedMood.color} p-[1px] relative`}
            >
              <div className="absolute inset-0 bg-white/10 blur-xl opacity-50" />

              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-[23px] p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white flex items-center gap-2">
                      {selectedMood.emoji} Obat untuk {selectedMood.label}
                    </h4>
                    <p className="text-sm text-slate-400 mt-1">
                      Cobalah membaca atau mendengarkan surah ini:
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedMood(null)}
                    className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedMood.surahs.map((item, idx) => (
                    <Link
                      key={idx}
                      href={`/surah/${item.nomor}`}
                      className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                            QS {item.nomor}
                          </span>
                          <span className="font-bold text-white group-hover:text-sky-300 transition-colors">
                            {item.nama}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 font-light italic">
                          "{item.reason}"
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-sky-400 -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
