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
import { Heart } from "lucide-react";

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
          <CardTitle>Completion Overview</CardTitle>
        </div>
        <ViewSelector />
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-[250px] aspect-square">
           <ChartContainer
            config={{}}
            className="absolute inset-0"
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
                    innerRadius="80%"
                    outerRadius="100%"
                    strokeWidth={0}
                    startAngle={90}
                    endAngle={450}
                >
                    {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                </PieChart>
            </ResponsiveContainer>
            </ChartContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-5xl font-bold text-primary">{overallCompletion.toFixed(1)}%</p>
                <p className="text-muted-foreground">Completed</p>
            </div>
        </div>
      </CardContent>
       <div className="p-6 pt-0 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-secondary/50 rounded-lg p-3">
            <Heart className="h-5 w-5 text-primary/50" />
            <p>Be kind to yourself. Small steps lead to big changes.</p>
        </div>
      </div>
    </Card>
  );
}
