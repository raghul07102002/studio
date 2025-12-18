"use client";

import { useMemo } from "react";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useApp } from "@/contexts/app-provider";
import { calculateOverallCompletion } from "@/lib/analysis";
import { ViewSelector } from "../layout/view-selector";

export function CompletionPieChart() {
  const { habits, habitData, filteredDates } = useApp();

  const overallCompletion = useMemo(() => {
    return calculateOverallCompletion(habitData, habits, filteredDates);
  }, [habitData, habits, filteredDates]);

  const chartData = useMemo(() => {
    const completed = overallCompletion;
    const remaining = 100 - completed;
    return [
      { name: "Completed", value: completed, fill: "hsl(var(--primary))" },
      { name: "Remaining", value: remaining, fill: "hsl(var(--muted))" },
    ];
  }, [overallCompletion]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Overall Completion</CardTitle>
          <CardDescription>Your progress for the selected period.</CardDescription>
        </div>
        <ViewSelector />
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <ChartContainer
          config={{}}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <ResponsiveContainer width="100%" height={300}>
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
                innerRadius="60%"
                strokeWidth={5}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
       <div className="p-6 pt-0 text-center">
        <p className="text-4xl font-bold">{overallCompletion.toFixed(1)}%</p>
        <p className="text-muted-foreground">Completed</p>
      </div>
    </Card>
  );
}
