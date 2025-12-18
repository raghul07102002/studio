
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
import type { Habit, HabitData, ViewOption, DashboardOption, HabitLog } from "@/lib/types";
import { DEFAULT_HABITS } from "@/data/habits";
import { format, subDays } from "date-fns";
import { getFilteredDates } from "@/lib/analysis";
import { useRouter, usePathname } from "next/navigation";
import { DateRange } from "react-day-picker";
import { useUser, useFirestore, useMemoFirebase, useCollection, useDoc } from "@/firebase";
import {
  collection,
  doc,
  query,
} from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

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
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const [selectedView, setSelectedView] = useState<ViewOption>("Week");
  const [selectedDashboard, setSelectedDashboard] = useLocalStorage<DashboardOption>('chrono-dashboard-selection', 'habits');
  
  const defaultDateRange: DateRange = {
    from: subDays(new Date(), 6),
    to: new Date(),
  };
  const [reportDateRange, setReportDateRange] = useState<DateRange | undefined>(defaultDateRange);


  const router = useRouter();
  const pathname = usePathname();

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, "users", user.uid);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isUserProfileLoading } = useDoc<{habits: Habit[]}>(userDocRef);

  const habits = useMemo(() => userProfile?.habits || DEFAULT_HABITS, [userProfile]);

  const habitLogsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, `users/${user.uid}/habitLogs`));
  }, [user, firestore]);

  const { data: habitLogs, isLoading: isHabitLogsLoading } = useCollection<HabitLog>(habitLogsQuery);

  const habitData = useMemo(() => {
    if (!habitLogs) return {};
    return habitLogs.reduce((acc, log) => {
      if (!acc[log.date]) {
        acc[log.date] = {};
      }
      acc[log.date][log.habitId] = log;
      return acc;
    }, {} as HabitData);
  }, [habitLogs]);

  const handleDashboardChange = (dashboard: DashboardOption) => {
    setSelectedDashboard(dashboard);
    if (dashboard === 'habits') {
      if (pathname.startsWith('/wealth') || pathname.startsWith('/history')) {
        router.push('/dashboard');
      }
    } else {
        if (!pathname.startsWith('/wealth') && !pathname.startsWith('/history')) {
            router.push('/wealth');
        }
    }
  };

  const updateHabits = useCallback(
    (newHabits: Habit[]) => {
      if (userDocRef) {
        setDocumentNonBlocking(userDocRef, { habits: newHabits }, { merge: true });
      }
    },
    [userDocRef]
  );

  const updateHabitLog = useCallback(
    (
      date: string,
      habitId: string,
      log: { completed: boolean; value?: number }
    ) => {
        if (!user) return;

        const logId = `${date}_${habitId}`;
        const logDocRef = doc(firestore, `users/${user.uid}/habitLogs`, logId);
        
        const existingLog = (habitData[date] && habitData[date][habitId]) || {};

        const newLogData: HabitLog = {
            ...existingLog,
            date,
            habitId,
            completed: log.completed,
            ...(log.value !== undefined && { value: log.value }),
        };

        setDocumentNonBlocking(logDocRef, newLogData, { merge: true });
    },
    [user, firestore, habitData]
  );
  
  const filteredDates = useMemo(
    () => getFilteredDates(selectedView, reportDateRange?.from || new Date()),
    [selectedView, reportDateRange]
  );

  const isInitialized = !isUserLoading && !isUserProfileLoading && !isHabitLogsLoading;

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
