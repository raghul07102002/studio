
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
  ChartLegendContent
} from '@/components/ui/chart';
import { useWealth } from '@/contexts/wealth-provider';
import { format, isSameMonth } from 'date-fns';

export function RemainingAmountChart() {
  const { wealthData } = useWealth();
  const { expenseBudgets, expenses } = wealthData;

  const currentMonthString = format(new Date(), 'yyyy-MM');
  const monthlyBudget = expenseBudgets?.[currentMonthString] || 0;

  const totalExpenses = useMemo(() => {
    const now = new Date();
    return Object.entries(expenses).reduce((total, [date, dailyExpenses]) => {
      if (isSameMonth(new Date(date), now)) {
        return total + dailyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      }
      return total;
    }, 0);
  }, [expenses]);
  
  const remainingAmount = monthlyBudget - totalExpenses > 0 ? monthlyBudget - totalExpenses : 0;
  const spentAmount = totalExpenses > monthlyBudget ? monthlyBudget : totalExpenses;

  const chartData = useMemo(() => {
    if (monthlyBudget === 0 && totalExpenses === 0) {
      return [{ name: 'No Budget Set', value: 1, fill: 'hsl(var(--muted))' }];
    }
    return [
      { name: 'Total Spent', value: spentAmount, fill: 'hsl(var(--chart-4))' },
      { name: 'Remaining', value: remainingAmount, fill: 'hsl(var(--chart-1))' },
    ];
  }, [spentAmount, remainingAmount, monthlyBudget, totalExpenses]);

  const chartConfig = useMemo(() => {
    const config: any = {};
    chartData.forEach(item => {
        config[item.name.replace(/\s/g, '')] = { label: item.name, color: item.fill };
    });
    return config;
  }, [chartData]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Remaining Budget</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full max-w-[300px] flex flex-col items-center"
        >
          <div className="relative w-full max-w-[300px] aspect-square">
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
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-3xl font-bold tracking-tighter">
                  {remainingAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
          <ChartLegend
            content={<ChartLegendContent nameKey="name" className="flex-wrap justify-center" />}
            className="flex items-center justify-center pt-4"
          />
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
