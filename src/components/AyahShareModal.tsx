"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share2, Check, RefreshCw } from "lucide-react";
import { toPng } from "html-to-image";
import { Ayah } from "@/lib/api";

interface AyahShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  ayah: Ayah;
  surahName: string;
}

const GRADIENTS = [
  "from-[#0f172a] to-[#1e1b4b]", // Default Dark
  "from-indigo-500 to-purple-500", // Vibrant
  "from-sky-400 to-blue-600", // Sky
  "from-emerald-400 to-cyan-500", // Fresh
  "from-rose-400 to-orange-500", // Sunset
  "from-slate-900 to-black", // Midnight
];

export default function AyahShareModal({
  isOpen,
  onClose,
  ayah,
  surahName,
}: AyahShareModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!ref.current) return;
    setIsGenerating(true);

    try {
      // Small delay to ensure render
      await new Promise((r) => setTimeout(r, 100));

      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 2, // High res
      });

      const link = document.createElement("a");
      link.download = `alquran-han-${surahName}-${ayah.nomor}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row bg-[#0f172a] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
          >
            {/* LEFT: PREVIEW AREA */}
            <div className="flex-1 p-8 md:p-12 flex items-center justify-center bg-black/50 overflow-y-auto">
              <div
                ref={ref}
                className={`w-full max-w-[400px] aspect-[4/5] rounded-none p-8 flex flex-col items-center justify-center text-center relative bg-gradient-to-br ${selectedGradient}`}
              >
                {/* Decorative Patterns/Noise */}
                <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] mix-blend-overlay" />
                <div className="absolute inset-0 border-[12px] border-white/10" />

                <div className="relative z-10 flex-1 flex flex-col justify-center gap-6">
                  <div className="w-12 h-1 bg-white/30 rounded-full mx-auto" />

                  <p className="font-arabic text-3xl md:text-4xl text-white leading-relaxed drop-shadow-md">
                    {ayah.ar}
                  </p>

                  <div className="space-y-2">
                    <p className="text-white/90 text-sm font-medium italic px-4">
                      "{ayah.id}"
                    </p>
                  </div>
                </div>

                <div className="relative z-10 mt-8 pt-6 border-t border-white/20 w-full flex justify-between items-center px-2">
                  <div className="text-left">
                    <p className="text-white font-bold uppercase tracking-widest text-xs">
                      {surahName}
                    </p>
                    <p className="text-white/60 text-[10px]">
                      Verse {ayah.nomor}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-xs">Alquran-Han</p>
                    <p className="text-white/60 text-[10px]">Digital Quran</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: CONTROLS */}
            <div className="w-full md:w-80 bg-white/5 border-l border-white/5 p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-bold text-lg">Customize</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Theme Selector */}
              <div>
                <label className="text-xs text-white/40 uppercase tracking-wider font-bold mb-3 block">
                  Background Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {GRADIENTS.map((g, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedGradient(g)}
                      className={`w-full aspect-square rounded-xl bg-gradient-to-br ${g} border-2 transition-all ${selectedGradient === g ? "border-white scale-110 shadow-lg" : "border-transparent hover:scale-105"}`}
                    >
                      {selectedGradient === g && (
                        <Check className="w-4 h-4 text-white mx-auto drop-shadow-md" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1" />

              <button
                disabled={isGenerating}
                onClick={handleDownload}
                className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(14,165,233,0.3)]"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Engine
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
