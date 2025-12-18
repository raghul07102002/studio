
"use client";

import { createContext, useContext, ReactNode, useCallback, useEffect, useState } from "react";
import type { WealthData, Expense, Trip, Fund, MutualFunds } from "@/lib/types";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

const DEFAULT_WEALTH_DATA: WealthData = {
  monthlySalary: 0,
  monthlySavings: 0,
  expenses: {},
  trips: [],
  savingsAllocation: {
    mutualFunds: {
      debt: [],
      gold: [],
      equity: [],
    },
    emergencyFunds: [],
    shortTermGoals: [],
  },
  expenseBudgets: {},
  tripBudgets: {},
};

type FundCategory = keyof MutualFunds;
type TopLevelFundCategory = 'emergencyFunds' | 'shortTermGoals';


interface WealthContextType {
  wealthData: WealthData;
  updateWealthData: (data: Partial<WealthData>) => void;
  addExpense: (date: string, expense: Omit<Expense, "id">) => void;
  updateExpense: (date: string, expense: Expense) => void;
  removeExpense: (date: string, id: string) => void;
  addTrip: (trip: Omit<Trip, "id">) => void;
  updateTrip: (trip: Trip) => void;
  removeTrip: (id: string) => void;
  addFund: (category: FundCategory | TopLevelFundCategory, fund: Omit<Fund, 'id'>) => void;
  updateFund: (category: FundCategory | TopLevelFundCategory, fund: Fund) => void;
  removeFund: (category: FundCategory | TopLevelFundCategory, id: string) => void;
  setBudget: (type: 'expenses' | 'trips', month: string, amount: number) => void;
  isWealthDataLoading: boolean;
}

const WealthContext = createContext<WealthContextType | undefined>(undefined);

export function WealthProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [localWealthData, setLocalWealthData] = useState<WealthData>(DEFAULT_WEALTH_DATA);

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, "users", user.uid);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isUserLoading } = useDoc<{wealthData?: WealthData}>(userDocRef);

  useEffect(() => {
    if (userProfile && userProfile.wealthData) {
      // Deep merge to preserve structure if some fields are missing from Firestore
      const mergedData = {
        ...DEFAULT_WEALTH_DATA,
        ...userProfile.wealthData,
        savingsAllocation: {
          ...DEFAULT_WEALTH_DATA.savingsAllocation,
          ...(userProfile.wealthData.savingsAllocation || {}),
          mutualFunds: {
            ...DEFAULT_WEALTH_DATA.savingsAllocation.mutualFunds,
            ...(userProfile.wealthData.savingsAllocation?.mutualFunds || {}),
          },
        },
      };
      setLocalWealthData(mergedData);
    }
  }, [userProfile]);

  const updateWealthData = useCallback(
    (data: Partial<WealthData>) => {
      if (userDocRef) {
        const updatedData = { ...localWealthData, ...data };
        setLocalWealthData(updatedData); // Optimistic update
        setDocumentNonBlocking(userDocRef, { wealthData: updatedData }, { merge: true });
      }
    },
    [userDocRef, localWealthData]
  );
  
  useEffect(() => {
    if (user && userProfile && !isUserLoading) {
      const migrationFlag = `wealth-migration-complete-${user.uid}`;
      if (localStorage.getItem(migrationFlag)) {
        return;
      }

      const oldWealthData = localStorage.getItem('chrono-wealth-data');
      if (oldWealthData) {
        try {
          const dataToMigrate = JSON.parse(oldWealthData);
          // Only migrate if there's no existing wealth data in Firestore
          if (!userProfile.wealthData) {
            updateWealthData(dataToMigrate);
             console.log("Wealth data migration successful.");
          }
        } catch (e) {
          console.error("Error parsing old wealth data for migration:", e);
        }
      }
      localStorage.setItem(migrationFlag, 'true');
    }
  }, [user, userProfile, isUserLoading, updateWealthData]);

  const addExpense = (date: string, expense: Omit<Expense, "id">) => {
    const newExpense = { ...expense, id: `exp-${Date.now()}-${Math.random()}` };
    const newExpenses = { ...(localWealthData.expenses || {}) };
    if (!newExpenses[date]) {
      newExpenses[date] = [];
    }
    newExpenses[date].push(newExpense);
    updateWealthData({ expenses: newExpenses });
  };

  const updateExpense = (date: string, updatedExpense: Expense) => {
    const newExpenses = { ...(localWealthData.expenses || {}) };
    if (newExpenses[date]) {
      newExpenses[date] = newExpenses[date].map((e) =>
        e.id === updatedExpense.id ? updatedExpense : e
      );
      updateWealthData({ expenses: newExpenses });
    }
  };

  const removeExpense = (date: string, id: string) => {
    const newExpenses = { ...(localWealthData.expenses || {}) };
    if (newExpenses[date]) {
      newExpenses[date] = newExpenses[date].filter((e) => e.id !== id);
      if (newExpenses[date].length === 0) {
        delete newExpenses[date];
      }
      updateWealthData({ expenses: newExpenses });
    }
  };

  const addTrip = (trip: Omit<Trip, "id">) => {
    const newTrip = { ...trip, id: `trip-${Date.now()}-${Math.random()}` };
    updateWealthData({ trips: [...(localWealthData.trips || []), newTrip] });
  };

  const updateTrip = (updatedTrip: Trip) => {
    updateWealthData({
      trips: (localWealthData.trips || []).map((t) =>
        t.id === updatedTrip.id ? updatedTrip : t
      ),
    });
  };

  const removeTrip = (id: string) => {
    updateWealthData({ trips: (localWealthData.trips || []).filter((t) => t.id !== id) });
  };

  const addFund = (category: FundCategory | TopLevelFundCategory, fund: Omit<Fund, 'id'>) => {
    const newFund = { ...fund, id: `fund-${Date.now()}-${Math.random()}` };
    const currentAllocation = { ...(localWealthData.savingsAllocation || DEFAULT_WEALTH_DATA.savingsAllocation) };
    if (!currentAllocation.mutualFunds) currentAllocation.mutualFunds = { debt: [], gold: [], equity: [] };
    if (!currentAllocation.emergencyFunds) currentAllocation.emergencyFunds = [];
    if (!currentAllocation.shortTermGoals) currentAllocation.shortTermGoals = [];

    if (['debt', 'gold', 'equity'].includes(category)) {
      currentAllocation.mutualFunds[category as FundCategory].push(newFund);
    } else {
      currentAllocation[category as TopLevelFundCategory].push(newFund);
    }
    
    updateWealthData({ savingsAllocation: currentAllocation });
  };
  
  const updateFund = (category: FundCategory | TopLevelFundCategory, updatedFund: Fund) => {
    const currentAllocation = { ...(localWealthData.savingsAllocation || DEFAULT_WEALTH_DATA.savingsAllocation) };
    if (!currentAllocation.mutualFunds) return;

    if (['debt', 'gold', 'equity'].includes(category)) {
      const cat = category as FundCategory;
      currentAllocation.mutualFunds[cat] = currentAllocation.mutualFunds[cat].map(f => f.id === updatedFund.id ? updatedFund : f);
    } else {
        const cat = category as TopLevelFundCategory;
        currentAllocation[cat] = (currentAllocation[cat] || []).map(f => f.id === updatedFund.id ? updatedFund : f)
    }

    updateWealthData({ savingsAllocation: currentAllocation });
  };
  
  const removeFund = (category: FundCategory | TopLevelFundCategory, id: string) => {
    const currentAllocation = { ...(localWealthData.savingsAllocation || DEFAULT_WEALTH_DATA.savingsAllocation) };
    if (!currentAllocation.mutualFunds) return;
    
    if (['debt', 'gold', 'equity'].includes(category)) {
      const cat = category as FundCategory;
      currentAllocation.mutualFunds[cat] = currentAllocation.mutualFunds[cat].filter(f => f.id !== id);
    } else {
        const cat = category as TopLevelFundCategory;
        currentAllocation[cat] = (currentAllocation[cat] || []).filter(f => f.id !== id);
    }

    updateWealthData({ savingsAllocation: currentAllocation });
  };

  const setBudget = (type: 'expenses' | 'trips', month: string, amount: number) => {
      const budgetType = type === 'expenses' ? 'expenseBudgets' : 'tripBudgets';
      const budgets = localWealthData[budgetType] || {};
      updateWealthData({
        [budgetType]: {
          ...budgets,
          [month]: amount,
        },
      });
  };

  const value = {
    wealthData: localWealthData,
    updateWealthData,
    addExpense,
    updateExpense,
    removeExpense,
    addTrip,
    updateTrip,
    removeTrip,
    addFund,
    updateFund,
    removeFund,
    setBudget,
    isWealthDataLoading: isUserLoading,
  };

  return (
    <WealthContext.Provider value={value}>{children}</WealthContext.Provider>
  );
}

export function useWealth() {
  const context = useContext(WealthContext);
  if (context === undefined) {
    throw new Error("useWealth must be used within a WealthProvider");
  }
  return context;
}
