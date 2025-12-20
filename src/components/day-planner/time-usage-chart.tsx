'use client';

import { useMemo } from 'react';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useApp } from '@/contexts/app-provider';

const TOTAL_HOURS_IN_DAY = 24;

export function TimeUsageChart() {
  const { dayPlannerData } = useApp();
  const { tasks = [] } = dayPlannerData;

  const totalHours = useMemo(() => {
    return tasks.reduce((sum, task) => sum + task.hours, 0);
  }, [tasks]);

  const chartData = useMemo(() => {
    const usedHours = Math.min(totalHours, TOTAL_HOURS_IN_DAY);
    const freeHours = TOTAL_HOURS_IN_DAY - usedHours;
    return [
      { name: 'Planned Hours', value: usedHours, fill: 'hsl(var(--primary))' },
      { name: 'Free Hours', value: freeHours, fill: 'hsl(var(--muted))' },
    ];
  }, [totalHours]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Time Usage</CardTitle>
        <CardDescription>Planned vs. Free Time</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{}}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                    formatter={(value) => `${value.toFixed(1)} hours`}
                    hideLabel
                />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius="60%"
                strokeWidth={5}
                stroke="hsl(var(--background))"
                startAngle={90}
                endAngle={450}
                cornerRadius={8}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <div className="flex flex-col gap-2 p-4 text-center text-sm">
        <div className="leading-none text-muted-foreground">
          You have planned{' '}
          <span className="font-bold text-foreground">
            {totalHours.toFixed(1)} hours
          </span>{' '}
          today.
        </div>
      </div>
    </Card>
  );
}
