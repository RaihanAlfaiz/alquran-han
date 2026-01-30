const QURAN_COM_API = "https://api.quran.com/api/v4";

export interface TajwidVerse {
  id: number;
  verse_key: string;
  text_uthmani_tajweed: string;
}

export async function getTajwidVerses(
  surahNumber: number,
): Promise<Record<string, string>> {
  try {
    const res = await fetch(
      `${QURAN_COM_API}/quran/verses/uthmani_tajweed?chapter_number=${surahNumber}`,
      {
        next: { revalidate: 3600 * 24 }, // Cache for 24 hours
      },
    );
    if (!res.ok) return {};

    const data = await res.json();
    // Return a map: "1" -> "<html>..." (Using verse number from verse_key "1:1")
    const map: Record<string, string> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.verses.forEach((v: any) => {
      const verseNum = v.verse_key.split(":")[1];
      map[verseNum] = v.text_uthmani_tajweed;
    });
    return map;
  } catch (error) {
    console.error("Tajwid API Error:", error);
    return {};
  }
}
