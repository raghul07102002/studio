"use client";

import { createContext, useContext, ReactNode, useCallback } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { WealthData, Expense, Trip, Fund } from "@/lib/types";

const DEFAULT_WEALTH_DATA: WealthData = {
  monthlySalary: 0,
  monthlySavings: 50000,
  expenses: [],
  trips: [],
  savingsAllocation: {
    debt: [],
    gold: [],
    equity: [],
  },
};

interface WealthContextType {
  wealthData: WealthData;
  updateWealthData: (data: Partial<WealthData>) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (expense: Expense) => void;
  removeExpense: (id: string) => void;
  addTrip: (trip: Omit<Trip, "id">) => void;
  updateTrip: (trip: Trip) => void;
  removeTrip: (id: string) => void;
  addFund: (category: keyof WealthData['savingsAllocation'], fund: Omit<Fund, 'id'>) => void;
  updateFund: (category: keyof WealthData['savingsAllocation'], fund: Fund) => void;
  removeFund: (category: keyof WealthData['savingsAllocation'], id: string) => void;
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
  
  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = { ...expense, id: `exp-${Date.now()}` };
    updateWealthData({ expenses: [...wealthData.expenses, newExpense] });
  };

  const updateExpense = (updatedExpense: Expense) => {
    updateWealthData({
      expenses: wealthData.expenses.map((e) =>
        e.id === updatedExpense.id ? updatedExpense : e
      ),
    });
  };

  const removeExpense = (id: string) => {
    updateWealthData({
      expenses: wealthData.expenses.filter((e) => e.id !== id),
    });
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

  const addFund = (category: keyof WealthData['savingsAllocation'], fund: Omit<Fund, 'id'>) => {
    const newFund = { ...fund, id: `fund-${Date.now()}` };
    const currentAllocation = wealthData.savingsAllocation;
    updateWealthData({
      savingsAllocation: {
        ...currentAllocation,
        [category]: [...currentAllocation[category], newFund],
      }
    })
  };
  
  const updateFund = (category: keyof WealthData['savingsAllocation'], updatedFund: Fund) => {
    const currentAllocation = wealthData.savingsAllocation;
    updateWealthData({
      savingsAllocation: {
        ...currentAllocation,
        [category]: currentAllocation[category].map(f => f.id === updatedFund.id ? updatedFund : f),
      }
    })
  };
  
  const removeFund = (category: keyof WealthData['savingsAllocation'], id: string) => {
    const currentAllocation = wealthData.savingsAllocation;
    updateWealthData({
      savingsAllocation: {
        ...currentAllocation,
        [category]: currentAllocation[category].filter(f => f.id !== id),
      }
    })
  };


  const value = {
    wealthData,
    updateWealthData,
    addExpense,
    updateExpense,
    removeExpense,
    addTrip,
    updateTrip,
    removeTrip,
    addFund,
    updateFund,
    removeFund
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
