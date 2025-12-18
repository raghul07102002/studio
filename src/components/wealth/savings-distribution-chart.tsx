'use client';

import { useMemo } from 'react';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useWealth } from '@/contexts/wealth-provider';

export function SavingsDistributionChart() {
  const { wealthData } = useWealth();
  const { monthlySavings, savingsAllocation } = wealthData;

  const chartData = useMemo(() => {
    if (!savingsAllocation || monthlySavings === 0) {
        return [{ name: 'No Savings Data', value: 1, fill: 'hsl(var(--muted))' }];
    }
    const { mutualFunds, emergencyFunds, shortTermGoals } = savingsAllocation;
    const mfTotal = Object.values(mutualFunds).flat().reduce((sum, fund) => sum + fund.amount, 0);
    const efTotal = emergencyFunds.reduce((sum, fund) => sum + fund.amount, 0);
    const stgTotal = shortTermGoals.reduce((sum, fund) => sum + fund.amount, 0);
    
    const totalAllocated = mfTotal + efTotal + stgTotal;
    const unallocated = monthlySavings - totalAllocated > 0 ? monthlySavings - totalAllocated : 0;

    return [
      { name: 'Mutual Funds', value: mfTotal, fill: 'hsl(var(--chart-1))' },
      { name: 'Emergency Funds', value: efTotal, fill: 'hsl(var(--chart-2))' },
      { name: 'Short Term Goals', value: stgTotal, fill: 'hsl(var(--chart-3))' },
      { name: 'Unallocated', value: unallocated, fill: 'hsl(var(--muted))' },
    ].filter(item => item.value > 0);
  }, [monthlySavings, savingsAllocation]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Savings Distribution</CardTitle>
          <CardDescription>How your savings are allocated</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-[300px] aspect-square">
          <ChartContainer config={{}} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value) => `${(value as number).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}`}
                    />
                  }
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="70%"
                  outerRadius="100%"
                  strokeWidth={5}
                  stroke="hsl(var(--background))"
                  startAngle={90}
                  endAngle={450}
                  cornerRadius={8}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <p className="text-sm text-muted-foreground">Total Savings</p>
            <p className="text-3xl font-bold tracking-tighter">
                {monthlySavings.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
