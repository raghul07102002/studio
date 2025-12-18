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
import { isSameMonth } from 'date-fns';

export function RemainingAmountChart() {
  const { wealthData } = useWealth();
  const { monthlySalary, expenses } = wealthData;

  const totalExpenses = useMemo(() => {
    const now = new Date();
    return Object.entries(expenses).reduce((total, [date, dailyExpenses]) => {
      if (isSameMonth(new Date(date), now)) {
        return total + dailyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      }
      return total;
    }, 0);
  }, [expenses]);
  
  const remainingAmount = monthlySalary - totalExpenses > 0 ? monthlySalary - totalExpenses : 0;

  const chartData = useMemo(() => {
    if (monthlySalary === 0 && totalExpenses === 0) {
      return [{ name: 'No Data', value: 1, fill: 'hsl(var(--muted))' }];
    }
    return [
      { name: 'Total Expenses', value: totalExpenses, fill: 'hsl(var(--chart-4))' },
      { name: 'Remaining Amount', value: remainingAmount, fill: 'hsl(var(--chart-1))' },
    ];
  }, [totalExpenses, remainingAmount, monthlySalary]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Remaining Amount</CardTitle>
          <CardDescription>Monthly Salary vs. Expenses</CardDescription>
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
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="text-3xl font-bold tracking-tighter">
                {remainingAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
