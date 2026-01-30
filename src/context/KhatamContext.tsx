"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getGlobalAyahIndex,
  calculateDailyGoal,
  TOTAL_AYAHS,
} from "@/lib/khatam-utils";

interface KhatamState {
  isActive: boolean;
  startDate: string | null;
  targetDate: string | null;
  currentGlobalIndex: number;
  startGlobalIndex: number;
  lastLogDate: string | null;
  streak: number;
}

interface KhatamContextType {
  state: KhatamState;
  startKhatam: (targetDate: string) => void;
  updateProgress: (surah: number, ayah: number) => void;
  resetKhatam: () => void;
  dailyGoal: number;
  percentage: number;
}

const KhatamContext = createContext<KhatamContextType | undefined>(undefined);

const initialState: KhatamState = {
  isActive: false,
  startDate: null,
  targetDate: null,
  currentGlobalIndex: 0,
  startGlobalIndex: 0,
  lastLogDate: null,
  streak: 0,
};

export function KhatamProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<KhatamState>(initialState);

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem("alquran-han-khatam");
    if (stored) {
      setState(JSON.parse(stored));
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("alquran-han-khatam", JSON.stringify(state));
  }, [state]);

  const startKhatam = (targetDate: string) => {
    setState({
      isActive: true,
      startDate: new Date().toISOString(),
      targetDate,
      currentGlobalIndex: 0,
      startGlobalIndex: 0,
      lastLogDate: null,
      streak: 0,
    });
  };

  const updateProgress = (surah: number, ayah: number) => {
    const newIndex = getGlobalAyahIndex(surah, ayah);
    const today = new Date().toDateString();

    let newStreak = state.streak;

    if (state.lastLogDate !== today) {
      // Simple streak logic: if last log was yesterday, increment.
      // If today, do nothing. If older, reset (unless we want lenient streaks).
      // For now, let's just increment if it's a new day and rely on logic elsewhere for breaking streaks.
      // Actually, let's check if the last read was yesterday.
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (state.lastLogDate === yesterday.toDateString()) {
        newStreak += 1;
      } else if (state.lastLogDate && state.lastLogDate !== today) {
        // Missed a day
        newStreak = 1;
      } else if (!state.lastLogDate) {
        newStreak = 1;
      }
    }

    setState((prev) => ({
      ...prev,
      currentGlobalIndex: newIndex,
      lastLogDate: today,
      streak: newStreak,
    }));
  };

  const resetKhatam = () => {
    setState(initialState);
  };

  const dailyGoal =
    state.isActive && state.targetDate
      ? calculateDailyGoal(state.currentGlobalIndex, state.targetDate)
      : 0;

  const percentage = Math.min(
    100,
    Math.round((state.currentGlobalIndex / TOTAL_AYAHS) * 100),
  );

  return (
    <KhatamContext.Provider
      value={{
        state,
        startKhatam,
        updateProgress,
        resetKhatam,
        dailyGoal,
        percentage,
      }}
    >
      {children}
    </KhatamContext.Provider>
  );
}

export function useKhatam() {
  const context = useContext(KhatamContext);
  if (context === undefined) {
    throw new Error("useKhatam must be used within a KhatamProvider");
  }
  return context;
}
