'use client';

import { CorpusChart } from './corpus-chart';
import { EditableTable } from './editable-table';
import { IncomeInput } from './income-input';
import { SavingsAllocation } from './savings-allocation';
import { WealthMetrics } from './wealth-metrics';

export function WealthDashboardView() {
  return (
    <div className="space-y-6">
      <WealthMetrics />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <IncomeInput />
          <EditableTable
            title="Expenses"
            description="Manage your monthly expenses."
            type="expenses"
          />
          <EditableTable
            title="Trip Costs"
            description="Plan for your travel expenses."
            type="trips"
          />
        </div>
        <div className="lg:col-span-2 space-y-6">
            <CorpusChart />
            <SavingsAllocation />
        </div>
      </div>
    </div>
  );
}
