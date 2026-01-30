"use client";

import { useState, useEffect } from "react";
import AyahItem from "./AyahItem";
import { Ayah } from "@/lib/api";

export default function DeferredAyahs({
  ayat,
  surah,
  hafalanMode,
  isTajwidMode,
  tajwidMap,
  tafsirMap,
}: {
  ayat: Ayah[];
  surah: any;
  hafalanMode: number;
  isTajwidMode: boolean;
  tajwidMap?: Record<string, string>;
  tafsirMap?: Record<string, string>;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small timeout to allow main thread to clear first 10 items
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible)
    return (
      <div className="py-20 text-center text-slate-500 animate-pulse">
        Loading remaining verses...
      </div>
    );

  return (
    <>
      {ayat.map((ayah) => (
        <div
          key={ayah.nomor}
          className={
            hafalanMode === 1
              ? "blur-arabic"
              : hafalanMode === 2
                ? "blur-trans"
                : ""
          }
        >
          <AyahItem
            ayah={ayah}
            surah={surah}
            tajwidText={
              isTajwidMode && tajwidMap ? tajwidMap[ayah.nomor] : undefined
            }
            tafsirData={tafsirMap ? tafsirMap[ayah.nomor] : undefined}
          />
        </div>
      ))}
    </>
  );
}
