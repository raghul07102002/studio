
'use client';

import { HistoryMetrics } from './history-metrics';
import { ExpenseTrendChart } from './expense-trend-chart';
import { useFinancialReport } from '@/contexts/financial-report-provider';
import { Card, CardContent } from '../ui/card';
import { format } from 'date-fns';
import { DateSelector } from './date-selector';

export function FinancialReportView() {
  const { view, filteredDates } = useFinancialReport();
  
  const getSubtitle = () => {
    if (!filteredDates.length) return '';
    const start = filteredDates[0];
    const end = filteredDates[filteredDates.length - 1];

    switch (view) {
        case 'Day':
            return format(start, 'MMMM d, yyyy');
        case 'Week':
            return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
        case 'Month':
            return format(start, 'MMMM yyyy');
        case 'Year':
            return format(start, 'yyyy');
        default:
            return '';
    }
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
      <HistoryMetrics />
      <ExpenseTrendChart />
    </div>
  );
}
