'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
} from 'react';
import { useApp } from './app-provider';
import { useWealth } from './wealth-provider';
import { isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { format } from 'date-fns';

interface FinancialReportContextType {
  view: 'Day' | 'Week' | 'Month' | 'Year';
  filteredDates: Date[];
  totalExpenses: number;
  totalTrips: number;
  totalSavings: number;
  filteredExpenses: Record<string, { id: string; name: string; amount: number }[]>;
}

const FinancialReportContext = createContext<
  FinancialReportContextType | undefined
>(undefined);

export function FinancialReportProvider({ children }: { children: ReactNode }) {
  const { selectedView, filteredDates } = useApp();
  const { wealthData } = useWealth();

  const timeInterval = useMemo(() => {
    if (!filteredDates.length) {
      const now = new Date();
      return { start: now, end: now };
    }
    return { start: filteredDates[0], end: filteredDates[filteredDates.length - 1] };
  }, [filteredDates]);

  const { totalExpenses, filteredExpenses } = useMemo(() => {
    let total = 0;
    const filtered: Record<string, { id: string; name: string; amount: number }[]> = {};
    
    Object.entries(wealthData.expenses).forEach(([dateStr, expenses]) => {
      const date = new Date(dateStr);
      if (isWithinInterval(date, timeInterval)) {
        filtered[dateStr] = expenses;
        total += expenses.reduce((sum, exp) => sum + exp.amount, 0);
      }
    });
    return { totalExpenses: total, filteredExpenses: filtered };
  }, [wealthData.expenses, timeInterval]);

  const totalTrips = useMemo(() => {
    return wealthData.trips.reduce((sum, trip) => sum + trip.amount, 0);
  }, [wealthData.trips]);
  
  const totalSavings = useMemo(() => {
    if (selectedView === 'Month') {
        const currentMonthStart = startOfMonth(new Date());
        if (isWithinInterval(currentMonthStart, timeInterval)) {
            return wealthData.monthlySalary - totalExpenses;
        }
    }
    return 0;
  }, [wealthData.monthlySalary, totalExpenses, selectedView, timeInterval]);


  const value = {
    view: selectedView,
    filteredDates,
    totalExpenses,
    totalTrips,
    totalSavings,
    filteredExpenses,
  };

  return (
    <FinancialReportContext.Provider value={value}>
      {children}
    </FinancialReportContext.Provider>
  );
}

export function useFinancialReport() {
  const context = useContext(FinancialReportContext);
  if (context === undefined) {
    throw new Error(
      'useFinancialReport must be used within a FinancialReportProvider'
    );
  }
  return context;
}
