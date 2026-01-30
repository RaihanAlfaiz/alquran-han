"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function SurahInfoModal({
  info,
  surahName,
}: {
  info: string;
  surahName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel hover:bg-white/10 transition-colors text-xs font-bold text-sky-400 tracking-widest uppercase group mx-auto"
      >
        <Info className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span>Surah Info</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-lg max-h-[80vh] flex flex-col glass-panel bg-[#0f172a] border border-sky-500/20 rounded-3xl overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {surahName}
                    </h3>
                    <p className="text-xs text-sky-400 font-bold tracking-widest uppercase mt-1">
                      Background & Context
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content - Scrollable */}
                <div className="p-6 overflow-y-auto text-left leading-relaxed text-slate-300 text-sm md:text-base space-y-4 font-light">
                  <div dangerouslySetInnerHTML={{ __html: info }} />
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-white/5 text-center">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-bold text-white/50 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Close Information
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
