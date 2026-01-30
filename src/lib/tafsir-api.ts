export interface TafsirData {
  code: number;
  message: string;
  data: {
    tafsir: {
      ayat: number;
      teks: string;
    }[];
  };
}

const BASE_URL = "https://equran.id/api/v2/tafsir";

export async function getTafsir(
  surahNomor: number,
): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${BASE_URL}/${surahNomor}`, {
      next: { revalidate: 3600 * 24 * 30 }, // Cache sebulan, tafsir jarang berubah
    });

    if (!res.ok) return {};

    const json = await res.json();
    const map: Record<string, string> = {};

    if (json.data && json.data.tafsir) {
      json.data.tafsir.forEach((item: any) => {
        map[item.ayat] = item.teks;
      });
    }

    return map;
  } catch (error) {
    console.error("Gagal fetch tafsir:", error);
    return {};
  }
}
