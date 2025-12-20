
'use client';

import { useState } from 'react';
import { CorpusChart } from './corpus-chart';
import { EditableTable } from './editable-table';
import { SavingsAllocation } from './savings-allocation';
import { WealthMetrics } from './wealth-metrics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { RemainingAmountChart } from './remaining-amount-chart';
import { SavingsDistributionChart } from './savings-distribution-chart';
import { format } from 'date-fns';
import { useApp } from '@/contexts/app-provider';
import { Skeleton } from '../ui/skeleton';

export function WealthDashboardView() {
  const { isInitialized } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const selectedMonthString = selectedDate ? format(selectedDate, 'yyyy-MM') : format(new Date(), 'yyyy-MM');

  if (!isInitialized) {
      return (
          <div className="space-y-6">
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Skeleton className="lg:col-span-1 h-96" />
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Skeleton className="h-96" />
                      <Skeleton className="h-96" />
                  </div>
              </div>
              <Skeleton className="h-[30rem] w-full" />
          </div>
      )
  }

  return (
    <div className="space-y-6">
      <WealthMetrics selectedMonth={selectedMonthString} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <RemainingAmountChart selectedMonth={selectedMonthString} />
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <SavingsDistributionChart selectedMonth={selectedMonthString} />
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
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
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
              <SavingsAllocation 
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
