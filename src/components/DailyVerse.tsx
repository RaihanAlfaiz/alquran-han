"use client";

import { useState, useEffect } from "react";
import { MoveRight, Share2, Quote } from "lucide-react";
import { motion } from "framer-motion";

// Sample curated verses for demo purposes (in a real app, this could be a larger json or api)
const CURATED_VERSES = [
  {
    text: "So verily, with the hardship, there is relief.",
    ref: "Al-Inshirah: 5",
    ar: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
  },
  {
    text: "And He found you lost and guided [you].",
    ref: "Ad-Dhuha: 7",
    ar: "وَوَجَدَكَ ضَآلًّا فَهَدَىٰ",
  },
  {
    text: "Call upon Me; I will respond to you.",
    ref: "Ghafir: 60",
    ar: "ٱدْعُونِىٓ أَسْتَجِبْ لَكُمْ",
  },
  {
    text: "And My Success is not but through Allah.",
    ref: "Hud: 88",
    ar: "وَمَا تَوْفِيقِىٓ إِلَّا بِٱللَّهِ",
  },
  {
    text: "Allah does not burden a soul beyond that it can bear.",
    ref: "Al-Baqarah: 286",
    ar: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
  },
];

import { useRef } from "react";
import { toPng } from "html-to-image";

// ... constants ...

export default function DailyVerse() {
  const [verse, setVerse] = useState(CURATED_VERSES[0]);
  const ref = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000,
    );
    const index = dayOfYear % CURATED_VERSES.length;
    setVerse(CURATED_VERSES[index]);
  }, []);

  const handleDownload = async () => {
    if (!ref.current) return;
    setIsGenerating(true);

    try {
      const dataUrl = await toPng(ref.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0f172a", // Ensure dark background
      });

      const link = document.createElement("a");
      link.download = `alquran-han-daily-reminder.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full relative overflow-hidden rounded-3xl h-[300px] flex items-center justify-center p-8 group"
    >
      {/* ... backgrounds ... */}

      {/* ... Content ... */}
      <div className="relative z-10 text-center max-w-2xl">
        {/* ... text ... */}
        <div className="mb-6 flex justify-center opacity-50">
          <Quote className="w-10 h-10 text-sky-300" />
        </div>

        <h2 className="text-3xl md:text-4xl font-arabic text-white mb-6 leading-relaxed drop-shadow-lg">
          {verse.ar}
        </h2>

        <p className="text-lg md:text-xl text-slate-200 font-light leading-relaxed mb-6 font-serif italic relative inline-block">
          "{verse.text}"
        </p>

        <div className="flex items-center justify-center gap-3">
          <span className="px-4 py-1.5 rounded-full border border-white/20 text-xs font-bold tracking-widest text-sky-300 bg-white/5 uppercase">
            {verse.ref}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md disabled:opacity-50"
        >
          <Share2 className={`w-5 h-5 ${isGenerating ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Label */}
      <div className="absolute top-6 left-6 text-xs font-bold tracking-[0.3em] text-white/40 border-b border-white/10 pb-2">
        DAILY REMINDER
      </div>
    </motion.div>
  );
}
