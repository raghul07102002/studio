
"use client";

import { useMemo } from "react";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useCareer } from "@/contexts/career-provider";

const MAX_HOURS_PER_DAY = 4;

export function CareerPieChart() {
    const { roadmaps } = useCareer();

    const calculateItemProgress = (hours: number) => {
        return Math.min((hours / MAX_HOURS_PER_DAY) * 100, 100);
    };
    
    const overallProgress = useMemo(() => {
        const allItems = Object.values(roadmaps).flat();
        if (allItems.length === 0) {
            return 0;
        }
        const totalProgress = allItems.reduce((sum, item) => {
            return sum + calculateItemProgress(item.hoursSpent);
        }, 0);

        return totalProgress / allItems.length;
    }, [roadmaps]);

  const chartData = useMemo(() => {
    return [
      { name: "Completed", value: overallProgress, fill: "hsl(var(--chart-2))" },
      { name: "Remaining", value: 100 - overallProgress, fill: "hsl(var(--muted))" },
    ];
  }, [overallProgress]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Overall Progress</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-[300px] aspect-square">
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
            <p className="text-5xl font-bold tracking-tighter">{overallProgress.toFixed(0)}%</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
