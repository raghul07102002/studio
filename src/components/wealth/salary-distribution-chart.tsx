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

export function SalaryDistributionChart() {
  const { wealthData } = useWealth();
  const { monthlySalary, expenses } = wealthData;

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  );
  
  const savings = monthlySalary - totalExpenses > 0 ? monthlySalary - totalExpenses : 0;

  const chartData = useMemo(() => {
    if (monthlySalary === 0 && totalExpenses === 0) {
      return [{ name: 'No Data', value: 1, fill: 'hsl(var(--muted))' }];
    }
    return [
      { name: 'Expenses', value: totalExpenses, fill: 'hsl(var(--chart-2))' },
      { name: 'Savings', value: savings, fill: 'hsl(var(--chart-1))' },
    ];
  }, [totalExpenses, savings, monthlySalary]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Salary Distribution</CardTitle>
          <CardDescription>Expenses vs. Savings</CardDescription>
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
            <p className="text-sm text-muted-foreground">Total Salary</p>
            <p className="text-3xl font-bold tracking-tighter">
                {monthlySalary.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
