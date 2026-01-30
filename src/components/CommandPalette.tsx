"use client";

import { useState, useEffect } from "react";
import { Search, Command, ArrowRight, CornerDownLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface SurahItem {
  nomor: string; // API returns string usually
  nama: string; // This is the Latin name based on our mapping
  asma: string; // Arabic name
  keterangan: string; // Description/Arti replacement
  // We might not have 'arti' property in the clean interface, let's check safety
}

export default function CommandPalette({ surahs }: { surahs: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Toggle dengan Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter Logic - Safe Access
  // Pastikan properti ada sebelum toLowerCase()
  const filtered = surahs
    .filter((s) => {
      const nameMatch = s.nama
        ? s.nama.toLowerCase().includes(query.toLowerCase())
        : false;
      const numberMatch = s.nomor ? s.nomor.toString() === query : false;
      // Cek properti lain jika ada (misal 'arti' atau 'keterangan')
      // Jika tidak ada, fallback ke false
      return nameMatch || numberMatch;
    })
    .slice(0, 5);

  const handleSelect = (id: string) => {
    router.push(`/surah/${id}`);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <>
      {/* Trigger Button (Floating) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 w-12 h-12 md:w-14 md:h-14 bg-slate-900 border border-sky-500/50 rounded-2xl shadow-[0_0_30px_rgba(14,165,233,0.3)] flex items-center justify-center text-sky-400 hover:scale-110 active:scale-95 transition-all group"
      >
        <Search className="w-5 h-5 md:w-6 md:h-6 group-hover:text-white transition-colors" />
        <span className="absolute -top-10 right-0 bg-slate-800 text-xs px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
          Ctrl + K
        </span>
      </button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Palette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-xl bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-panel"
            >
              {/* Search Input */}
              <div className="flex items-center px-4 py-4 border-b border-white/5 gap-3">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search surah (e.g. Yasin, 36)..."
                  className="flex-1 bg-transparent text-lg text-white placeholder-slate-500 focus:outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1 text-[10px] text-slate-500 font-mono border border-white/10 px-1.5 py-0.5 rounded hover:text-white"
                >
                  <span className="text-xs">ESC</span>
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {query === "" ? (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    <Command className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    Type to find any Surah instantly.
                  </div>
                ) : filtered.length > 0 ? (
                  <div className="space-y-1">
                    {filtered.map((s) => (
                      <button
                        key={s.nomor}
                        onClick={() => handleSelect(s.nomor)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-sky-500/10 hover:border-sky-500/20 border border-transparent transition-all group text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-mono text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                            {s.nomor}
                          </div>
                          <div>
                            <h4 className="text-white font-bold group-hover:text-sky-300 transition-colors">
                              {s.nama}
                            </h4>
                            {/* Fallback description since 'arti' is likely missing */}
                            <p className="text-xs text-slate-400 italic">
                              Surah ke-{s.nomor}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-arabic text-lg text-white/50 group-hover:text-white">
                            {s.asma}
                          </span>
                          <CornerDownLeft className="w-4 h-4 text-slate-600 group-hover:text-sky-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-slate-500 text-sm">
                    No surah found for "{query}"
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 bg-black/20 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500">
                <span>Alquran-Han Search</span>
                <div className="flex gap-3">
                  <span>
                    Select <ArrowRight className="inline w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
