import { Ayah } from "@/types/quran";

const API_BASE = "https://api.npoint.io/99c279bb173a6e28359c";

export async function getAyatBySurahNumber(
  surahNumber: number,
): Promise<Ayah[]> {
  const res = await fetch(`${API_BASE}/surat/${surahNumber}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ayat for surah ${surahNumber}`);
  }

  const data = await res.json();
  return data;
}
