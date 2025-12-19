
"use client";

import { useMemo } from "react";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { RoadmapItem } from './roadmap-view';

interface RoadmapProgressChartProps {
    items: RoadmapItem[];
}

const MAX_HOURS_PER_DAY = 4;

export function RoadmapProgressChart({ items }: RoadmapProgressChartProps) {

  const calculateItemProgress = (hours: number) => {
    return Math.min((hours / MAX_HOURS_PER_DAY) * 100, 100);
  };
  
  const overallProgress = useMemo(() => {
    if (!items || items.length === 0) {
      return 0;
    }
    const totalProgress = items.reduce((sum, item) => {
      return sum + calculateItemProgress(item.hoursSpent);
    }, 0);
    return totalProgress / items.length;
  }, [items]);

  const chartData = useMemo(() => {
    const completed = overallProgress;
    const remaining = 100 - completed;
    return [
      { name: "Completed", value: completed, fill: "hsl(var(--primary))" },
      { name: "Remaining", value: remaining, fill: "hsl(var(--muted))" },
    ];
  }, [overallProgress]);

  return (
    <div className="relative w-24 h-24">
        <ChartContainer
        config={{}}
        className="w-full h-full"
        >
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
            <ChartTooltip
                cursor={false}
                content={
                <ChartTooltipContent
                    formatter={(value) => `${(value as number).toFixed(1)}%`}
                    hideLabel
                />
                }
            />
            <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius="70%"
                outerRadius="100%"
                strokeWidth={2}
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
            <p className="text-2xl font-bold tracking-tighter">{overallProgress.toFixed(0)}%</p>
        </div>
    </div>
  );
}

