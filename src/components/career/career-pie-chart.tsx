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

export function CareerPieChart() {
  const chartData = useMemo(() => {
    return [
      { name: 'Skills Acquired', value: 40, fill: 'hsl(var(--chart-1))' },
      { name: 'Goals Achieved', value: 30, fill: 'hsl(var(--chart-2))' },
      { name: 'Projects Completed', value: 20, fill: 'hsl(var(--chart-3))' },
      { name: 'Networking', value: 10, fill: 'hsl(var(--chart-4))' },
    ];
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Overview</CardTitle>
        <CardDescription>Your career progress breakdown.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer config={{}} className="mx-auto aspect-square w-full max-w-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius="60%"
                strokeWidth={5}
                stroke="hsl(var(--background))"
              >
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
