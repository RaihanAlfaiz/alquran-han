"use client";

import { useAudio } from "@/context/AudioContext";
import { Mic2, Check, X } from "lucide-react";
import { qariList } from "@/lib/reciters";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function AudioSettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { qari, changeQari } = useAudio();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-sm bg-[#0f172a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden glass-panel"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <Mic2 className="w-5 h-5 text-sky-400" />
                <h3 className="text-white font-bold">Select Reciter</h3>
              </div>
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {qariList.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    changeQari(item);
                    onClose();
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all group ${qari.id === item.id ? "bg-sky-500/20 border-sky-500/50 border" : "hover:bg-white/5 border border-transparent"}`}
                >
                  <div>
                    <p
                      className={`font-bold text-sm ${qari.id === item.id ? "text-sky-400" : "text-white"}`}
                    >
                      {item.name}
                    </p>
                    <p className="text-[10px] text-white/40 group-hover:text-white/60">
                      High Quality Audio
                    </p>
                  </div>
                  {qari.id === item.id && (
                    <Check className="w-4 h-4 text-sky-400" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-4 text-center border-t border-white/5 bg-white/5">
              <p className="text-[10px] text-white/30">
                Audio provided by mp3quran.net
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
