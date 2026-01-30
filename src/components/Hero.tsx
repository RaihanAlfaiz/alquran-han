"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full text-center"
    >
      <div className="flex flex-col items-start md:items-center">
        <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] md:text-xs font-bold tracking-widest text-emerald-400 uppercase w-fit mb-4">
          Assalamu&apos;alaikum
        </span>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1.1] mb-4">
          Al-Quran Digital
        </h1>

        <p className="text-sm md:text-base text-white/50 font-medium max-w-xl md:text-center leading-relaxed">
          Platform digital modern untuk membaca, mempelajari, dan merenungi
          ayat-ayat suci Al-Quran dengan antarmuka yang tenang dan fokus.
        </p>
      </div>
    </motion.section>
  );
}
