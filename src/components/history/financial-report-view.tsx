
'use client';

import { HistoryMetrics } from './history-metrics';
import { ExpenseTrendChart } from './expense-trend-chart';
import { useApp } from '@/contexts/app-provider';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { format, eachDayOfInterval, isWithinInterval, parseISO } from 'date-fns';
import { useMemo, useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

export function FinancialReportView() {
  const { reportDateRange, setReportDateRange, wealthData } = useApp();
  
  const [startDate, setStartDate] = useState(reportDateRange?.from ? format(reportDateRange.from, 'yyyy-MM-dd') : '');
  const [endDate, setEndDate] = useState(reportDateRange?.to ? format(reportDateRange.to, 'yyyy-MM-dd') : '');

  const handleApplyFilter = () => {
    const from = startDate ? parseISO(startDate) : undefined;
    let to = endDate ? parseISO(endDate) : from;
     if (from && to && to < from) {
      to = from;
      setEndDate(startDate);
    }
    setReportDateRange({ from, to });
  };


  const timeInterval = useMemo(() => {
    if (!reportDateRange || !reportDateRange.from) {
      const now = new Date();
      return { start: now, end: now };
    }
    return { start: reportDateRange.from, end: reportDateRange.to || reportDateRange.from };
  }, [reportDateRange]);

  const filteredDates = useMemo(() => {
    try {
        return eachDayOfInterval(timeInterval);
    } catch (e) {
        return [];
    }
  }, [timeInterval]);

  const { totalExpenses, filteredExpenses } = useMemo(() => {
    let total = 0;
    const filtered: Record<string, { id: string; name: string; amount: number }[]> = {};
    
    if (wealthData && wealthData.expenses) {
        Object.entries(wealthData.expenses).forEach(([dateStr, expenses]) => {
          try {
            const date = parseISO(dateStr);
            if (isWithinInterval(date, timeInterval)) {
              filtered[dateStr] = expenses;
              total += expenses.reduce((sum, exp) => sum + exp.amount, 0);
            }
          } catch(e) {
            // ignore invalid date
          }
        });
    }
    return { totalExpenses: total, filteredExpenses: filtered };
  }, [wealthData.expenses, timeInterval]);

  const getSubtitle = () => {
    if (!filteredDates.length || !reportDateRange?.from) return 'Select a date range to view your history';
    const start = reportDateRange.from;
    const end = reportDateRange.to || start;

    if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
        return format(start, 'MMMM d, yyyy');
    }

    return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
          <p className="text-muted-foreground">{getSubtitle()}</p>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col sm:flex-row items-end gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input id="start-date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} max={endDate} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input id="end-date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} />
                </div>
                <Button onClick={handleApplyFilter}>Apply Filter</Button>
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
