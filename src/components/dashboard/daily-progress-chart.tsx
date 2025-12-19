
"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApp } from "@/contexts/app-provider";
import { getDailyProgression } from "@/lib/analysis";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format, parseISO } from "date-fns";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

export function DailyProgressChart() {
  const { habits, habitData, habitChartDateRange, setHabitChartDateRange, selectedView } = useApp();

  const [startDate, setStartDate] = useState(habitChartDateRange?.from ? format(habitChartDateRange.from, 'yyyy-MM-dd') : '');
  const [endDate, setEndDate] = useState(habitChartDateRange?.to ? format(habitChartDateRange.to, 'yyyy-MM-dd') : '');

  const handleApplyFilter = () => {
    const from = startDate ? parseISO(startDate) : undefined;
    const to = endDate ? parseISO(endDate) : from;
    setHabitChartDateRange({ from, to });
  };

  const chartData = useMemo(() => {
    return getDailyProgression(habitData, habits, habitChartDateRange);
  }, [habitData, habits, habitChartDateRange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Progress</CardTitle>
        <CardDescription>
          Your daily habit completion percentage over the selected period.
        </CardDescription>
        <div className="flex flex-col sm:flex-row items-end gap-4 pt-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="start-date-habit">Start Date</Label>
                <Input id="start-date-habit" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="end-date-habit">End Date</Label>
                <Input id="end-date-habit" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
            <Button onClick={handleApplyFilter}>Apply</Button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-72 w-full">
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 6)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                content={<ChartTooltipContent formatter={(value) => [`${(value as number).toFixed(1)}%`, 'Completion']} />}
              />
              <Area
                type="monotone"
                dataKey="completion"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorCompletion)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
