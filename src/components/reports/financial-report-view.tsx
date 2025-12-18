'use client';

import { ReportMetrics } from './report-metrics';
import { ExpenseTrendChart } from './expense-trend-chart';

export function FinancialReportView() {
  return (
    <div className="space-y-6">
      <ReportMetrics />
      <ExpenseTrendChart />
    </div>
  );
}
