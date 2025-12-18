
'use client';

import { HistoryMetrics } from './history-metrics';
import { ExpenseTrendChart } from './expense-trend-chart';
import { useFinancialReport } from '@/contexts/financial-report-provider';
import { Card, CardContent } from '../ui/card';
import { format } from 'date-fns';
import { DateSelector } from './date-selector';

export function FinancialReportView() {
  const { filteredDates } = useFinancialReport();
  
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
      <HistoryMetrics />
      <ExpenseTrendChart />
    </div>
  );
}
