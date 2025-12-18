
'use client';

import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useFinancialReport } from '@/contexts/financial-report-provider';
import { format } from 'date-fns';

export function ExpenseTrendChart() {
  const { filteredExpenses, filteredDates, view } = useFinancialReport();

  const chartData = useMemo(() => {
    return filteredDates.map(date => {
      const dateString = format(date, 'yyyy-MM-dd');
      const dailyTotal = (filteredExpenses[dateString] || []).reduce((sum, exp) => sum + exp.amount, 0);
      return {
        date: format(date, 'MMM d'),
        expense: dailyTotal,
      };
    });
  }, [filteredDates, filteredExpenses]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Expense Trend</CardTitle>
          <CardDescription>
            Your daily expenses over the selected period.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-72 w-full">
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => view === 'Month' ? value : value.slice(0, 6)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip
                content={<ChartTooltipContent 
                    formatter={(value, name) => [`₹${(value as number).toLocaleString('en-IN')}`, 'Expense']}
                    />}
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="hsl(var(--chart-2))"
                fillOpacity={1}
                fill="url(#colorExpense)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
