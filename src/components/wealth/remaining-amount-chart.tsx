
'use client';

import { useMemo } from 'react';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { useApp } from '@/contexts/app-provider';
import { format } from 'date-fns';

interface RemainingAmountChartProps {
    selectedMonth: string; // "yyyy-MM"
}

export function RemainingAmountChart({ selectedMonth }: RemainingAmountChartProps) {
  const { wealthData } = useApp();
  const { expenseBudgets, expenses } = wealthData;

  const monthlyBudget = expenseBudgets?.[selectedMonth] || 0;

  const totalExpenses = useMemo(() => {
    if (!expenses) return 0;
    return Object.entries(expenses).reduce((total, [date, dailyExpenses]) => {
      if (date.startsWith(selectedMonth)) {
        return total + dailyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      }
      return total;
    }, 0);
  }, [expenses, selectedMonth]);
  
  const remainingAmount = monthlyBudget - totalExpenses > 0 ? monthlyBudget - totalExpenses : 0;
  const spentAmount = totalExpenses;

  const chartData = useMemo(() => {
    if (monthlyBudget === 0 && totalExpenses === 0) {
      return [{ name: 'No Budget Set', value: 1, fill: 'hsl(var(--muted))' }];
    }
    const data = [
      { name: 'Total Spent', value: spentAmount, fill: 'hsl(var(--chart-4))' },
      { name: 'Remaining', value: remainingAmount, fill: 'hsl(var(--chart-1))' },
    ];
    if (spentAmount > monthlyBudget) {
      data.find(d => d.name === 'Remaining')!.value = 0;
      data.find(d => d.name === 'Total Spent')!.value = spentAmount;
    }
    return data;
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
      <CardHeader className="pb-2">
        <CardTitle>Remaining Budget</CardTitle>
        <CardDescription>{format(new Date(selectedMonth), 'MMMM yyyy')}</CardDescription>
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
                  {(monthlyBudget - totalExpenses).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
          <ChartLegend
              content={<ChartLegendContent nameKey="name" className="flex-wrap justify-center" />}
              className="flex items-center justify-center"
          />
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
