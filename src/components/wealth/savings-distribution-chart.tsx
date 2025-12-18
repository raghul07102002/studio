
'use client';

import { useMemo } from 'react';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
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
    
    const mfTotal = mutualFunds ? Object.values(mutualFunds).flat().reduce((sum, fund) => sum + fund.amount, 0) : 0;
    const efTotal = emergencyFunds ? emergencyFunds.reduce((sum, fund) => sum + fund.amount, 0) : 0;
    const stgTotal = shortTermGoals ? shortTermGoals.reduce((sum, fund) => sum + fund.amount, 0) : 0;
    
    const totalAllocated = mfTotal + efTotal + stgTotal;
    const unallocated = monthlySavings - totalAllocated > 0 ? monthlySavings - totalAllocated : 0;

    return [
      { name: 'MF', value: mfTotal, fill: 'hsl(var(--chart-1))', fullName: 'Mutual Funds' },
      { name: 'EF', value: efTotal, fill: 'hsl(var(--chart-2))', fullName: 'Emergency Funds' },
      { name: 'STG', value: stgTotal, fill: 'hsl(var(--chart-3))', fullName: 'Short Term Goals' },
      { name: 'Unallocated', value: unallocated, fill: 'hsl(var(--muted))', fullName: 'Unallocated' },
    ].filter(item => item.value > 0);
  }, [monthlySavings, savingsAllocation]);

  const chartConfig = useMemo(() => {
    const config: any = {};
    chartData.forEach(item => {
        config[item.name] = { label: item.fullName, color: item.fill };
    });
    return config;
  }, [chartData]);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Savings Distribution</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full max-w-[300px] flex flex-col items-center"
        >
          <div className="relative aspect-square w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent 
                    formatter={(value, name, props) => {
                      const itemConfig = chartConfig[name as keyof typeof chartConfig];
                      return [`${(value as number).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}`, itemConfig.label]
                    }}
                    />}
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
                    {chartData.map((entry) => (
                    <Cell
                        key={`cell-${entry.name}`}
                        fill={entry.fill}
                        className="focus:outline-none"
                    />
                    ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center pointer-events-none">
                <p className="text-sm text-muted-foreground">Total Savings</p>
                <p className="text-3xl font-bold tracking-tighter">
                    {(monthlySavings || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
            </div>
          </div>
            <div className='-mt-4'>
                <ChartLegend
                    content={<ChartLegendContent nameKey="name" className="flex-wrap justify-center" />}
                    className="flex items-center justify-center"
                />
            </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
