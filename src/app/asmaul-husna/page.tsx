"use client";

import { useState } from "react";
import { asmaulHusnaList } from "@/lib/asmaul-husna";
import { motion } from "framer-motion";
import { Sparkles, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AsmaulHusnaPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Play audio on hover logic could go here

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#02020a]" />
        <div className="absolute top-0 left-0 w-full h-[500px] bg-indigo-900/20 blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-full h-[500px] bg-purple-900/10 blur-[120px]" />

        {/* Stars */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-0 animate-pulse-slow"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: Math.random() < 0.5 ? "1px" : "2px",
              height: Math.random() < 0.5 ? "1px" : "2px",
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <header className="mb-12 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </Link>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400">
            Asmaul Husna
          </h1>
          <Sparkles className="w-6 h-6 text-purple-400" />
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {asmaulHusnaList.map((item) => (
            <motion.div
              key={item.index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: item.index * 0.05 }}
              onMouseEnter={() => setHoveredIndex(item.index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                            relative aspect-square rounded-2xl border flex flex-col items-center justify-center text-center p-4 transition-all duration-300 cursor-pointer overflow-hidden group
                            ${hoveredIndex === item.index ? "bg-white/10 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.3)] scale-105 z-10" : "bg-white/5 border-white/5 hover:border-white/20"}
                        `}
            >
              {/* Nebula Effect on Hover */}
              {hoveredIndex === item.index && (
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl" />
              )}

              <div className="relative z-10">
                <h2 className="font-arabic text-3xl md:text-4xl lg:text-5xl mb-2 text-white group-hover:scale-110 transition-transform">
                  {item.arabic}
                </h2>
                <p className="text-sm font-bold text-indigo-200 mb-1">
                  {item.latin}
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">
                  {item.translation_id}
                </p>
              </div>

              <div className="absolute top-3 right-3 text-[10px] font-mono text-white/20">
                {item.index}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center text-white/20 text-sm">
          Showing Top 20 Names (Demo Mode)
        </div>
      </div>
    </div>
  );
}
