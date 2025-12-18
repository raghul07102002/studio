
'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useMemo,
} from 'react';
import { useApp } from './app-provider';
import { useWealth } from './wealth-provider';
import { isWithinInterval, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

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
  const { selectedView, reportDateRange } = useApp();
  const { wealthData } = useWealth();

  const timeInterval = useMemo(() => {
    if (!reportDateRange || !reportDateRange.from) {
      const now = new Date();
      return { start: now, end: now };
    }
    return { start: reportDateRange.from, end: reportDateRange.to || reportDateRange.from };
  }, [reportDateRange]);

  const filteredDates = useMemo(() => {
    return eachDayOfInterval(timeInterval);
  }, [timeInterval]);

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
    // This calculation might need to be adjusted based on how trip dates are handled.
    // For now, we sum all trips as before, since they aren't tied to dates.
    return wealthData.trips.reduce((sum, trip) => sum + trip.amount, 0);
  }, [wealthData.trips]);
  
  const totalSavings = useMemo(() => {
    // This logic might need refinement based on how savings are tied to date ranges.
    // A simple approach is to check if the range covers a full month.
    const start = timeInterval.start;
    const end = timeInterval.end;
    const isFullMonth = start.getDate() === 1 && end.getDate() === endOfMonth(start).getDate();
    
    if (isFullMonth) {
        return wealthData.monthlySalary - totalExpenses;
    }
    return 0; // Or calculate proportional savings
  }, [wealthData.monthlySalary, totalExpenses, timeInterval]);


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
