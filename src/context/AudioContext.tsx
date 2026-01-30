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
  qari: Qari;
  changeQari: (qari: Qari) => void;
  sleepTimer: number | null;
  startSleepTimer: (minutes: number) => void;
  cancelSleepTimer: () => void;
}

import { qariList, Qari } from "@/lib/reciters";

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
  const [qari, setQari] = useState<Qari>(qariList[0]);

  // Load qari from local storage
  useEffect(() => {
    const saved = localStorage.getItem("alquran-han-qari");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate if ID exists in list
      const found = qariList.find((q) => q.id === parsed.id);
      if (found) setQari(found);
    }
  }, []);

  const changeQari = (newQari: Qari) => {
    setQari(newQari);
    localStorage.setItem("alquran-han-qari", JSON.stringify(newQari));

    // If a surah is currently loaded, update its source immediately
    if (currentSurah && audioRef.current) {
      const padNumber = (num: string) => num.toString().padStart(3, "0");
      const newUrl = `${newQari.url}${padNumber(currentSurah.nomor)}.mp3`;

      const wasPlaying = isPlaying;
      const currentTimeBeforeSwitch = audioRef.current.currentTime;

      // Update Audio Source
      audioRef.current.src = newUrl;

      // Update State
      setCurrentSurah({ ...currentSurah, url: newUrl });

      // Resume if it was playing, but it will restart from 0 unless we seek.
      // Seeking immediately might be flaky without 'loadedmetadata', but let's try to just play.
      // Ideally, we reset to 0 to avoid mismatched ayah timing.
      if (wasPlaying) {
        audioRef.current
          .play()
          .catch((e) => console.error("Switch Qari Play Error:", e));
        setIsPlaying(true);
      }
    }
  };

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
        // Simple user feedback - in real app use toast
        // alert("Failed to play audio. Please check your connection or try another reciter.");

        // Auto Retry once if network error?
        if (audio.error && audio.error.code === 2) {
          // 2 = MEDIA_ERR_NETWORK
          console.log("Network error, retrying once...");
          audio.load();
          audio.play().catch((err) => console.error("Retry failed", err));
        }
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
    // Use dynamic Qari URL
    const secureUrl = `${qari.url}${padNumber(surah.nomor)}.mp3`;

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

  // SLEEP TIMER LOGIC
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startSleepTimer = (minutes: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    // Stop after X minutes
    timerRef.current = setTimeout(
      () => {
        if (audioRef.current) {
          // Fade out effect? Maybe later. For now just pause.
          audioRef.current.pause();
          setIsPlaying(false);
          setSleepTimer(null); // Reset
          // Maybe alert?
        }
      },
      minutes * 60 * 1000,
    ); // Minutes to MS

    setSleepTimer(minutes);
  };

  const cancelSleepTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSleepTimer(null);
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
        qari,
        changeQari,
        sleepTimer,
        startSleepTimer,
        cancelSleepTimer,
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
