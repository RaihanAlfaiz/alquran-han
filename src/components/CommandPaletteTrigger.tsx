"use client";

import { useState, useEffect } from "react";
import SearchPalette from "./SearchPalette";
import { Search } from "lucide-react";

export default function CommandPaletteTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* Floating Search Button (Mobile/Desktop) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-sky-400 shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:bg-slate-800 hover:text-white hover:border-sky-500/50 hover:shadow-[0_0_25px_rgba(56,189,248,0.2)] transition-all duration-300 group"
      >
        <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Hidden visual hint for desktop users (optional, can be placed in navbar) */}

      <SearchPalette isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
