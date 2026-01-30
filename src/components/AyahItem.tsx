"use client";

import { Ayah } from "@/lib/api";
import { useBookmark } from "@/context/BookmarkContext";
import { useAudio } from "@/context/AudioContext"; // Added for audio functionality
import {
  Bookmark,
  BookOpen,
  Share2,
  PenLine,
  PlayCircle,
  PauseCircle,
} from "lucide-react"; // Added PenLine, PlayCircle, PauseCircle
import { useState, useEffect } from "react"; // Added useEffect
import TafsirModal from "./TafsirModal";
import AyahShareModal from "./AyahShareModal";
import TadabburModal from "./TadabburModal"; // Added TadabburModal

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
  surah: { nomor: string; nama: string }; // Changed to non-optional
  tajwidText?: string;
  tafsirData?: string;
}) {
  const { playSurah, isPlaying, currentSurah, togglePlay } = useAudio(); // Added useAudio
  const { toggleBookmark, isBookmarked, saveLastRead } = useBookmark();
  const [isTafsirOpen, setIsTafsirOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isTadabburOpen, setIsTadabburOpen] = useState(false); // Added for TadabburModal

  // Safe Access: Surah is now always defined based on props
  const isSaved = isBookmarked(surah.nomor, ayah.nomor); // Renamed to isSaved for clarity with new diff
  const bookmarked = isSaved; // Alias for the new diff's variable name

  // Check if note exists for indicator
  const noteKey = `alquran-han-note-${surah.nomor}-${ayah.nomor}`;
  const [hasNote, setHasNote] = useState(false);

  useEffect(() => {
    // Check initially and whenever modal closes (crude but works for localstorage)
    if (!isTadabburOpen) {
      setHasNote(!!localStorage.getItem(noteKey));
    }
  }, [isTadabburOpen, noteKey]);

  const handleBookmark = () => {
    toggleBookmark(surah, ayah.nomor);
    // Otomatis juga set "Last Read" ketika user bookmark/klik ayat
    saveLastRead(surah, ayah.nomor);
  };

  // FIX: currentSurah in context has { name, url, nomor }, not surahNumber/ayahNumber
  // Also playSurah takes object { name, url, nomor }

  const isActive = isPlaying && currentSurah?.nomor === surah.nomor;

  const handlePlay = () => {
    if (isActive) {
      togglePlay();
    } else {
      playSurah({
        name: surah.nama,
        url: "", // handled in context
        nomor: surah.nomor,
      });
    }
    saveLastRead(surah, ayah.nomor);
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
      {/* 1. Verse Number */}
      <div className="mb-8 flex items-center justify-center gap-3">
        <div className="px-4 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-sky-400/80">
          Verse {ayah.nomor}
        </div>
      </div>

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
      <div className="max-w-2xl px-6 space-y-4 mb-8">
        <p className="text-sky-200/60 font-medium italic text-sm md:text-base leading-relaxed">
          {strip(ayah.tr)}
        </p>
        <p className="text-slate-300 font-light text-base md:text-lg leading-relaxed">
          {ayah.id}
        </p>
      </div>

      {/* ACTION BAR ENHANCED (Centered) */}
      <div className="flex items-center gap-4 opacity-40 group-hover:opacity-100 transition-opacity">
        {/* Play Button */}
        <button
          onClick={handlePlay}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-sky-400 hover:bg-sky-500 hover:text-white transition-all shadow-lg"
        >
          {isActive ? (
            <PauseCircle className="w-5 h-5 fill-current" />
          ) : (
            <PlayCircle className="w-5 h-5 fill-current" />
          )}
        </button>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isSaved
              ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]"
              : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
        </button>

        {/* Share */}
        <button
          onClick={() => setIsShareOpen(true)}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Tadabbur Journal Button */}
        <button
          onClick={() => setIsTadabburOpen(true)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all relative ${
            hasNote
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
              : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Write Tadabbur Note"
        >
          <PenLine className="w-4 h-4" />
          {hasNote && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-bounce"></span>
          )}
        </button>

        {/* Tafsir Trigger */}
        {tafsirData && (
          <button
            onClick={() => setIsTafsirOpen(true)}
            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400 hover:bg-white/10 hover:text-white transition-all hidden sm:flex items-center gap-2"
          >
            <BookOpen className="w-3 h-3" />
            <span>Read Tafsir</span>
          </button>
        )}
      </div>

      <AyahShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        ayah={ayah}
        surahName={surah.nama}
      />

      {tafsirData && (
        <TafsirModal
          isOpen={isTafsirOpen}
          onClose={() => setIsTafsirOpen(false)}
          surahName={surah.nama}
          ayahNumber={ayah.nomor}
          tafsirText={tafsirData}
        />
      )}

      <TadabburModal
        isOpen={isTadabburOpen}
        onClose={() => setIsTadabburOpen(false)}
        surahNumber={surah.nomor}
        ayahNumber={ayah.nomor}
        surahName={surah.nama}
      />
    </div>
  );
}
