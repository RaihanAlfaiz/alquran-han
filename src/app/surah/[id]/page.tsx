import { getSurahDetail, getAllSurahs, Ayah } from "@/lib/api";
import { getTajwidVerses } from "@/lib/tajwid-api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import SurahInfoModal from "@/components/SurahInfoModal";
import PlaySurahButton from "@/components/PlaySurahButton";
import SurahReader from "@/components/SurahReader"; // Import Reader Baru

// SSG Params
export async function generateStaticParams() {
  const surahs = await getAllSurahs();
  return surahs.map((s) => ({ id: s.nomor.toString() }));
}

function sanitizeAyat(ayat: Ayah[], surahNomor: string): Ayah[] {
  if (surahNomor === "1") return ayat;

  return ayat.map((item) => {
    if (item.nomor === "1") {
      const bismillahPattern = /^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/;
      return {
        ...item,
        ar: item.ar.replace(bismillahPattern, ""),
      };
    }
    return item;
  });
}

export default async function SurahDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [surah, tajwidMap] = await Promise.all([
    getSurahDetail(parseInt(id)),
    getTajwidVerses(parseInt(id)),
  ]);

  if (!surah) notFound();

  const cleanAyat = Array.isArray(surah.ayat)
    ? sanitizeAyat(surah.ayat, surah.nomor)
    : [];

  return (
    <main className="min-h-screen pt-[160px] pb-32">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-t-0 border-x-0 rounded-none bg-slate-900/60 transition-all duration-300 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </Link>

          <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold text-white tracking-wide">
              {surah.nama}
            </h1>
            <span className="text-[10px] text-sky-400 font-bold tracking-widest uppercase">
              {surah.type} • {cleanAyat.length} Verses
            </span>
          </div>

          <div className="w-10" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center pb-8 px-6 flex flex-col items-center">
        <h1 className="text-6xl md:text-9xl font-arabic text-white mb-8 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] opacity-90 leading-tight py-4">
          {surah.asma}
        </h1>

        {/* Button Group */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          <SurahInfoModal info={surah.keterangan} surahName={surah.nama} />
          <PlaySurahButton
            surah={{
              name: surah.nama,
              url: surah.audio,
              nomor: surah.nomor,
            }}
          />
        </div>

        {/* Bismillah Header */}
        {surah.nomor !== "1" && surah.nomor !== "9" && (
          <div className="mt-8 mb-12 flex justify-center">
            <div className="px-8 py-4 glass-panel rounded-2xl border-white/10 bg-white/5">
              <span className="font-arabic text-3xl md:text-4xl text-white/80 leading-relaxed">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
            </div>
          </div>
        )}
      </section>

      {/* POWERFUL SURAH READER (Handles Zen, Zoom, Scroll) */}
      <SurahReader
        ayat={cleanAyat}
        surah={{ nomor: surah.nomor, nama: surah.nama }}
        tajwidMap={tajwidMap}
      />
    </main>
  );
}
