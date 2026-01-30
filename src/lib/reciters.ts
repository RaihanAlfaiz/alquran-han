export interface Qari {
  id: string;
  name: string;
  url: string; // Base URL for the server
}

export const qariList: Qari[] = [
  {
    id: "mishary",
    name: "Mishary Rashid Alafasy",
    url: "https://server8.mp3quran.net/afs/",
  },
  {
    id: "sudais",
    name: "Abdurrahman As-Sudais",
    url: "https://server11.mp3quran.net/sds/",
  },
  {
    id: "ghamidi",
    name: "Saad Al-Ghamidi",
    url: "https://server7.mp3quran.net/s_gmd/",
  },

  {
    id: "husary",
    name: "Mahmoud Khalil Al-Husary",
    url: "https://server13.mp3quran.net/husr/",
  },
];
