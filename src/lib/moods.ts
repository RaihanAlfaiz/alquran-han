export interface Mood {
  id: string;
  emoji: string;
  label: string;
  color: string;
  surahs: { nomor: number; nama: string; reason: string }[];
}

export const moodList: Mood[] = [
  {
    id: "sad",
    emoji: "😔",
    label: "Sedih",
    color: "from-blue-500 to-indigo-600",
    surahs: [
      {
        nomor: 93,
        nama: "Ad-Duhaa",
        reason: "Allah tidak pernah meninggalkanmu.",
      },
      {
        nomor: 12,
        nama: "Yusuf",
        reason: "Kesabaran yang indah akan berbuah manis.",
      },
      {
        nomor: 94,
        nama: "Al-Insyirah",
        reason: "Setelah kesulitan pasti ada kemudahan.",
      },
    ],
  },
  {
    id: "anxious",
    emoji: "😰",
    label: "Cemas",
    color: "from-emerald-500 to-teal-600",
    surahs: [
      {
        nomor: 13,
        nama: "Ar-Ra'd",
        reason: "Hanya dengan mengingat Allah hati menjadi tenang.",
      },
      { nomor: 20, nama: "Ta-Ha", reason: "Jangan takut, Allah bersamamu." },
    ],
  },
  {
    id: "lost",
    emoji: "🌫️",
    label: "Hilang Arah",
    color: "from-violet-500 to-purple-600",
    surahs: [
      {
        nomor: 1,
        nama: "Al-Fatihah",
        reason: "Tunjukilah kami jalan yang lurus.",
      },
      { nomor: 18, nama: "Al-Kahfi", reason: "Cahaya di antara dua jumat." },
    ],
  },
  {
    id: "grateful",
    emoji: "✨",
    label: "Bersyukur",
    color: "from-amber-400 to-orange-500",
    surahs: [
      {
        nomor: 55,
        nama: "Ar-Rahman",
        reason: "Maka nikmat Tuhanmu yang manakah yang kamu dustakan?",
      },
      {
        nomor: 14,
        nama: "Ibrahim",
        reason: "Jika bersyukur, pasti Allah tambah nikmat-Nya.",
      },
    ],
  },
  {
    id: "tired",
    emoji: "😫",
    label: "Lelah",
    color: "from-rose-400 to-pink-500",
    surahs: [
      {
        nomor: 2,
        nama: "Al-Baqarah",
        reason:
          "Allah tidak membebani seseorang melainkan sesuai kesanggupannya.",
      },
      {
        nomor: 67,
        nama: "Al-Mulk",
        reason: "Istirahatlah dengan perlindungan-Nya.",
      },
    ],
  },
];
