"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
  useEffect,
} from "react";

interface AudioContextType {
  isPlaying: boolean;
  currentSurah: { name: string; url: string; nomor: string } | null;
  playSurah: (surah: { name: string; url: string; nomor: string }) => void;
  togglePlay: () => void;
  duration: number;
  currentTime: number;
  seek: (time: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentSurah, setCurrentSurah] = useState<{
    name: string;
    url: string;
    nomor: string;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();

      const audio = audioRef.current;

      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => {
        if (!isNaN(audio.duration) && isFinite(audio.duration)) {
          setDuration(audio.duration);
        }
      };
      const onEnded = () => setIsPlaying(false);
      const onError = (e: any) => {
        console.error("Audio Error:", e);
        setIsPlaying(false);
      };

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", updateDuration);
      audio.addEventListener("ended", onEnded);
      audio.addEventListener("error", onError);

      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateDuration);
        audio.removeEventListener("ended", onEnded);
        audio.removeEventListener("error", onError);
        audio.pause();
      };
    }
  }, []);

  const playSurah = async (surah: {
    name: string;
    url: string;
    nomor: string;
  }) => {
    if (!audioRef.current) return;

    // FIX: Gunakan Server MP3Quran.net (Full Surah)
    // Server 8 = Mishary Rashid Alafasy
    // Format: 001.mp3, 002.mp3, ... 114.mp3 (3 Digit padding)

    const padNumber = (num: string) => num.toString().padStart(3, "0");
    const secureUrl = `https://server8.mp3quran.net/afs/${padNumber(surah.nomor)}.mp3`;

    console.log("Playing Full Surah:", secureUrl);

    // If same surah, just toggle
    if (currentSurah?.nomor === surah.nomor) {
      togglePlay();
      return;
    }

    try {
      audioRef.current.pause();
      setIsPlaying(false);

      setCurrentSurah({ ...surah, url: secureUrl });

      audioRef.current.src = secureUrl;
      audioRef.current.load();

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error("Playback failed:", error);
            setIsPlaying(false);
          });
      }
    } catch (e) {
      console.error("Setup error:", e);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentSurah) return;

    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((e) => {
            console.error("Resume failed:", e);
            setIsPlaying(false);
          });
      }
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentSurah,
        playSurah,
        togglePlay,
        duration,
        currentTime,
        seek,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
