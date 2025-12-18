'use client';

import { CorpusChart } from './corpus-chart';
import { EditableTable } from './editable-table';
import { SavingsAllocation } from './savings-allocation';
import { WealthMetrics } from './wealth-metrics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { RemainingAmountChart } from './remaining-amount-chart';
import { SavingsDistributionChart } from './savings-distribution-chart';

export function WealthDashboardView() {
  return (
    <div className="space-y-6">
      <WealthMetrics />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <RemainingAmountChart />
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <SavingsDistributionChart />
          <CorpusChart />
        </div>
      </div>
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="expenses">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="expenses">Daily Expenses</TabsTrigger>
              <TabsTrigger value="trips">Trip Costs</TabsTrigger>
              <TabsTrigger value="savings">Savings Allocation</TabsTrigger>
            </TabsList>
            <TabsContent value="expenses" className="mt-6">
              <EditableTable
                title="Daily Expenses"
                description="Track and manage your expenses for any selected day."
                type="expenses"
              />
            </TabsContent>
            <TabsContent value="trips" className="mt-6">
              <EditableTable
                title="Trip Costs"
                description="Plan for your travel expenses."
                type="trips"
              />
            </TabsContent>
            <TabsContent value="savings" className="mt-6">
              <SavingsAllocation />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
