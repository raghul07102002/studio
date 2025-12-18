"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  useCallback,
} from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Habit, HabitData, ViewOption } from "@/lib/types";
import { DEFAULT_HABITS } from "@/data/habits";
import { generateInitialHabitData } from "@/data/initial-data";
import { format } from "date-fns";
import { YEAR } from "@/lib/constants";
import { getFilteredDates } from "@/lib/analysis";

interface AppContextType {
  habits: Habit[];
  habitData: HabitData;
  selectedView: ViewOption;
  setSelectedView: (view: ViewOption) => void;
  updateHabits: (habits: Habit[]) => void;
  updateHabitLog: (
    date: string,
    habitId: string,
    log: { completed: boolean; value?: number }
  ) => void;
  filteredDates: Date[];
  isInitialized: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useLocalStorage<Habit[]>(
    "chrono-habits-2025",
    DEFAULT_HABITS
  );
  const [habitData, setHabitData] = useLocalStorage<HabitData>(
    "chrono-habit-data-2025",
    {}
  );
  const [selectedView, setSelectedView] = useState<ViewOption>("Year");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if data is initialized, if not, generate and set it.
    const firstDate = format(new Date(YEAR, 0, 1), "yyyy-MM-dd");
    if (!habitData[firstDate] || Object.keys(habitData).length < 365) {
      const initialData = generateInitialHabitData(habits);
      setHabitData(initialData);
    }
    setIsInitialized(true);
  }, []); // Run once on mount

  const updateHabits = useCallback(
    (newHabits: Habit[]) => {
      setHabits(newHabits);
      // Here you could add logic to migrate habitData if needed
    },
    [setHabits]
  );

  const updateHabitLog = useCallback(
    (
      date: string,
      habitId: string,
      log: { completed: boolean; value?: number }
    ) => {
      setHabitData((prevData) => {
        const newData = { ...prevData };
        if (!newData[date]) {
          newData[date] = {};
        }
        newData[date][habitId] = {
            ...newData[date][habitId],
            ...log
        };
        return newData;
      });
    },
    [setHabitData]
  );
  
  const filteredDates = useMemo(
    () => getFilteredDates(selectedView, YEAR),
    [selectedView]
  );

  const value = {
    habits,
    habitData,
    selectedView,
    setSelectedView,
    updateHabits,
    updateHabitLog,
    filteredDates,
    isInitialized,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
