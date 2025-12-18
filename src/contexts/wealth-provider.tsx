"use client";

import { createContext, useContext, ReactNode, useCallback } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { WealthData, Expense, Trip, Fund, MutualFunds } from "@/lib/types";

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
    const newExpense = { ...expense, id: `exp-${Date.now()}` };
    const newExpenses = { ...wealthData.expenses };
    if (!newExpenses[date]) {
      newExpenses[date] = [];
    }
    newExpenses[date].push(newExpense);
    updateWealthData({ expenses: newExpenses });
  };

  const updateExpense = (date: string, updatedExpense: Expense) => {
    const newExpenses = { ...wealthData.expenses };
    if (newExpenses[date]) {
      newExpenses[date] = newExpenses[date].map((e) =>
        e.id === updatedExpense.id ? updatedExpense : e
      );
      updateWealthData({ expenses: newExpenses });
    }
  };

  const removeExpense = (date: string, id: string) => {
    const newExpenses = { ...wealthData.expenses };
    if (newExpenses[date]) {
      newExpenses[date] = newExpenses[date].filter((e) => e.id !== id);
      if (newExpenses[date].length === 0) {
        delete newExpenses[date];
      }
      updateWealthData({ expenses: newExpenses });
    }
  };

  const addTrip = (trip: Omit<Trip, "id">) => {
    const newTrip = { ...trip, id: `trip-${Date.now()}` };
    updateWealthData({ trips: [...wealthData.trips, newTrip] });
  };

  const updateTrip = (updatedTrip: Trip) => {
    updateWealthData({
      trips: wealthData.trips.map((t) =>
        t.id === updatedTrip.id ? updatedTrip : t
      ),
    });
  };

  const removeTrip = (id: string) => {
    updateWealthData({ trips: wealthData.trips.filter((t) => t.id !== id) });
  };

  const addFund = (category: FundCategory | TopLevelFundCategory, fund: Omit<Fund, 'id'>) => {
    const newFund = { ...fund, id: `fund-${Date.now()}` };
    const currentAllocation = { ...wealthData.savingsAllocation };

    if (category in currentAllocation.mutualFunds) {
      currentAllocation.mutualFunds[category as FundCategory].push(newFund);
    } else {
      currentAllocation[category as TopLevelFundCategory].push(newFund);
    }
    
    updateWealthData({ savingsAllocation: currentAllocation });
  };
  
  const updateFund = (category: FundCategory | TopLevelFundCategory, updatedFund: Fund) => {
    const currentAllocation = { ...wealthData.savingsAllocation };

    if (category in currentAllocation.mutualFunds) {
      const cat = category as FundCategory;
      currentAllocation.mutualFunds[cat] = currentAllocation.mutualFunds[cat].map(f => f.id === updatedFund.id ? updatedFund : f);
    } else {
        const cat = category as TopLevelFundCategory;
        currentAllocation[cat] = currentAllocation[cat].map(f => f.id === updatedFund.id ? updatedFund : f)
    }

    updateWealthData({ savingsAllocation: currentAllocation });
  };
  
  const removeFund = (category: FundCategory | TopLevelFundCategory, id: string) => {
    const currentAllocation = { ...wealthData.savingsAllocation };
    
    if (category in currentAllocation.mutualFunds) {
      const cat = category as FundCategory;
      currentAllocation.mutualFunds[cat] = currentAllocation.mutualFunds[cat].filter(f => f.id !== id);
    } else {
        const cat = category as TopLevelFundCategory;
        currentAllocation[cat] = currentAllocation[cat].filter(f => f.id !== id);
    }

    updateWealthData({ savingsAllocation: currentAllocation });
  };

  const setBudget = (type: 'expenses' | 'trips', month: string, amount: number) => {
    if (type === 'expenses') {
      updateWealthData({
        expenseBudgets: {
          ...(wealthData.expenseBudgets || {}),
          [month]: amount,
        },
      });
    } else {
      updateWealthData({
        tripBudgets: {
          ...(wealthData.tripBudgets || {}),
          [month]: amount,
        },
      });
    }
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
