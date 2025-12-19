
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/app-provider';
import { PiggyBank, Plane, Receipt } from 'lucide-react';
import { endOfMonth } from 'date-fns';

interface HistoryMetricsProps {
    totalExpenses: number;
    timeInterval: { start: Date; end: Date; };
}

export function HistoryMetrics({ totalExpenses, timeInterval }: HistoryMetricsProps) {
  const { selectedView, wealthData } = useApp();

  const totalTrips = useMemo(() => {
    return wealthData.trips.reduce((sum, trip) => sum + trip.amount, 0);
  }, [wealthData.trips]);
  
  const totalSavings = useMemo(() => {
    const start = timeInterval.start;
    const end = timeInterval.end;
    const isFullMonth = start.getDate() === 1 && end.getDate() === endOfMonth(start).getDate();
    
    if (isFullMonth) {
        return wealthData.monthlySalary - totalExpenses;
    }
    return 0; // Or calculate proportional savings
  }, [wealthData.monthlySalary, totalExpenses, timeInterval]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <Receipt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
          <p className="text-xs text-muted-foreground">For the selected {selectedView.toLowerCase()}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Trip Costs</CardTitle>
          <Plane className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalTrips)}</div>
          <p className="text-xs text-muted-foreground">
            Total cost of trips planned
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalSavings)}</div>
          <p className="text-xs text-muted-foreground">For the selected {selectedView.toLowerCase()}</p>
        </CardContent>
      </Card>
    </div>
  );
}
