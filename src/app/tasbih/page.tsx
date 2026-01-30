"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Activity, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function TasbihPage() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("alquran-han-tasbih");
    if (saved) setCount(parseInt(saved));
  }, []);

  const handleTap = () => {
    // Haptic Feedback
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }

    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem("alquran-han-tasbih", newCount.toString());

    // Target reached vibration
    if (newCount % target === 0 && navigator.vibrate) {
      navigator.vibrate([10, 50, 10]);
    }
  };

  const reset = () => {
    if (confirm("Reset counter?")) {
      setCount(0);
      localStorage.setItem("alquran-han-tasbih", "0");
    }
  };

  return (
    <div className="min-h-screen bg-black relative flex flex-col items-center justify-center overflow-hidden">
      {/* Full screen tap area */}
      <button
        onClick={handleTap}
        className="absolute inset-0 w-full h-full z-10 active:bg-white/5 transition-colors cursor-pointer outline-none"
      />

      {/* UI Elements (Clickable above the tap layer if z-index > 10) */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors bg-black/50 px-4 py-2 rounded-full backdrop-blur-md"
        >
          <ChevronLeft className="w-5 h-5" /> Home
        </Link>
      </div>

      <div className="absolute top-6 right-6 z-20 flex gap-2">
        <button
          onClick={() => setTarget(target === 33 ? 100 : 33)}
          className="px-4 py-2 rounded-full bg-white/10 text-xs font-bold text-white backdrop-blur-md border border-white/5"
        >
          Target: {target}
        </button>
        <button
          onClick={reset}
          className="p-2 rounded-full bg-white/10 text-white/50 hover:text-white backdrop-blur-md"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Counter Display */}
      <div className="relative z-0 pointer-events-none flex flex-col items-center">
        <motion.div
          key={count}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-[150px] md:text-[250px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 leading-none select-none font-mono"
        >
          {count}
        </motion.div>
        <p className="text-white/30 text-sm uppercase tracking-[0.5em] mt-8 animate-pulse">
          Tap anywhere to count
        </p>
      </div>

      {/* Progress Ring Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <svg className="w-[80vmin] h-[80vmin] transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="#1e293b"
            strokeWidth="4"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="4"
            strokeDasharray="283%" // Approx circumference
            strokeDashoffset={`${283 - ((count % target) / target) * 283}%`}
            className="transition-all duration-300 ease-out"
          />
        </svg>
      </div>
    </div>
  );
}
