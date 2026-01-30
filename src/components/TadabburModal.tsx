"use client";

import { useState, useEffect } from "react";
import { PenLine, X, Save, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TadabburModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: string;
  ayahNumber: string;
  surahName: string;
}

export default function TadabburModal({
  isOpen,
  onClose,
  surahNumber,
  ayahNumber,
  surahName,
}: TadabburModalProps) {
  const [note, setNote] = useState("");
  const key = `alquran-han-note-${surahNumber}-${ayahNumber}`;

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(key);
      if (saved) setNote(saved);
      else setNote("");
    }
  }, [isOpen, key]);

  const handleSave = () => {
    localStorage.setItem(key, note);
    onClose();
  };

  const handleDelete = () => {
    localStorage.removeItem(key);
    setNote("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg glass-panel bg-[#0f172a] rounded-3xl p-6 border border-white/10 shadow-2xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <PenLine className="text-sky-400" size={20} />
                  Tadabbur Journal
                </h3>
                <p className="text-sm text-slate-400">
                  {surahName} : Ayah {ayahNumber}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            <textarea
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write your reflections, meaning, or connection to this verse..."
              className="w-full h-48 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 resize-none font-serif leading-relaxed"
            />

            <div className="flex justify-between mt-6">
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition text-sm font-bold"
              >
                <Trash2 size={16} /> Delete
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20 transition font-bold"
              >
                <Save size={18} /> Save Note
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
