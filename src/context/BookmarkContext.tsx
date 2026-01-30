"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Bookmark {
  surahNomor: string;
  surahNama: string;
  ayatNomor: string;
  timestamp: number;
}

interface BookmarkContextType {
  lastRead: Bookmark | null;
  saveLastRead: (
    surah: { nomor: string; nama: string },
    ayatNomor: string,
  ) => void;
  bookmarks: Bookmark[]; // Nanti bisa buat list favorit
  toggleBookmark: (
    surah: { nomor: string; nama: string },
    ayatNomor: string,
  ) => void;
  isBookmarked: (surahNomor: string, ayatNomor: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined,
);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [lastRead, setLastRead] = useState<Bookmark | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    const storedLast = localStorage.getItem("alquran-han-last-read");
    const storedMarks = localStorage.getItem("alquran-han-bookmarks");

    if (storedLast) setLastRead(JSON.parse(storedLast));
    if (storedMarks) setBookmarks(JSON.parse(storedMarks));
  }, []);

  const saveLastRead = (
    surah: { nomor: string; nama: string },
    ayatNomor: string,
  ) => {
    const data: Bookmark = {
      surahNomor: surah.nomor,
      surahNama: surah.nama,
      ayatNomor: ayatNomor,
      timestamp: Date.now(),
    };
    setLastRead(data);
    localStorage.setItem("alquran-han-last-read", JSON.stringify(data));
  };

  const toggleBookmark = (
    surah: { nomor: string; nama: string },
    ayatNomor: string,
  ) => {
    const exists = bookmarks.find(
      (b) => b.surahNomor === surah.nomor && b.ayatNomor === ayatNomor,
    );

    let newBookmarks;
    if (exists) {
      newBookmarks = bookmarks.filter(
        (b) => !(b.surahNomor === surah.nomor && b.ayatNomor === ayatNomor),
      );
    } else {
      newBookmarks = [
        ...bookmarks,
        {
          surahNomor: surah.nomor,
          surahNama: surah.nama,
          ayatNomor: ayatNomor,
          timestamp: Date.now(),
        },
      ];
    }

    setBookmarks(newBookmarks);
    localStorage.setItem("alquran-han-bookmarks", JSON.stringify(newBookmarks));
  };

  const isBookmarked = (surahNomor: string, ayatNomor: string) => {
    return bookmarks.some(
      (b) => b.surahNomor === surahNomor && b.ayatNomor === ayatNomor,
    );
  };

  return (
    <BookmarkContext.Provider
      value={{
        lastRead,
        saveLastRead,
        bookmarks,
        toggleBookmark,
        isBookmarked,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmark() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error("useBookmark must be used within a BookmarkProvider");
  }
  return context;
}
