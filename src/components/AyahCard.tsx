"use client";

import { motion } from "framer-motion";
import { Ayah } from "@/types/quran";
import { Play, Bookmark, Share2 } from "lucide-react";

interface AyahCardProps {
  ayah: Ayah;
  index: number;
}

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}

export default function AyahCard({ ayah, index }: AyahCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.5 }}
      // Increased vertical padding
      className="relative py-12 md:py-24 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.01] transition-colors group"
    >
      {/* 
         CENTERING LOGIC:
         - mx-auto: Center the container itself
         - items-center: Center flex children horizontally
         - text-center: Center text content
         - flex-col: Stack vertically
      */}
      <div className="w-full px-6 flex flex-col items-center max-w-5xl mx-auto text-center">
        {/* Header Row - Centered relative to container (but spread apart) */}
        <div className="w-full flex items-center justify-between mb-12 md:mb-20 px-4 md:px-12">
          <span className="flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full bg-slate-900 border border-white/5 text-xs md:text-sm font-mono text-emerald-500 shadow-lg font-bold">
            {ayah.nomor}
          </span>

          <div className="flex items-center gap-2 md:gap-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button className="text-white/40 hover:text-emerald-400 p-2 md:p-3 rounded-full hover:bg-white/5 transition-colors">
              <Play className="w-5 h-5" />
            </button>
            <button className="text-white/40 hover:text-gold p-2 md:p-3 rounded-full hover:bg-white/5 transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="text-white/40 hover:text-white p-2 md:p-3 rounded-full hover:bg-white/5 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Container - Strictly Centered */}
        <div className="w-full flex flex-col items-center gap-10 md:gap-16">
          {/* Arabic Text - Centered */}
          <div className="w-full text-center px-4">
            <p
              className="text-4xl md:text-7xl/relaxed lg:text-7xl/relaxed text-white font-arabic dir-rtl drop-shadow-2xl mx-auto"
              style={{
                fontFamily: "'Amiri', serif",
                wordSpacing: "0.2em",
                maxWidth: "100%",
              }}
            >
              {ayah.ar}
            </p>
          </div>

          {/* Translation Block - Centered & Width Constrained */}
          <div className="flex flex-col gap-6 text-center w-full max-w-3xl mx-auto px-4">
            <p className="text-sm md:text-xl text-emerald-100/50 italic font-light leading-relaxed tracking-wide">
              {stripHtml(ayah.tr)}
            </p>

            <p className="text-base md:text-2xl text-slate-200/90 font-light leading-loose md:leading-loose">
              {ayah.id}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
