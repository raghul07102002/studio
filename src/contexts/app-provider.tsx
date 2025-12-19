
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
import type { Habit, HabitData, ViewOption, DashboardOption, HabitLog, WealthData, RoadmapItem, CareerPath, Subtask, TravelData } from "@/lib/types";
import { DEFAULT_HABITS } from "@/data/habits";
import { subDays } from "date-fns";
import { getFilteredDates } from "@/lib/analysis";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { doc } from "firebase/firestore";
import { useFirestore, useUser, useMemoFirebase, updateDocumentNonBlocking, useDoc } from "@/firebase";

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

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, "users", user.uid) : null),
    [user, firestore]
  );
  
  const { data: userProfileData, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);
  
  const [localData, setLocalData] = useState<UserProfile>({
    habits: DEFAULT_HABITS,
    habitData: {},
    wealthData: DEFAULT_WEALTH_DATA,
    careerRoadmaps: initialRoadmaps,
    travelData: DEFAULT_TRAVEL_DATA,
  });

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
    if (!isProfileLoading && !isUserLoading) {
      if (userProfileData) {
        setLocalData({
          habits: userProfileData.habits || DEFAULT_HABITS,
          habitData: userProfileData.habitData || {},
          wealthData: userProfileData.wealthData || DEFAULT_WEALTH_DATA,
          careerRoadmaps: userProfileData.careerRoadmaps || initialRoadmaps,
          travelData: userProfileData.travelData || DEFAULT_TRAVEL_DATA,
        });
      } else if (user) {
        // New user, set default data
        const defaultData = {
          habits: DEFAULT_HABITS,
          habitData: {},
          wealthData: DEFAULT_WEALTH_DATA,
          careerRoadmaps: initialRoadmaps,
          travelData: DEFAULT_TRAVEL_DATA,
        };
        setLocalData(defaultData);
        updateDocument(defaultData);
      }
      setIsInitialized(true);
    }
  }, [user, userProfileData, isProfileLoading, isUserLoading]);


  const updateDocument = useCallback((data: Partial<UserProfile>) => {
    if (userDocRef) {
      updateDocumentNonBlocking(userDocRef, data);
    }
  }, [userDocRef]);

  const handleDashboardChange = (dashboard: DashboardOption) => {
    setSelectedDashboard(dashboard);
    if (dashboard === 'habits') router.push('/dashboard');
    else if (dashboard === 'wealth') router.push('/wealth');
    else if (dashboard === 'career') router.push('/career');
    else if (dashboard === 'travel') router.push('/travel');
  };

  const updateHabits = useCallback((newHabits: Habit[]) => {
    setLocalData(prev => {
        const newState = {...prev, habits: newHabits };
        updateDocument({ habits: newHabits });
        return newState;
    });
  }, [updateDocument]);
  
  const updateHabitLog = useCallback((date: string, habitId: string, log: Partial<HabitLog>) => {
    setLocalData(prev => {
        const newHabitData = { ...prev.habitData };
        if (!newHabitData[date]) newHabitData[date] = {};
        const existingLog = newHabitData[date][habitId] || {};
        newHabitData[date][habitId] = { ...existingLog, ...log };
        updateDocument({ habitData: newHabitData });
        return { ...prev, habitData: newHabitData };
    });
  }, [updateDocument]);
  
  const updateWealthData = useCallback((data: Partial<WealthData>) => {
    setLocalData(prev => {
        const newWealthData = { ...prev.wealthData, ...data } as WealthData;
        updateDocument({ wealthData: newWealthData });
        return { ...prev, wealthData: newWealthData };
    });
  }, [updateDocument]);

  const updateTravelData = useCallback((data: Partial<TravelData>) => {
    setLocalData(prev => {
        const newTravelData = { ...prev.travelData, ...data } as TravelData;
        updateDocument({ travelData: newTravelData });
        return { ...prev, travelData: newTravelData };
    });
  }, [updateDocument]);

  const updateRoadmapItem = useCallback((path: CareerPath, updatedItem: RoadmapItem) => {
    setLocalData(prev => {
        const newRoadmaps = { ...(prev.careerRoadmaps || initialRoadmaps) };
        newRoadmaps[path] = (newRoadmaps[path] || []).map(item => item.id === updatedItem.id ? updatedItem : item);
        updateDocument({ careerRoadmaps: newRoadmaps });
        return { ...prev, careerRoadmaps: newRoadmaps };
    });
  }, [updateDocument]);

  const addRoadmapItem = useCallback((path: CareerPath, title: string) => {
      const newItem: RoadmapItem = { id: `item-${path}-${Date.now()}`, title, hoursSpent: 0, subtasks: [] };
      setLocalData(prev => {
          const newRoadmaps = { ...(prev.careerRoadmaps || initialRoadmaps) };
          newRoadmaps[path] = [...(newRoadmaps[path] || []), newItem];
          updateDocument({ careerRoadmaps: newRoadmaps });
          return { ...prev, careerRoadmaps: newRoadmaps };
      });
  }, [updateDocument]);

  const removeRoadmapItem = useCallback((path: CareerPath, itemId: string) => {
      setLocalData(prev => {
          const newRoadmaps = { ...(prev.careerRoadmaps || initialRoadmaps) };
          newRoadmaps[path] = (newRoadmaps[path] || []).filter(item => item.id !== itemId);
          updateDocument({ careerRoadmaps: newRoadmaps });
          return { ...prev, careerRoadmaps: newRoadmaps };
      });
  }, [updateDocument]);
  
  const addSubtask = useCallback((path: CareerPath, itemId: string, title: string) => {
    const newSubtask: Subtask = { id: `subtask-${Date.now()}`, title, completed: false };
    setLocalData(prev => {
        const newRoadmaps = { ...(prev.careerRoadmaps || initialRoadmaps) };
        const newItems = (newRoadmaps[path] || []).map(item => {
            if (item.id === itemId) {
                const subtasks = [...(item.subtasks || []), newSubtask];
                return { ...item, subtasks };
            }
            return item;
        });
        newRoadmaps[path] = newItems;
        updateDocument({ careerRoadmaps: newRoadmaps });
        return { ...prev, careerRoadmaps: newRoadmaps };
    });
  }, [updateDocument]);
  
  const updateSubtask = useCallback((path: CareerPath, itemId: string, subtaskId: string, updates: Partial<Subtask>) => {
    setLocalData(prev => {
        const newRoadmaps = { ...(prev.careerRoadmaps || initialRoadmaps) };
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
        updateDocument({ careerRoadmaps: newRoadmaps });
        return { ...prev, careerRoadmaps: newRoadmaps };
    });
  }, [updateDocument]);

  const removeSubtask = useCallback((path: CareerPath, itemId: string, subtaskId: string) => {
    setLocalData(prev => {
        const newRoadmaps = { ...(prev.careerRoadmaps || initialRoadmaps) };
        const newItems = (newRoadmaps[path] || []).map(item => {
            if (item.id === itemId) {
                const subtasks = (item.subtasks || []).filter(subtask => subtask.id !== subtaskId);
                return { ...item, subtasks };
            }
            return item;
        });
        newRoadmaps[path] = newItems;
        updateDocument({ careerRoadmaps: newRoadmaps });
        return { ...prev, careerRoadmaps: newRoadmaps };
    });
  }, [updateDocument]);


  const filteredDates = useMemo(
    () => getFilteredDates(selectedView, reportDateRange?.from || new Date()),
    [selectedView, reportDateRange]
  );
  
  const value: AppContextType = {
    ...localData,
    habits: localData.habits || DEFAULT_HABITS,
    habitData: localData.habitData || {},
    wealthData: localData.wealthData || DEFAULT_WEALTH_DATA,
    roadmaps: localData.careerRoadmaps || initialRoadmaps,
    travelData: localData.travelData || DEFAULT_TRAVEL_DATA,
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
