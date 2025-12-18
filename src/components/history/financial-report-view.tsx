'use client';

import { HistoryMetrics } from './history-metrics';
import { ExpenseTrendChart } from './expense-trend-chart';

export function FinancialReportView() {
  return (
    <div className="space-y-6">
      <HistoryMetrics />
      <ExpenseTrendChart />
    </div>
  );
}
