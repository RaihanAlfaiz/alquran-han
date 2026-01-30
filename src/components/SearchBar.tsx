"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { SurahInfo } from "@/lib/surah-list";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface SearchBarProps {
  surahs: SurahInfo[];
}

export default function SearchBar({ surahs }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const filtered = query
    ? surahs
        .filter(
          (s) =>
            s.nama_latin.toLowerCase().includes(query.toLowerCase()) ||
            s.arti.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 5)
    : [];

  return (
    // Component ini sekarang murni input, layout luar (centering) diatur parent page.tsx
    <div className="w-full max-w-xl relative">
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-white/40 group-focus-within:text-emerald-400 transition-colors" />
        </div>

        <input
          type="text"
          placeholder="Cari Surah atau Arti..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-2xl py-4 pl-14 pr-12 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-base shadow-2xl"
        />

        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-4 flex items-center text-white/40 hover:text-white p-2"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 ring-1 ring-white/10"
          >
            {filtered.map((s) => (
              <Link
                key={s.nomor}
                href={`/surah/${s.nomor}`}
                className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-emerald-500 w-6">
                    {s.nomor}
                  </span>
                  <div>
                    <span className="text-white font-medium block text-sm">
                      {s.nama_latin}
                    </span>
                    <span className="text-[10px] text-white/40">{s.arti}</span>
                  </div>
                </div>
                <span className="font-arabic text-gold text-lg group-hover:scale-110 transition-transform">
                  {s.nama}
                </span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
