
"use client";

import { useMemo } from "react";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { RoadmapItem, Subtask } from '@/lib/types';

interface RoadmapProgressChartProps {
    items: RoadmapItem[];
}

const MAX_HOURS_PER_DAY = 4;
const SUBTASK_PROGRESS_BONUS = 5;

export function RoadmapProgressChart({ items }: RoadmapProgressChartProps) {

  const calculateItemProgress = (item: { hoursSpent: number; subtasks?: Subtask[] }) => {
    const hoursProgress = Math.min((item.hoursSpent / MAX_HOURS_PER_DAY) * 100, 100);
    
    let subtaskBonus = 0;
    if (item.subtasks && item.subtasks.length > 0) {
        const completedSubtasks = item.subtasks.filter(st => st.completed).length;
        subtaskBonus = completedSubtasks * SUBTASK_PROGRESS_BONUS;
    }

    return Math.min(hoursProgress + subtaskBonus, 100);
  };
  
  const overallProgress = useMemo(() => {
    if (!items || items.length === 0) {
      return 0;
    }
    const totalProgress = items.reduce((sum, item) => {
      return sum + calculateItemProgress(item);
    }, 0);
    return totalProgress / items.length;
  }, [items]);

  const chartData = useMemo(() => {
    const completed = overallProgress;
    const remaining = 100 - completed;
    return [
      { name: "Completed", value: completed, fill: "hsl(var(--destructive))" },
      { name: "Remaining", value: remaining, fill: "hsl(var(--muted))" },
    ];
  }, [overallProgress]);

  return (
    <div className="relative w-40 h-40">
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
            <p className="text-4xl font-bold tracking-tighter">{overallProgress.toFixed(0)}%</p>
        </div>
    </div>
  );
}
