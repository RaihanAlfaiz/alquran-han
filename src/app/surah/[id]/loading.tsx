"use client";

import { motion } from "framer-motion";

export default function SurahDetailSkeleton() {
  return (
    <div className="py-6">
      {/* Back Button Skeleton */}
      <div className="mb-6">
        <div className="w-24 h-9 rounded-full shimmer bg-white/5" />
      </div>

      {/* Header Card Skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-6 md:p-10 text-center mb-6"
      >
        <div className="w-14 h-14 mx-auto rounded-2xl shimmer bg-white/5 mb-5" />
        <div className="w-40 h-12 mx-auto rounded-xl shimmer bg-white/5 mb-3" />
        <div className="w-32 h-7 mx-auto rounded-lg shimmer bg-white/5 mb-1" />
        <div className="w-24 h-5 mx-auto rounded-md shimmer bg-white/5 mb-6" />

        <div className="flex items-center justify-center gap-6">
          <div className="w-20 h-5 rounded shimmer bg-white/5" />
          <div className="w-20 h-5 rounded shimmer bg-white/5" />
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
          <div className="w-72 h-8 mx-auto rounded-lg shimmer bg-white/5" />
        </div>
      </motion.div>

      {/* Ayat Cards Skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="glass-card p-5 md:p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full shimmer bg-white/5" />
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <div className="w-full h-10 rounded-lg shimmer bg-white/5 mb-2" />
            <div className="w-3/4 h-10 ml-auto rounded-lg shimmer bg-white/5 mb-6" />
            <div className="w-full h-4 rounded shimmer bg-white/5 mb-2" />
            <div className="w-2/3 h-4 rounded shimmer bg-white/5 mb-3" />
            <div className="w-full h-5 rounded shimmer bg-white/5 mb-1" />
            <div className="w-5/6 h-5 rounded shimmer bg-white/5" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
