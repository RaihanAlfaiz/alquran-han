"use client";

import Link from "next/link";
import { BookOpen, Github, Heart } from "lucide-react";

export default function TopNav() {
  return (
    <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-20 items-center px-8 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Al-Quran Digital
            </h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">
              Read & Reflect
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6 pr-8 border-r border-white/10">
            <Link
              href="/"
              className="text-sm font-medium text-white hover:text-emerald-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-white/50 hover:text-white transition-colors"
            >
              Bookmarks
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-white/50 hover:text-white transition-colors"
            >
              About
            </Link>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group">
            <Heart className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-white/80">Donate</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
