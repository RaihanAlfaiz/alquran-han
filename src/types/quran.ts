export interface Ayah {
  ar: string; // Arabic text
  id: string; // Indonesian translation
  tr: string; // Transliteration
  nomor: string; // Verse number
}

export interface Surah {
  nomor: number;
  nama: string; // Arabic name
  nama_latin: string; // Latin name
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string; // Meaning
  deskripsi: string;
  audio: string;
  ayat: Ayah[];
}

export interface QuranData {
  data: Surah[];
}
