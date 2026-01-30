import { surahList } from "./surah-list";

export const TOTAL_AYAHS = 6236; // Standard count

export function getGlobalAyahIndex(
  surahNomor: number,
  ayahNomor: number,
): number {
  let count = 0;
  for (let i = 0; i < surahNomor - 1; i++) {
    count += surahList[i].jumlah_ayat;
  }
  return count + ayahNomor;
}

export function getSurahAyahFromGlobalIndex(globalIndex: number): {
  surahNomor: number;
  ayahNomor: number;
} {
  let remaining = globalIndex;
  for (let i = 0; i < surahList.length; i++) {
    const ayahsInSurah = surahList[i].jumlah_ayat;
    if (remaining <= ayahsInSurah) {
      return { surahNomor: i + 1, ayahNomor: remaining };
    }
    remaining -= ayahsInSurah;
  }
  return { surahNomor: 114, ayahNomor: 6 }; // Fallback
}

export function calculateDailyGoal(
  currentGlobalIndex: number,
  targetDate: string,
): number {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = Math.abs(target.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 0;

  const remainingAyahs = TOTAL_AYAHS - currentGlobalIndex;
  return Math.ceil(remainingAyahs / diffDays);
}
