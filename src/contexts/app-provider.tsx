
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
import type { Habit, HabitData, ViewOption, DashboardOption, HabitLog } from "@/lib/types";
import { DEFAULT_HABITS } from "@/data/habits";
import { format, subDays } from "date-fns";
import { getFilteredDates } from "@/lib/analysis";
import { useRouter, usePathname } from "next/navigation";
import { DateRange } from "react-day-picker";
import { useLocalStorage } from "@/hooks/use-local-storage";

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
  selectedDashboard: DashboardOption;
  setSelectedDashboard: (dashboard: DashboardOption) => void;
  reportDateRange: DateRange | undefined;
  setReportDateRange: (dateRange: DateRange | undefined) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useLocalStorage<Habit[]>("chrono-habits", DEFAULT_HABITS);
  const [habitData, setHabitData] = useLocalStorage<HabitData>("chrono-habit-data", {});

  const [isInitialized, setIsInitialized] = useState(false);

  const [selectedView, setSelectedView] = useState<ViewOption>("Week");
  const [selectedDashboard, setSelectedDashboard] = useState<DashboardOption>('habits');
  
  const defaultDateRange: DateRange = {
    from: subDays(new Date(), 6),
    to: new Date(),
  };
  const [reportDateRange, setReportDateRange] = useState<DateRange | undefined>(defaultDateRange);


  const router = useRouter();
  
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const handleDashboardChange = (dashboard: DashboardOption) => {
    setSelectedDashboard(dashboard);
    if (dashboard === 'habits') {
      router.push('/dashboard');
    } else if (dashboard === 'wealth') {
      router.push('/wealth');
    } else if (dashboard === 'career') {
      router.push('/career');
    }
  };

  const updateHabits = (newHabits: Habit[]) => {
    setHabits(newHabits);
  };

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
        const existingLog = newData[date][habitId] || {};
        newData[date][habitId] = {
          ...existingLog,
          completed: log.completed,
          ...(log.value !== undefined && { value: log.value }),
        };
        return newData;
      });
    },
    [setHabitData]
  );
  
  const filteredDates = useMemo(
    () => getFilteredDates(selectedView, reportDateRange?.from || new Date()),
    [selectedView, reportDateRange]
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
    selectedDashboard,
    setSelectedDashboard: handleDashboardChange,
    reportDateRange,
    setReportDateRange,
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
