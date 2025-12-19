
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
import { useUser, useFirestore, useMemoFirebase, useCollection, useDoc } from "@/firebase";
import {
  collection,
  doc,
  query,
  writeBatch,
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
  const [selectedDashboard, setSelectedDashboard] = useState<DashboardOption>('habits');
  
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

  const { data: userProfile, isLoading: isUserProfileLoading } = useDoc<{habits?: Habit[]}>(userDocRef);

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
      router.push('/dashboard');
    } else if (dashboard === 'wealth') {
      router.push('/wealth');
    } else if (dashboard === 'career') {
      router.push('/career');
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
            date,
            habitId,
            completed: log.completed,
            ...(log.value !== undefined && { value: log.value }),
            ...(existingLog.value !== undefined && log.value === undefined && { value: existingLog.value })
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

  // One-time data migration from localStorage to Firestore
  useEffect(() => {
    if (isInitialized && user && firestore) {
      const migrationFlag = `migration-complete-${user.uid}`;
      if (localStorage.getItem(migrationFlag)) {
        return;
      }

      const oldHabits = localStorage.getItem('chrono-habits');
      const oldHabitData = localStorage.getItem('chrono-habit-data');

      if (oldHabits) {
        const habitsToMigrate = JSON.parse(oldHabits);
        if (userDocRef) {
          setDocumentNonBlocking(userDocRef, { habits: habitsToMigrate }, { merge: true });
        }
      }

      if (oldHabitData) {
        const habitDataToMigrate: HabitData = JSON.parse(oldHabitData);
        const batch = writeBatch(firestore);

        Object.entries(habitDataToMigrate).forEach(([date, dailyLogs]) => {
          Object.entries(dailyLogs).forEach(([habitId, log]) => {
            const logId = `${date}_${habitId}`;
            const logDocRef = doc(firestore, `users/${user.uid}/habitLogs`, logId);
            const logData: HabitLog = {
                date,
                habitId,
                completed: log.completed,
                ...(log.value !== undefined && {value: log.value})
            };
            batch.set(logDocRef, logData, { merge: true });
          });
        });
        
        batch.commit().then(() => {
            console.log("Habit data migration successful.");
            localStorage.setItem(migrationFlag, 'true');
            // Optionally clear old data
            // localStorage.removeItem('chrono-habits');
            // localStorage.removeItem('chrono-habit-data');
        }).catch(error => {
            console.error("Error migrating habit data: ", error);
        });
      } else {
        // If no old data, still set flag to prevent future checks
        localStorage.setItem(migrationFlag, 'true');
      }
    }
  }, [isInitialized, user, firestore, userDocRef]);


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
