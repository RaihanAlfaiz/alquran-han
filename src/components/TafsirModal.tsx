"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Quote } from "lucide-react";
import { useEffect } from "react";

interface TafsirModalProps {
  isOpen: boolean;
  onClose: () => void;
  tafsirText: string;
  surahName: string;
  ayahNumber: string;
}

export default function TafsirModal({
  isOpen,
  onClose,
  tafsirText,
  surahName,
  ayahNumber,
}: TafsirModalProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    Tafsir Kemenag (Ringkas)
                  </h3>
                  <p className="text-white/40 text-xs uppercase tracking-wider">
                    {surahName} • Verse {ayahNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content SCROLLABLE */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-white/5 rotate-180" />
                <div
                  className="text-white/80 leading-relaxed text-base md:text-lg font-light space-y-4"
                  dangerouslySetInnerHTML={{ __html: tafsirText }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/5 bg-white/5 text-center">
              <span className="text-[10px] text-white/30 uppercase tracking-widest">
                Sumber: Kementrian Agama RI
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
