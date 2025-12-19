
"use client";

import { createContext, useContext, ReactNode, useCallback } from "react";
import type { WealthData, Expense, Trip, Fund, MutualFunds } from "@/lib/types";
import { useLocalStorage } from "@/hooks/use-local-storage";

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
  const [wealthData, setWealthData] = useLocalStorage<WealthData>(
    "chrono-wealth-data",
    DEFAULT_WEALTH_DATA
  );

  const updateWealthData = useCallback(
    (data: Partial<WealthData>) => {
      setWealthData((prev) => ({ ...prev, ...data }));
    },
    [setWealthData]
  );
  
  const addExpense = (date: string, expense: Omit<Expense, "id">) => {
    const newExpense = { ...expense, id: `exp-${Date.now()}-${Math.random()}` };
    setWealthData(prev => {
        const newExpenses = { ...(prev.expenses || {}) };
        if (!newExpenses[date]) {
            newExpenses[date] = [];
        }
        newExpenses[date].push(newExpense);
        return { ...prev, expenses: newExpenses };
    });
  };

  const updateExpense = (date: string, updatedExpense: Expense) => {
    setWealthData(prev => {
        const newExpenses = { ...(prev.expenses || {}) };
        if (newExpenses[date]) {
            newExpenses[date] = newExpenses[date].map((e) =>
                e.id === updatedExpense.id ? updatedExpense : e
            );
        }
        return { ...prev, expenses: newExpenses };
    });
  };

  const removeExpense = (date: string, id: string) => {
    setWealthData(prev => {
        const newExpenses = { ...(prev.expenses || {}) };
        if (newExpenses[date]) {
            newExpenses[date] = newExpenses[date].filter((e) => e.id !== id);
             if (newExpenses[date].length === 0) {
                delete newExpenses[date];
            }
        }
        return { ...prev, expenses: newExpenses };
    });
  };

  const addTrip = (trip: Omit<Trip, "id">) => {
    const newTrip = { ...trip, id: `trip-${Date.now()}-${Math.random()}` };
    setWealthData(prev => ({...prev, trips: [...(prev.trips || []), newTrip] }));
  };

  const updateTrip = (updatedTrip: Trip) => {
    setWealthData(prev => ({
        ...prev,
        trips: (prev.trips || []).map((t) =>
            t.id === updatedTrip.id ? updatedTrip : t
        ),
    }));
  };

  const removeTrip = (id: string) => {
    setWealthData(prev => ({ ...prev, trips: (prev.trips || []).filter((t) => t.id !== id) }));
  };

  const addFund = (category: FundCategory | TopLevelFundCategory, fund: Omit<Fund, 'id' | 'schemeCode'> & { schemeCode?: string }) => {
    const newFund: Fund = { ...fund, id: `fund-${Date.now()}-${Math.random()}` };
    setWealthData(prev => {
        const currentAllocation = { ...(prev.savingsAllocation || DEFAULT_WEALTH_DATA.savingsAllocation) };
        if (!currentAllocation.mutualFunds) currentAllocation.mutualFunds = { debt: [], gold: [], equity: [] };
        if (!currentAllocation.emergencyFunds) currentAllocation.emergencyFunds = [];
        if (!currentAllocation.shortTermGoals) currentAllocation.shortTermGoals = [];

        if (['debt', 'gold', 'equity'].includes(category)) {
            currentAllocation.mutualFunds[category as FundCategory].push(newFund);
        } else {
            currentAllocation[category as TopLevelFundCategory].push(newFund);
        }
        return { ...prev, savingsAllocation: currentAllocation };
    });
  };
  
  const updateFund = (category: FundCategory | TopLevelFundCategory, updatedFund: Fund) => {
     setWealthData(prev => {
        const currentAllocation = { ...(prev.savingsAllocation || DEFAULT_WEALTH_DATA.savingsAllocation) };
        if (!currentAllocation.mutualFunds) return prev;

        if (['debt', 'gold', 'equity'].includes(category)) {
            const cat = category as FundCategory;
            currentAllocation.mutualFunds[cat] = currentAllocation.mutualFunds[cat].map(f => f.id === updatedFund.id ? updatedFund : f);
        } else {
            const cat = category as TopLevelFundCategory;
            currentAllocation[cat] = (currentAllocation[cat] || []).map(f => f.id === updatedFund.id ? updatedFund : f)
        }
        return { ...prev, savingsAllocation: currentAllocation };
    });
  };
  
  const removeFund = (category: FundCategory | TopLevelFundCategory, id: string) => {
    setWealthData(prev => {
        const currentAllocation = { ...(prev.savingsAllocation || DEFAULT_WEALTH_DATA.savingsAllocation) };
        if (!currentAllocation.mutualFunds) return prev;
        
        if (['debt', 'gold', 'equity'].includes(category)) {
            const cat = category as FundCategory;
            currentAllocation.mutualFunds[cat] = currentAllocation.mutualFunds[cat].filter(f => f.id !== id);
        } else {
            const cat = category as TopLevelFundCategory;
            currentAllocation[cat] = (currentAllocation[cat] || []).filter(f => f.id !== id);
        }
        return { ...prev, savingsAllocation: currentAllocation };
    });
  };

  const setBudget = (type: 'expenses' | 'trips', month: string, amount: number) => {
      const budgetType = type === 'expenses' ? 'expenseBudgets' : 'tripBudgets';
      setWealthData(prev => {
          const budgets = prev[budgetType] || {};
          return {
              ...prev,
              [budgetType]: {
                  ...budgets,
                  [month]: amount,
              },
          };
      });
  };

  const value = {
    wealthData: wealthData || DEFAULT_WEALTH_DATA,
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
    isWealthDataLoading: false,
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
