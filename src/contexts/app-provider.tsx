
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  useCallback,
} from "react";
import type { Habit, HabitData, ViewOption, DashboardOption, HabitLog, WealthData, RoadmapItem, CareerPath, Subtask, TravelData, TravelEntry } from "@/lib/types";
import { DEFAULT_HABITS } from "@/data/habits";
import { subDays, eachDayOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { getFilteredDates } from "@/lib/analysis";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { useLocalStorage } from "@/hooks/use-local-storage";

// Default initial states
const DEFAULT_WEALTH_DATA: WealthData = {
  monthlySalary: 0,
  monthlySavings: 0,
  expenses: {},
  trips: [],
  savingsAllocation: {
    mutualFunds: { debt: [], gold: [], equity: [] },
    emergencyFunds: [],
    shortTermGoals: [],
  },
  expenseBudgets: {},
  tripBudgets: {},
};

const DEFAULT_TRAVEL_DATA: TravelData = {
  places: [],
  selectedStates: [],
};

const initialRoadmaps: Record<CareerPath, RoadmapItem[]> = {
    'CyberArk': [
        { id: 'cyberark-0', title: 'Introduction to PAM, IAM & Vault Basics', hoursSpent: 0, subtasks: [] },
        { id: 'cyberark-1', title: 'Core Components (PVWA, CPM, PSM, PSMP)', hoursSpent: 0, subtasks: [] },
        { id: 'cyberark-2', title: 'Safes, Platforms, and Account Management', hoursSpent: 0, subtasks: [] },
        { id: 'cyberark-3', title: 'Authentication & Session Monitoring', hoursSpent: 0, subtasks: [] },
        { id: 'cyberark-4', title: 'Advanced Topics: PTA, AAM, and Conjur', hoursSpent: 0, subtasks: [] },
    ],
    'Sailpoint IDN': [
        { id: 'sailpoint-0', title: 'IdentityNow Basics & Terminology', hoursSpent: 0, subtasks: [] },
        { id: 'sailpoint-1', title: 'Sources, Accounts, and Entitlements', hoursSpent: 0, subtasks: [] },
        { id: 'sailpoint-2', title: 'Access Profiles and Roles', hoursSpent: 0, subtasks: [] },
        { id: 'sailpoint-3', title: 'Certification Campaigns & Policies', hoursSpent: 0, subtasks: [] },
        { id: 'sailpoint-4', title: 'Transforms and Provisioning Logic', hoursSpent: 0, subtasks: [] },
    ],
    'Cloud computing': [
        { id: 'cloud-0', title: 'Core Concepts: IaaS, PaaS, SaaS', hoursSpent: 0, subtasks: [] },
        { id: 'cloud-1', title: 'Networking & Security in the Cloud', hoursSpent: 0, subtasks: [] },
        { id: 'cloud-2', title: 'Compute Services (VMs, Containers, Serverless)', hoursSpent: 0, subtasks: [] },
        { id: 'cloud-3', title: 'Storage & Database Solutions', hoursSpent: 0, subtasks: [] },
        { id: 'cloud-4', title: 'Identity and Access Management (IAM)', hoursSpent: 0, subtasks: [] },
    ],
    'Devops': [
        { id: 'devops-0', title: 'CI/CD Pipelines (e.g., Jenkins, GitLab CI)', hoursSpent: 0, subtasks: [] },
        { id: 'devops-1', title: 'Infrastructure as Code (Terraform, Ansible)', hoursSpent: 0, subtasks: [] },
        { id: 'devops-2', title: 'Containerization (Docker, Kubernetes)', hoursSpent: 0, subtasks: [] },
        { id: 'devops-3', title: 'Monitoring & Observability (Prometheus, Grafana)', hoursSpent: 0, subtasks: [] },
        { id: 'devops-4', title: 'Scripting & Automation (Bash, Python)', hoursSpent: 0, subtasks: [] },
    ],
};


interface UserProfile {
  habits?: Habit[];
  habitData?: HabitData;
  wealthData?: WealthData;
  careerRoadmaps?: Record<CareerPath, RoadmapItem[]>;
  travelData?: TravelData;
}

interface AppContextType {
  habits: Habit[];
  habitData: HabitData;
  wealthData: WealthData;
  roadmaps: Record<CareerPath, RoadmapItem[]>;
  travelData: TravelData;

  updateHabits: (habits: Habit[]) => void;
  updateHabitLog: (date: string, habitId: string, log: Partial<HabitLog>) => void;
  updateWealthData: (data: Partial<WealthData>) => void;
  updateTravelData: (data: Partial<TravelData>) => void;
  
  updateRoadmapItem: (path: CareerPath, item: RoadmapItem) => void;
  addRoadmapItem: (path: CareerPath, title: string) => void;
  removeRoadmapItem: (path: CareerPath, itemId: string) => void;
  
  addSubtask: (path: CareerPath, itemId: string, title: string) => void;
  updateSubtask: (path: CareerPath, itemId: string, subtaskId: string, updates: Partial<Subtask>) => void;
  removeSubtask: (path: CareerPath, itemId: string, subtaskId: string) => void;

  selectedView: ViewOption;
  setSelectedView: (view: ViewOption) => void;
  
  habitChartDateRange: DateRange;
  setHabitChartDateRange: (range: DateRange) => void;

  filteredDates: Date[];
  isInitialized: boolean;
  
  selectedDashboard: DashboardOption;
  setSelectedDashboard: (dashboard: DashboardOption) => void;
  reportDateRange: DateRange | undefined;
  setReportDateRange: (dateRange: DateRange | undefined) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useLocalStorage<Habit[]>("habits", DEFAULT_HABITS);
  const [habitData, setHabitData] = useLocalStorage<HabitData>("habitData", {});
  const [wealthData, setWealthData] = useLocalStorage<WealthData>("wealthData", DEFAULT_WEALTH_DATA);
  const [roadmaps, setRoadmaps] = useLocalStorage<Record<CareerPath, RoadmapItem[]>>("careerRoadmaps", initialRoadmaps);
  
  const [rawTravelData, setRawTravelData] = useLocalStorage<{ places: (TravelEntry | TravelData['places'][0])[] }>("travel-entries", { places: [] });

  const [isInitialized, setIsInitialized] = useState(false);
  
  const [selectedView, setSelectedView] = useState<ViewOption>("Week");
  const [selectedDashboard, setSelectedDashboard] = useLocalStorage<DashboardOption>('selectedDashboard', 'habits');
  
  const defaultDateRange: DateRange = {
    from: subDays(new Date(), 6),
    to: new Date(),
  };
  const [reportDateRange, setReportDateRange] = useState<DateRange | undefined>(defaultDateRange);
  const [habitChartDateRange, setHabitChartDateRange] = useLocalStorage<DateRange>("habitChartDateRange", { 
    from: startOfWeek(new Date()), 
    to: endOfWeek(new Date()) 
  });

  const travelData = useMemo(() => {
    const places = (rawTravelData.places || []).map(p => {
        if ('from' in p && 'to' in p) { // It's a TravelEntry
            return p;
        }
        return p;
    });
    return { places: places, selectedStates: [] };
  }, [rawTravelData]);

  const updateTravelData = useCallback((data: Partial<TravelData>) => {
    const currentPlaces = travelData.places || [];
    const newPlaces = data.places || currentPlaces;
    setRawTravelData({ places: newPlaces });
  }, [travelData, setRawTravelData]);


  const router = useRouter();
  
  useEffect(() => {
    // Since useLocalStorage is async, we can consider the app initialized once the first value is loaded.
    // A more robust solution might check if all local storage values are loaded.
    setIsInitialized(true);
  }, []);


  const handleDashboardChange = (dashboard: DashboardOption) => {
    setSelectedDashboard(dashboard);
    if (dashboard === 'habits') router.push('/dashboard');
    else if (dashboard === 'wealth') router.push('/wealth');
    else if (dashboard === 'career') router.push('/career');
    else if (dashboard === 'travel') router.push('/travel');
    else if (dashboard === 'day-planner') router.push('/day-planner');
  };

  const updateHabits = useCallback((newHabits: Habit[]) => {
    setHabits(newHabits);
  }, [setHabits]);
  
  const updateHabitLog = useCallback((date: string, habitId: string, log: Partial<HabitLog>) => {
    setHabitData(prev => {
        const newHabitData = { ...prev };
        if (!newHabitData[date]) newHabitData[date] = {};
        const existingLog = newHabitData[date][habitId] || {};
        newHabitData[date][habitId] = { ...existingLog, ...log };
        return newHabitData;
    });
  }, [setHabitData]);
  
  const updateWealthData = useCallback((data: Partial<WealthData>) => {
    setWealthData(prev => ({ ...prev, ...data }));
  }, [setWealthData]);

  const updateRoadmapItem = useCallback((path: CareerPath, updatedItem: RoadmapItem) => {
    setRoadmaps(prev => {
        const newRoadmaps = { ...prev };
        newRoadmaps[path] = (newRoadmaps[path] || []).map(item => item.id === updatedItem.id ? updatedItem : item);
        return newRoadmaps;
    });
  }, [setRoadmaps]);

  const addRoadmapItem = useCallback((path: CareerPath, title: string) => {
      const newItem: RoadmapItem = { id: `item-${path}-${Date.now()}`, title, hoursSpent: 0, subtasks: [] };
      setRoadmaps(prev => {
          const newRoadmaps = { ...prev };
          newRoadmaps[path] = [...(newRoadmaps[path] || []), newItem];
          return newRoadmaps;
      });
  }, [setRoadmaps]);

  const removeRoadmapItem = useCallback((path: CareerPath, itemId: string) => {
      setRoadmaps(prev => {
          const newRoadmaps = { ...prev };
          newRoadmaps[path] = (newRoadmaps[path] || []).filter(item => item.id !== itemId);
          return newRoadmaps;
      });
  }, [setRoadmaps]);
  
  const addSubtask = useCallback((path: CareerPath, itemId: string, title: string) => {
    const newSubtask: Subtask = { id: `subtask-${Date.now()}`, title, completed: false };
    setRoadmaps(prev => {
        const newRoadmaps = { ...prev };
        const newItems = (newRoadmaps[path] || []).map(item => {
            if (item.id === itemId) {
                const subtasks = [...(item.subtasks || []), newSubtask];
                return { ...item, subtasks };
            }
            return item;
        });
        newRoadmaps[path] = newItems;
        return newRoadmaps;
    });
  }, [setRoadmaps]);
  
  const updateSubtask = useCallback((path: CareerPath, itemId: string, subtaskId: string, updates: Partial<Subtask>) => {
    setRoadmaps(prev => {
        const newRoadmaps = { ...prev };
        const newItems = (newRoadmaps[path] || []).map(item => {
            if (item.id === itemId) {
                const subtasks = (item.subtasks || []).map(subtask => 
                    subtask.id === subtaskId ? { ...subtask, ...updates } : subtask
                );
                return { ...item, subtasks };
            }
            return item;
        });
        newRoadmaps[path] = newItems;
        return newRoadmaps;
    });
  }, [setRoadmaps]);

  const removeSubtask = useCallback((path: CareerPath, itemId: string, subtaskId: string) => {
    setRoadmaps(prev => {
        const newRoadmaps = { ...prev };
        const newItems = (newRoadmaps[path] || []).map(item => {
            if (item.id === itemId) {
                const subtasks = (item.subtasks || []).filter(subtask => subtask.id !== subtaskId);
                return { ...item, subtasks };
            }
            return item;
        });
        newRoadmaps[path] = newItems;
        return newRoadmaps;
    });
  }, [setRoadmaps]);


  const filteredDates = useMemo(() => {
    if (!habitChartDateRange?.from) {
      return [];
    }
    return eachDayOfInterval({
      start: habitChartDateRange.from,
      end: habitChartDateRange.to || habitChartDateRange.from,
    });
  }, [habitChartDateRange]);
  
  const value: AppContextType = {
    habits,
    habitData,
    wealthData,
    roadmaps,
    travelData,
    updateHabits,
    updateHabitLog,
    updateWealthData,
    updateTravelData,
    updateRoadmapItem,
    addRoadmapItem,
    removeRoadmapItem,
    addSubtask,
    updateSubtask,
    removeSubtask,
    selectedView,
    setSelectedView,
    habitChartDateRange,
    setHabitChartDateRange: setHabitChartDateRange as (range: DateRange) => void,
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
