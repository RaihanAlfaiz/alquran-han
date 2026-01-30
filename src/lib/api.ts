// Types based on the Indonesian Quran API Structure
export interface Ayah {
  nomor: string; // The API returns string "1", "2" etc based on inspection
  ar: string; // Arabic Text
  tr: string; // Transliteration (HTML)
  id: string; // Indonesian Translation
}

export interface Surah {
  nomor: string; // API returns string "1"
  nama: string; // Latin Name (e.g. "Al Fatihah") - Note: key is 'nama' not 'nama_latin' based on debug
  asma: string; // Arabic Name (e.g. "الفاتحة") - Note: key is 'asma' based on debug
  ayat: number; // Number of verses (e.g. 7)
  type: string; // mekah/madinah
  urut: string; // sort order
  audio: string; // audio url
  keterangan: string; // description
}

export interface SurahDetail extends Omit<Surah, "ayat"> {
  ayat: Ayah[]; // The verses array
}

const API_BASE = "https://api.npoint.io/99c279bb173a6e28359c";

// FETCH ALL SURAHS (Home)
export async function getAllSurahs(): Promise<Surah[]> {
  try {
    const res = await fetch(`${API_BASE}/data`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch surah list");
    const data = await res.json();

    // API returns array of objects. We map to our interface.
    return data.map((item: any) => ({
      nomor: item.nomor,
      nama: item.nama, // "Al Fatihah"
      asma: item.asma, // Arabic
      ayat: item.ayat,
      type: item.type,
      urut: item.urut,
      audio: item.audio,
      keterangan: item.keterangan,
    }));
  } catch (error) {
    console.error("API Error (List):", error);
    return [];
  }
}

// FETCH SURAH DETAIL (Nomor)
export async function getSurahDetail(
  nomor: number,
): Promise<SurahDetail | null> {
  try {
    // 1. Fetch Metadata (we could reuse getAllSurahs cache, but let's just fetch list for simplicity/safety)
    // Optimization: In a real app we'd pass metadata from parent, but here we fetch fresh to ensure standalone correctness.
    const listRes = await fetch(`${API_BASE}/data`, {
      next: { revalidate: 3600 },
    });
    const listData = await listRes.json();
    const meta = listData.find((s: any) => parseInt(s.nomor) === nomor);

    if (!meta) return null;

    // 2. Fetch Verses
    const verseRes = await fetch(`${API_BASE}/surat/${nomor}`, {
      next: { revalidate: 3600 },
    });
    if (!verseRes.ok) return null; // Maybe surah doesn't exist or data missing
    const verseData = await verseRes.json();

    // 3. Combine
    return {
      ...meta,
      nama: meta.nama,
      asma: meta.asma,
      ayat: verseData, // The verse array
    };
  } catch (error) {
    console.error("API Error (Detail):", error);
    return null;
  }
}
