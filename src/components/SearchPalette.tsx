"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, CornerDownLeft, Hash, BookOpen } from "lucide-react";
import { surahList, SurahInfo } from "@/lib/surah-list";

interface SearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchPalette({ isOpen, onClose }: SearchPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredSurahs.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? filteredSurahs.length - 1 : prev - 1,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredSurahs[selectedIndex]) {
          handleSelect(filteredSurahs[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, query]); // Added dependencies

  // Filter Logic
  const filteredSurahs = useMemo(() => {
    if (!query) return surahList.slice(0, 5); // Show top 5 initially
    const lowerQuery = query.toLowerCase();
    return surahList
      .filter(
        (s) =>
          s.nama_latin.toLowerCase().includes(lowerQuery) ||
          s.arti.toLowerCase().includes(lowerQuery) ||
          s.nomor.toString() === lowerQuery ||
          s.nama.includes(query), // Arabic search
      )
      .slice(0, 7); // Limit results
  }, [query]);

  const handleSelect = (surah: SurahInfo) => {
    router.push(`/surah/${surah.nomor}`);
    onClose();
  };

  // Auto-scroll to selected item
  useEffect(() => {
    if (listRef.current && listRef.current.children[selectedIndex]) {
      listRef.current.children[selectedIndex].scrollIntoView({
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg relative bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh]"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10 bg-white/5">
              <Search className="w-5 h-5 text-white/40" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search surah (e.g. Yasin, 36, or 'Hati')..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 font-medium"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
              />
              <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-white/10 bg-white/5 px-2 font-mono text-[10px] items-center text-white/50">
                <span className="text-xs">ESC</span>
              </kbd>
            </div>

            {/* Results */}
            <ul
              ref={listRef}
              className="flex-1 overflow-y-auto p-2 scrollbar-hide py-2"
            >
              {filteredSurahs.length > 0 ? (
                filteredSurahs.map((surah, index) => (
                  <motion.li
                    key={surah.nomor}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`
                      group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                      ${selectedIndex === index ? "bg-sky-500/10 border-sky-500/20" : "hover:bg-white/5 border-transparent border"}
                    `}
                    onClick={() => handleSelect(surah)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    {/* Number Badge */}
                    <div
                      className={`
                        w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono border
                        ${selectedIndex === index ? "bg-sky-500 text-white border-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.4)]" : "bg-white/5 text-white/40 border-white/10"}
                      `}
                    >
                      {surah.nomor}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between mb-0.5">
                        <h4
                          className={`text-sm font-semibold truncate ${selectedIndex === index ? "text-sky-400" : "text-white"}`}
                        >
                          {surah.nama_latin}
                        </h4>
                        <span className="font-arabic text-lg text-white/60 ml-2">
                          {surah.nama}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-white/40 uppercase tracking-wider font-medium">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {surah.arti}
                        </span>
                        <span>•</span>
                        <span>{surah.jumlah_ayat} Verses</span>
                      </div>
                    </div>

                    {/* Enter Hint */}
                    {selectedIndex === index && (
                      <motion.div
                        layoutId="enter-hint"
                        className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-sky-400/70"
                      >
                        Select <CornerDownLeft className="w-3 h-3" />
                      </motion.div>
                    )}
                  </motion.li>
                ))
              ) : (
                <div className="py-12 text-center text-white/30 flex flex-col items-center gap-2">
                  <Command className="w-8 h-8 opacity-20 mb-2" />
                  <p className="text-sm">No surah found for "{query}"</p>
                </div>
              )}
            </ul>

            <div className="px-4 py-2 border-t border-white/10 bg-white/5 text-[10px] text-white/30 flex justify-between">
              <span>Navigate with arrows</span>
              <span>Al-Quran Han by Deepmind</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
