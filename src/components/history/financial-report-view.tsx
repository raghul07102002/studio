
'use client';

import { HistoryMetrics } from './history-metrics';
import { ExpenseTrendChart } from './expense-trend-chart';
import { useApp } from '@/contexts/app-provider';
import { Card, CardContent } from '../ui/card';
import { format, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { DateSelector } from './date-selector';
import { useMemo } from 'react';

export function FinancialReportView() {
  const { reportDateRange, wealthData } = useApp();
  
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
    
    if (wealthData && wealthData.expenses) {
        Object.entries(wealthData.expenses).forEach(([dateStr, expenses]) => {
          const date = new Date(dateStr);
          if (isWithinInterval(date, timeInterval)) {
            filtered[dateStr] = expenses;
            total += expenses.reduce((sum, exp) => sum + exp.amount, 0);
          }
        });
    }
    return { totalExpenses: total, filteredExpenses: filtered };
  }, [wealthData.expenses, timeInterval]);

  const getSubtitle = () => {
    if (!filteredDates.length) return 'Select a date range to view your history';
    const start = filteredDates[0];
    const end = filteredDates[filteredDates.length - 1];

    if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
        return format(start, 'MMMM d, yyyy');
    }

    return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">History</h1>
                    <p className="text-muted-foreground">{getSubtitle()}</p>
                </div>
                <DateSelector />
            </div>
        </CardContent>
      </Card>
      <HistoryMetrics 
        totalExpenses={totalExpenses} 
        timeInterval={timeInterval}
      />
      <ExpenseTrendChart 
        filteredDates={filteredDates} 
        filteredExpenses={filteredExpenses} 
      />
    </div>
  );
}
