"use client";

import { Ayah } from "@/lib/api";
import { useBookmark } from "@/context/BookmarkContext";
import { Bookmark, BookOpen, Share2 } from "lucide-react";
import { useState } from "react";
import TafsirModal from "./TafsirModal";
import AyahShareModal from "./AyahShareModal";

/* Helper to strip HTML tags if present in translation */
function strip(html: string) {
  return html.replace(/<[^>]*>?/gm, "");
}

const TAJWID_MAP: Record<string, string> = {
  // --- MAD (Panjang) ---
  madda_normal: "Mad Thobi'i",
  madda_permissible: "Mad Jaiz Munfasil",
  madda_necessary: "Mad Lazim", // Harfi/Kilmi
  madda_obligatory: "Mad Wajib Muttasil",
  madda_badal: "Mad Badal",
  madda_ewad: "Mad 'Iwad",
  madda_silah: "Mad Silah",
  madda_silah_sugra: "Mad Silah Qasirah",
  madda_silah_kubra: "Mad Silah Thawilah",
  madda_tamkin: "Mad Tamkin",

  // --- QALQALAH (Pantulan) ---
  qalaqah: "Qalqalah",
  qalqalah: "Qalqalah",

  // --- NUN/MIM MATI & TANWIN ---
  ghunnah: "Ghunnah", // Nun/Mim Tasydid
  ikhfa: "Ikhfa Haqiqi",
  ikhafa: "Ikhfa Haqiqi", // API Typo variation
  iqlab: "Iqlab",

  // --- IDGHAM (Lebur) ---
  idgham_with_ghunnah: "Idgham Bighunnah",
  idgham_ghunnah: "Idgham Bighunnah",
  idgham_wo_ghunnah: "Idgham Bilaghunnah",
  idgham_no_ghunnah: "Idgham Bilaghunnah",

  // --- MIM SUKUN ---
  idgham_shafawi: "Idgham Mimi (Mutamatsilain)",
  idgham_mutamathilayn: "Idgham Mutamatsilain",
  ikhfa_shafawi: "Ikhfa Syafawi",
  ikhafa_shafawi: "Ikhfa Syafawi",
  mimo_sakinah: "Izhar Syafawi", // Sometimes API marks plain Mim Sukun

  // --- OTHERS ---
  idgham_mutajanisayn: "Idgham Mutajanisain",
  idgham_mutaqaribayn: "Idgham Mutaqaribain",
  laam_shamsiyah: "Alif Lam Syamsiah",
  laam_qamariyah: "Alif Lam Qamariah",
  ham_wasl: "Hamzah Wasl",
  silent: "Harap Tidak Dibaca (Silent)",
  slnt: "Harap Tidak Dibaca (Silent)",
};

export default function AyahItem({
  ayah,
  surah,
  tajwidText,
  tafsirData,
}: {
  ayah: Ayah;
  surah?: { nomor: string; nama: string };
  tajwidText?: string;
  tafsirData?: string;
}) {
  const { toggleBookmark, isBookmarked, saveLastRead } = useBookmark();
  const [isTafsirOpen, setIsTafsirOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Safe Access: Surah might be undefined if not passed from parent
  const isSaved = surah ? isBookmarked(surah.nomor, ayah.nomor) : false;

  const handleBookmark = () => {
    if (surah) {
      toggleBookmark(surah, ayah.nomor);
      // Otomatis juga set "Last Read" ketika user bookmark/klik ayat
      saveLastRead(surah, ayah.nomor);
    }
  };

  // Helper to parse tajwid for tooltip
  const parseTajwid = (html: string) => {
    return html
      .replace(/<tajweed class=["']?([^>"']+)["']?>/g, (match, className) => {
        const readableName = TAJWID_MAP[className] || className;
        return `<span class="${className} tajwid-interactive" data-tajwid="${readableName}">`;
      })
      .replace(/<\/tajweed>/g, "</span>");
  };

  return (
    <div
      id={`ayah-${ayah.nomor}`} // ID for Auto Scroll
      className="py-12 md:py-16 first:pt-0 border-b border-white/5 last:border-0 flex flex-col items-center text-center group relative scroll-mt-32 transition-colors duration-500 target:bg-sky-500/10 target:rounded-3xl target:border-transparent"
    >
      {/* 1. Verse Number & Actions */}
      <div className="mb-8 flex items-center gap-3">
        <div className="px-4 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-sky-400/80">
          Verse {ayah.nomor}
        </div>

        {surah && (
          <div className="flex items-center gap-2">
            {/* TAFSIR BUTTON */}
            {tafsirData && (
              <button
                onClick={() => setIsTafsirOpen(true)}
                className="p-2 rounded-full bg-white/5 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-300"
                title="Read Tafsir"
              >
                <BookOpen className="w-4 h-4" />
              </button>
            )}

            {/* SHARE BUTTON */}
            <button
              onClick={() => setIsShareOpen(true)}
              className="p-2 rounded-full bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all duration-300"
              title="Share Image"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full transition-all duration-300 ${isSaved ? "bg-sky-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.5)]" : "bg-white/5 text-slate-500 hover:text-sky-400 hover:bg-white/10"}`}
            >
              <Bookmark
                className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Render Tafsir Modal */}
      {surah && tafsirData && (
        <TafsirModal
          isOpen={isTafsirOpen}
          onClose={() => setIsTafsirOpen(false)}
          tafsirText={tafsirData}
          surahName={surah.nama}
          ayahNumber={ayah.nomor}
        />
      )}

      {/* Render Share Modal */}
      {surah && (
        <AyahShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          ayah={ayah}
          surahName={surah.nama}
        />
      )}

      {/* 2. Arabic Text (The Star) */}
      <div className="w-full px-4 mb-8">
        {tajwidText ? (
          <p
            className="font-arabic text-4xl md:text-5xl lg:text-6xl text-white leading-[2.2] dir-rtl drop-shadow-lg"
            dangerouslySetInnerHTML={{
              __html: parseTajwid(tajwidText),
            }}
          />
        ) : (
          <p className="font-arabic text-4xl md:text-5xl lg:text-6xl text-white leading-[2.2] dir-rtl drop-shadow-lg">
            {ayah.ar}
          </p>
        )}
      </div>

      {/* 3. Translations (Clean Stack) */}
      <div className="max-w-2xl px-6 space-y-4">
        <p className="text-sky-200/60 font-medium italic text-sm md:text-base leading-relaxed">
          {strip(ayah.tr)}
        </p>
        <p className="text-slate-300 font-light text-base md:text-lg leading-relaxed">
          {ayah.id}
        </p>
      </div>
    </div>
  );
}
